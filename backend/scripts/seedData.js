const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Message = require('../models/Message');
const Contact = require('../models/Contact');

dotenv.config();

// Sample webhook payloads for testing
const samplePayloads = [
  {
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "ENTRY_ID",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "15551234567",
            "phone_number_id": "PHONE_NUMBER_ID"
          },
          "contacts": [{
            "profile": {
              "name": "John Doe"
            },
            "wa_id": "1234567890"
          }],
          "messages": [{
            "from": "1234567890",
            "id": "wamid.HBgNMTIzNDU2Nzg5MAoSFQogZmFrZV9pZF8xMjM0NTY3ODkwFAMSBk1FU1NBR0UAAA",
            "timestamp": "1699123200",
            "text": {
              "body": "Hello! This is a test message from John."
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  },
  {
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "ENTRY_ID",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "15551234567",
            "phone_number_id": "PHONE_NUMBER_ID"
          },
          "contacts": [{
            "profile": {
              "name": "Jane Smith"
            },
            "wa_id": "0987654321"
          }],
          "messages": [{
            "from": "0987654321",
            "id": "wamid.HBgNMDk4NzY1NDMyMQoSFQogZmFrZV9pZF8wOTg3NjU0MzIxFAMSBk1FU1NBR0UAAA",
            "timestamp": "1699126800",
            "text": {
              "body": "Hi there! How are you doing today?"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  },
  {
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "ENTRY_ID",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "statuses": [{
            "id": "wamid.HBgNMTIzNDU2Nzg5MAoSFQogZmFrZV9pZF8xMjM0NTY3ODkwFAMSBk1FU1NBR0UAAA",
            "recipient_id": "1234567890",
            "status": "delivered",
            "timestamp": "1699123260"
          }]
        },
        "field": "messages"
      }]
    }]
  }
];

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
        $inc: { unread_count: messageData.direction === 'inbound' ? 1 : 0 }
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating contact info:', error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data (optional)
    // await Message.deleteMany({});
    // await Contact.deleteMany({});
    // console.log('Cleared existing data');
    
    let totalProcessed = 0;
    
    for (const payload of samplePayloads) {
      console.log('Processing payload...');
      const messages = await processWebhookPayload(payload);
      
      for (const messageData of messages) {
        try {
          // Check if message already exists
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
            console.log(`Updated message: ${messageData.id}`);
          } else {
            // Create new message
            const newMessage = new Message(messageData);
            await newMessage.save();
            console.log(`Created message: ${messageData.id}`);
          }
          
          // Update contact info
          if (messageData.contact_name || messageData.message_body) {
            await updateContactInfo(messageData);
          }
          
          totalProcessed++;
        } catch (messageError) {
          console.error('Error processing message:', messageError.message);
        }
      }
    }
    
    console.log(`✅ Seeding completed! Processed ${totalProcessed} messages`);
    
    // Display summary
    const messageCount = await Message.countDocuments();
    const contactCount = await Contact.countDocuments();
    
    console.log(`📊 Database Summary:`);
    console.log(`   Messages: ${messageCount}`);
    console.log(`   Contacts: ${contactCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Function to read JSON files from a directory
const seedFromJsonFiles = async (directory) => {
  try {
    await connectDB();
    
    if (!fs.existsSync(directory)) {
      console.log('Creating sample data directory and files...');
      fs.mkdirSync(directory, { recursive: true });
      
      // Create sample JSON files based on the real payloads
      const samplePayloads = [
        {
          "payload_type": "whatsapp_webhook",
          "_id": "conv1-msg1-user",
          "metaData": {
            "entry": [{
              "id": "30164062719905277",
              "changes": [{
                "field": "messages",
                "value": {
                  "messaging_product": "whatsapp",
                  "metadata": {
                    "display_phone_number": "918329446654",
                    "phone_number_id": "629305560276479"
                  },
                  "contacts": [{
                    "profile": {
                      "name": "John Doe"
                    },
                    "wa_id": "1234567890"
                  }],
                  "messages": [{
                    "from": "1234567890",
                    "id": "wamid.HBgNMTIzNDU2Nzg5MAoSFQogZmFrZV9pZF8xMjM0NTY3ODkwFAMSBk1FU1NBR0UAAA",
                    "timestamp": "1699123200",
                    "text": {
                      "body": "Hello! This is a test message from John."
                    },
                    "type": "text"
                  }]
                }
              }]
            }],
            "gs_app_id": "conv1-app",
            "object": "whatsapp_business_account"
          },
          "createdAt": "2025-08-06 12:00:00",
          "startedAt": "2025-08-06 12:00:00",
          "completedAt": "2025-08-06 12:00:01",
          "executed": true
        }
      ];
      
      samplePayloads.forEach((payload, index) => {
        fs.writeFileSync(
          path.join(directory, `sample_payload_${index + 1}.json`),
          JSON.stringify(payload, null, 2)
        );
      });
      
      console.log(`Created sample files in ${directory}`);
    }
    
    const files = fs.readdirSync(directory).filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      console.log('No JSON files found. Using sample data...');
      return seedDatabase();
    }
    
    console.log(`🌱 Processing ${files.length} JSON files...`);
    
    let totalProcessed = 0;
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      console.log(`Processing ${file}...`);
      
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
              await Message.findOneAndUpdate(
                { $or: [{ id: messageData.id }, { meta_msg_id: messageData.meta_msg_id }] },
                messageData,
                { new: true, runValidators: true }
              );
            } else {
              const newMessage = new Message(messageData);
              await newMessage.save();
            }
            
            await updateContactInfo(messageData);
            totalProcessed++;
          } catch (messageError) {
            console.error(`Error processing message from ${file}:`, messageError.message);
          }
        }
      } catch (fileError) {
        console.error(`Error processing file ${file}:`, fileError.message);
      }
    }
    
    console.log(`✅ Processing completed! Processed ${totalProcessed} messages`);
    
    const messageCount = await Message.countDocuments();
    const contactCount = await Contact.countDocuments();
    
    console.log(`📊 Database Summary:`);
    console.log(`   Messages: ${messageCount}`);
    console.log(`   Contacts: ${contactCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Processing failed:', error);
    process.exit(1);
  }
};

// Check command line arguments
const args = process.argv.slice(2);
if (args[0] === '--from-files' && args[1]) {
  seedFromJsonFiles(args[1]);
} else if (args[0] === '--from-files') {
  seedFromJsonFiles('./sample_data');
} else {
  seedDatabase();
}
