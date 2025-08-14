const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  meta_msg_id: {
    type: String,
    unique: true,
    sparse: true
  },
  wa_id: {
    type: String,
    required: true,
    index: true
  },
  contact_name: {
    type: String,
    default: ''
  },
  phone_number: {
    type: String,
    required: true
  },
  message_type: {
    type: String,
    enum: ['text', 'image', 'document', 'audio', 'video', 'location', 'contact'],
    default: 'text'
  },
  message_body: {
    type: String,
    default: ''
  },
  message_url: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  webhook_data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  webhook_metadata: {
    payload_type: String,
    gs_app_id: String,
    phone_number_id: String,
    display_phone_number: String,
    conversation_id: String,
    conversation_origin: String,
    conversation_expiration: String,
    pricing: {
      billable: Boolean,
      category: String,
      pricing_model: String,
      type: String
    },
    gs_id: String
  }
}, {
  timestamps: true,
  collection: 'processed_messages'
});

// Index for efficient querying
messageSchema.index({ wa_id: 1, timestamp: -1 });
messageSchema.index({ id: 1 });
messageSchema.index({ meta_msg_id: 1 });
messageSchema.index({ 'webhook_metadata.gs_app_id': 1 });

module.exports = mongoose.model('Message', messageSchema);
