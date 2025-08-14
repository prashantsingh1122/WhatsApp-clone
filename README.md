# WhatsApp Web Clone

A full-stack WhatsApp Web clone built with React, Node.js, MongoDB, and Socket.IO. This application mimics the core functionality of WhatsApp Web with real-time messaging, typing indicators, and a responsive design.

## 🚀 Features

### Backend Features
- **Webhook Processing**: Handles WhatsApp Business API webhooks
- **Real-time Messaging**: WebSocket support with Socket.IO
- **Message Status Tracking**: Sent, delivered, read status updates
- **Contact Management**: Automatic contact creation and updates
- **MongoDB Integration**: Scalable database with proper indexing
- **RESTful API**: Clean API endpoints for frontend integration

### Frontend Features
- **WhatsApp-like UI**: Dark theme matching WhatsApp Web design
- **Real-time Updates**: Live message updates without refresh
- **Typing Indicators**: Shows when someone is typing
- **Responsive Design**: Works on both desktop and mobile
- **Message Types**: Support for text, images, documents, audio, location, and contacts
- **Conversation Management**: Easy navigation between chats
- **Search Functionality**: Find conversations quickly

### Real-time Features
- **Live Messaging**: Instant message delivery
- **Status Updates**: Real-time message status changes
- **Typing Indicators**: See when contacts are typing
- **Online Status**: Visual indicators for active users

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Styled Components** - CSS-in-JS styling
- **Socket.IO Client** - Real-time client
- **Axios** - HTTP client
- **Moment.js** - Date/time handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd whatsapp-clone
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp env.example .env

# Edit .env with your configuration
# MONGODB_URI=your_mongodb_atlas_connection_string
# WEBHOOK_VERIFY_TOKEN=your_webhook_token

npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create environment file
cp env.example .env

# Edit .env with your backend URL
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_SOCKET_URL=http://localhost:5000

npm start
```

### 4. Database Seeding (Optional)
```bash
cd backend
npm run seed
```

## 🌐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_NAME=WhatsApp Web Clone
```

## 📱 API Endpoints

### Webhook
- `POST /api/webhook` - Process WhatsApp webhooks
- `GET /api/webhook` - Webhook verification

### Messages
- `GET /api/conversations` - Get all conversations
- `GET /api/messages/:wa_id` - Get messages for a contact
- `POST /api/messages` - Send a new message
- `PUT /api/messages/:messageId/status` - Update message status

## 🧪 Testing with Real WhatsApp Payloads

The project includes real WhatsApp webhook payload files for testing and development. These files are located in `backend/scripts/` and contain actual webhook data structures.

### Available Payload Files

- `conversation_1_message_1.json` - First message from Ravi Kumar
- `conversation_1_status_1.json` - Status update for first message
- `conversation_2_message_1.json` - First message from Neha Joshi
- `conversation_2_status_1.json` - Status update for Neha's message
- `conversation_2_message_2.json` - Second message from Neha Joshi
- `conversation_2_status_2.json` - Status update for second message

### Processing Real Payloads

#### Option 1: Using npm scripts
```bash
# Test the payload structure (no database required)
npm run test-payloads

# Process payloads and save to database (requires MongoDB)
npm run process-real
```

#### Option 2: Using deployment scripts
```bash
# Windows
deploy.bat

# Mac/Linux
./deploy.sh
```

#### Option 3: Using API endpoint
```bash
# Test individual payload files
curl -X POST http://localhost:5000/api/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"payloadFile": "conversation_1_message_1.json"}'
```

### Payload Structure Analysis

The real payloads have this structure:
```json
{
  "payload_type": "whatsapp_webhook",
  "_id": "conv1-msg1-user",
  "metaData": {
    "entry": [{
      "id": "30164062719905277",
      "changes": [{
        "field": "messages",
        "value": {
          "contacts": [{
            "profile": { "name": "Ravi Kumar" },
            "wa_id": "919937320320"
          }],
          "messages": [{
            "from": "919937320320",
            "id": "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggMTIzQURFRjEyMzQ1Njc4OTA=",
            "timestamp": "1754400000",
            "text": { "body": "Hi, I'd like to know more about your services." },
            "type": "text"
          }],
          "metadata": {
            "display_phone_number": "918329446654",
            "phone_number_id": "629305560276479"
          }
        }
      }]
    }],
    "gs_app_id": "conv1-app",
    "object": "whatsapp_business_account"
  }
}
```

