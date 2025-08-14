const express = require('express');
const router = express.Router();
const {
  processWebhook,
  getConversations,
  getMessages,
  sendMessage,
  updateMessageStatus
} = require('../controllers/messageController');

// Webhook endpoint for WhatsApp Business API
router.post('/webhook', processWebhook);

// Webhook verification (required by WhatsApp)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  // Replace 'your_verify_token' with your actual verify token
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'your_verify_token';
  
  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

// Get all conversations
router.get('/conversations', getConversations);

// Get messages for a specific contact
router.get('/messages/:wa_id', getMessages);

// Send a new message
router.post('/messages', sendMessage);

// Update message status
router.put('/messages/:messageId/status', updateMessageStatus);

module.exports = router;
