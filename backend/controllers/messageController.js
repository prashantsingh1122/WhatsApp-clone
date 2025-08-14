const Message = require('../models/Message');
const Contact = require('../models/Contact');
const { v4: uuidv4 } = require('uuid');

// Process webhook payload
const processWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    console.log('Received webhook:', JSON.stringify(webhookData, null, 2));

    // Extract message data from webhook payload
    const messages = extractMessagesFromWebhook(webhookData);
    
    const processedMessages = [];
    
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
          // Update existing message (e.g., status change)
          const updatedMessage = await Message.findOneAndUpdate(
            { $or: [{ id: messageData.id }, { meta_msg_id: messageData.meta_msg_id }] },
            { 
              ...messageData,
              webhook_data: webhookData 
            },
            { new: true, runValidators: true }
          );
          processedMessages.push(updatedMessage);
        } else {
          // Create new message
          const newMessage = new Message({
            ...messageData,
            webhook_data: webhookData
          });
          const savedMessage = await newMessage.save();
          processedMessages.push(savedMessage);
        }

        // Update contact information
        await updateContactInfo(messageData);
        
      } catch (messageError) {
        console.error('Error processing individual message:', messageError);
      }
    }

    // Emit to Socket.IO clients
    const io = req.app.get('io');
    processedMessages.forEach(message => {
      io.emit('messageUpdate', message);
    });

    res.status(200).json({ 
      success: true, 
      processed: processedMessages.length,
      messages: processedMessages 
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
};

// Extract messages from webhook payload
const extractMessagesFromWebhook = (webhookData) => {
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
                id: msg.id || uuidv4(),
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
    console.error('Error extracting messages from webhook:', error);
  }
  
  return messages;
};

// Update contact information
const updateContactInfo = async (messageData) => {
  try {
    await Contact.findOneAndUpdate(
      { wa_id: messageData.wa_id },
      {
        wa_id: messageData.wa_id,
        phone_number: messageData.phone_number,
        contact_name: messageData.contact_name || messageData.phone_number,
        last_message_time: messageData.timestamp,
        last_message_preview: messageData.message_body.substring(0, 50),
        $inc: { unread_count: messageData.direction === 'inbound' ? 1 : 0 }
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating contact info:', error);
  }
};

// Get all conversations
const getConversations = async (req, res) => {
  try {
    const contacts = await Contact.find({})
      .sort({ last_message_time: -1 })
      .limit(100);
    
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Get messages for a specific contact
const getMessages = async (req, res) => {
  try {
    const { wa_id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const messages = await Message.find({ wa_id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Mark messages as read
    await Contact.findOneAndUpdate(
      { wa_id },
      { unread_count: 0 }
    );
    
    res.json({
      messages: messages.reverse(), // Return in chronological order
      hasMore: messages.length === parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Send a new message (demo - saves to database only)
const sendMessage = async (req, res) => {
  try {
    const { wa_id, message_body, message_type = 'text' } = req.body;
    
    if (!wa_id || !message_body) {
      return res.status(400).json({ error: 'wa_id and message_body are required' });
    }
    
    const newMessage = new Message({
      id: uuidv4(),
      wa_id,
      phone_number: wa_id,
      message_type,
      message_body,
      timestamp: new Date(),
      status: 'sent',
      direction: 'outbound'
    });
    
    const savedMessage = await newMessage.save();
    
    // Update contact
    await updateContactInfo({
      wa_id,
      phone_number: wa_id,
      message_body,
      timestamp: new Date(),
      direction: 'outbound'
    });
    
    // Emit to Socket.IO clients
    const io = req.app.get('io');
    io.emit('messageUpdate', savedMessage);
    
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Update message status
const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;
    
    const updatedMessage = await Message.findOneAndUpdate(
      { $or: [{ id: messageId }, { meta_msg_id: messageId }] },
      { status },
      { new: true }
    );
    
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Emit to Socket.IO clients
    const io = req.app.get('io');
    io.emit('messageUpdate', updatedMessage);
    
    res.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
};

module.exports = {
  processWebhook,
  getConversations,
  getMessages,
  sendMessage,
  updateMessageStatus
};