### Key Differences from Standard Webhooks

1. **Structure**: Uses `metaData.entry` instead of `entry`
2. **Additional Fields**: Includes `payload_type`, `_id`, `gs_app_id`
3. **Enhanced Metadata**: More detailed contact and message information
4. **Status Updates**: Include conversation details, pricing, and GS IDs

### Database Schema Updates

The Message model has been enhanced to store:
- `webhook_metadata.payload_type` - Type of webhook payload
- `webhook_metadata.gs_app_id` - Google Sheets app identifier
- `webhook_metadata.conversation_id` - Conversation identifier
- `webhook_metadata.pricing` - Message pricing information
- `webhook_metadata.gs_id` - Google Sheets specific ID

### Testing Webhook Integration

1. **Start the backend server**:
   ```bash
   npm run dev:backend
   ```

2. **Test payload structure**:
   ```bash
   npm run test-payloads
   ```

3. **Process real payloads**:
   ```bash
   npm run process-real
   ```

4. **Verify in database**:
   - Check MongoDB for processed messages
   - Verify contact information
   - Confirm status updates

### Webhook Endpoint Testing

For production testing, you can use tools like ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 5000

# Use the ngrok URL as your webhook endpoint
# Example: https://abc123.ngrok.io/api/webhook
```

## 🚀 Deployment

### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy automatically

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Environment Variables for Production
```env
# Backend (Render)
MONGODB_URI=your_mongodb_atlas_connection
CORS_ORIGIN=https://your-frontend-domain.vercel.app
WEBHOOK_VERIFY_TOKEN=your_webhook_token
JWT_SECRET=your_secure_jwt_secret

# Frontend (Vercel)
REACT_APP_API_URL=https://your-backend-domain.onrender.com/api
REACT_APP_SOCKET_URL=https://your-backend-domain.onrender.com
```

## 🔧 Development

### Running in Development Mode
```bash
# Backend
cd backend
npm run dev

# Frontend (in new terminal)
cd frontend
npm start
```

### Database Seeding
```bash
cd backend
npm run seed

# Seed from JSON files
npm run seed -- --from-files ./sample_data
```

### Testing Webhooks
Use tools like ngrok to test webhooks locally:
```bash
ngrok http 5000
# Use the ngrok URL as your webhook endpoint
```

## 📁 Project Structure

```
whatsapp-clone/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── messageController.js
│   ├── models/
│   │   ├── Contact.js
│   │   └── Message.js
│   ├── routes/
│   │   └── messageRoutes.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatArea.js
│   │   │   ├── ConversationItem.js
│   │   │   ├── MessageBubble.js
│   │   │   └── styles/
│   │   │       └── Styles.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🎯 Features Roadmap

### Planned Features
- [ ] User authentication and authorization
- [ ] Message encryption
- [ ] File upload and sharing
- [ ] Group chat functionality
- [ ] Message reactions and replies
- [ ] Voice and video calls
- [ ] Push notifications
- [ ] Message search functionality
- [ ] Contact import/export
- [ ] Message backup and restore

### Current Features
- [x] Real-time messaging
- [x] Typing indicators
- [x] Message status tracking
- [x] Responsive design
- [x] Webhook processing
- [x] Contact management
- [x] Search functionality
- [x] Multiple message types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WhatsApp Web for UI inspiration
- Socket.IO for real-time functionality
- MongoDB Atlas for database hosting
- Render and Vercel for deployment platforms

## 📞 Support

If you have any questions or need help:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code examples

---

**Note**: This is a clone/educational project and is not affiliated with WhatsApp Inc. Use responsibly and in accordance with applicable laws and terms of service.
