const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  wa_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  phone_number: {
    type: String,
    required: true
  },
  contact_name: {
    type: String,
    default: ''
  },
  profile_picture: {
    type: String,
    default: ''
  },
  last_message_time: {
    type: Date,
    default: Date.now
  },
  last_message_preview: {
    type: String,
    default: ''
  },
  unread_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
