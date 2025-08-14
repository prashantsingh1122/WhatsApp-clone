const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Message = require('../models/Message');
const Contact = require('../models/Contact');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const processWebhookPayload = async (webhookData) => {
  const messages = [];
  
  try {
    // Handle the real WhatsApp webhook structure
    const entries = webhookData.metaData?.entry || webhookData.entry || [];
    
    entries.forEach(entry => {
      if (entry.changes) {
        entry.changes.forEach(change => {
          if (change.value && change.value.messages) {
            change.value.messages.forEach(msg => {
              // Find contact info
              const contact = change.value.contacts?.find(c => c.wa_id === msg.from);
              const contactName = contact?.profile?.name || msg.from;
              
              const messageData = {
                id: msg.id,
                meta_msg_id: msg.id,
                wa_id: msg.from,
                phone_number: msg.from,
                contact_name: contactName,
                message_type: msg.type || 'text',
                message_body: msg.text?.body || msg.caption || '',
                message_url: msg.image?.link || msg.document?.link || msg.audio?.link || '',
                timestamp: new Date(parseInt(msg.timestamp) * 1000),
                status: 'delivered',
                direction: 'inbound',
                webhook_data: webhookData,
                webhook_metadata: {
                  payload_type: webhookData.payload_type,
                  gs_app_id: webhookData.gs_app_id,
                  phone_number_id: change.value.metadata?.phone_number_id,
                  display_phone_number: change.value.metadata?.display_phone_number
                }
              };
              messages.push(messageData);
            });
          }
          
          // Handle status updates with the real structure
          if (change.value && change.value.statuses) {
            change.value.statuses.forEach(status => {
              const messageData = {
                id: status.id,
                meta_msg_id: status.meta_msg_id || status.id,
                status: status.status,
                wa_id: status.recipient_id,
                phone_number: status.recipient_id,
                timestamp: new Date(parseInt(status.timestamp) * 1000),
                direction: 'outbound',
                webhook_data: webhookData,
                webhook_metadata: {
                  payload_type: webhookData.payload_type,
                  gs_app_id: webhookData.gs_app_id,
                  conversation_id: status.conversation?.id,
                  conversation_origin: status.conversation?.origin?.type,
                  conversation_expiration: status.conversation?.expiration_timestamp,
                  pricing: status.pricing,
                  gs_id: status.gs_id
                }
              };
              messages.push(messageData);
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
  }
  
  return messages;
};

const updateContactInfo = async (messageData) => {
  try {
    await Contact.findOneAndUpdate(
      { wa_id: messageData.wa_id },
      {
        wa_id: messageData.wa_id,
        phone_number: messageData.phone_number,
        contact_name: messageData.contact_name || messageData.phone_number,
        last_message_time: messageData.timestamp,
        last_message_preview: messageData.message_body?.substring(0, 50) || '',
        last_message_type: messageData.message_type,
        $inc: { unread_count: messageData.direction === 'inbound' ? 1 : 0 }
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating contact info:', error);
  }
};

const processRealPayloads = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Processing real WhatsApp webhook payloads...');
    
    // Process the real payload files
    const payloadFiles = [
      'conversation_1_message_1.json',
      'conversation_1_status_1.json',
      'conversation_2_message_1.json',
      'conversation_2_status_1.json',
      'conversation_2_message_2.json',
      'conversation_2_status_2.json'
    ];
    
    let totalProcessed = 0;
    
    for (const fileName of payloadFiles) {
      const filePath = path.join(__dirname, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${fileName}`);
        continue;
      }
      
      console.log(`📄 Processing ${fileName}...`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const payload = JSON.parse(fileContent);
        
        const messages = await processWebhookPayload(payload);
        
        for (const messageData of messages) {
          try {
            const existingMessage = await Message.findOne({
              $or: [
                { id: messageData.id },
                { meta_msg_id: messageData.meta_msg_id }
              ]
            });
            
            if (existingMessage) {
              // Update existing message
              await Message.findOneAndUpdate(
                { $or: [{ id: messageData.id }, { meta_msg_id: messageData.meta_msg_id }] },
                messageData,
                { new: true, runValidators: true }
              );
              console.log(`🔄 Updated message: ${messageData.id}`);
            } else {
              // Create new message
              const newMessage = new Message(messageData);
              await newMessage.save();
              console.log(`✅ Created message: ${messageData.id}`);
            }
            
            // Update contact info
            if (messageData.contact_name || messageData.message_body) {
              await updateContactInfo(messageData);
            }
            
            totalProcessed++;
          } catch (messageError) {
            console.error(`❌ Error processing message from ${fileName}:`, messageError.message);
          }
        }
      } catch (fileError) {
        console.error(`❌ Error processing file ${fileName}:`, fileError.message);
      }
    }
    
    console.log(`\n🎉 Processing completed! Processed ${totalProcessed} messages`);
    
    // Display summary
    const messageCount = await Message.countDocuments();
    const contactCount = await Contact.countDocuments();
    
    console.log(`\n📊 Database Summary:`);
    console.log(`   Messages: ${messageCount}`);
    console.log(`   Contacts: ${contactCount}`);
    
    // Show conversation breakdown
    const conversations = await Contact.find({}).sort({ last_message_time: -1 });
    console.log(`\n💬 Conversations:`);
    conversations.forEach(conv => {
      console.log(`   ${conv.contact_name || conv.phone_number} (${conv.wa_id})`);
      console.log(`     Last message: ${conv.last_message_preview}`);
      console.log(`     Unread: ${conv.unread_count}`);
      console.log(`     Time: ${conv.last_message_time}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Processing failed:', error);
    process.exit(1);
  }
};

// Run the script
processRealPayloads();
