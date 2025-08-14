# WhatsApp Web Clone

A full-stack WhatsApp Web clone application built with Node.js, React, MongoDB, and Socket.IO. This application processes WhatsApp Business API webhook payloads, stores message data, and provides a responsive web interface that mimics WhatsApp Web.

## 🚀 Features

- **Backend (Node.js + Express)**
  - WhatsApp Business API webhook processing
  - MongoDB integration with message storage
  - Real-time messaging with Socket.IO
  - RESTful API endpoints
  - Message status tracking (sent, delivered, read)
  - Contact management

- **Frontend (React)**
  - WhatsApp Web-style responsive UI
  - Real-time message updates
  - Conversation list with search functionality
  - Message bubbles with timestamps and status indicators
  - Mobile-responsive design
  - Dark theme matching WhatsApp Web

- **Database (MongoDB)**
  - Message collection (`processed_messages`)
  - Contact management
  - Efficient indexing for performance

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/whatsapp-clone.git
cd whatsapp-clone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/whatsapp?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
WEBHOOK_VERIFY_TOKEN=your_verify_token_here
```

#### MongoDB Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database named `whatsapp`
4. Get your connection string and replace the `MONGODB_URI` in `.env`
5. Whitelist your IP address in Atlas Network Access

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Sample Data Population

To populate the database with sample data:

```bash
cd backend
npm run seed
```

Or to load from JSON files:

```bash
npm run seed -- --from-files ./sample_data
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

2. **Start the Frontend (in a new terminal):**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the Frontend:**
```bash
cd frontend
npm run build
```

2. **Start the Backend:**
```bash
cd backend
npm start
```

## 📡 API Endpoints

### Webhook Endpoints
- `POST /api/webhook` - Process WhatsApp Business API webhook
- `GET /api/webhook` - Webhook verification (for WhatsApp setup)

### Message Endpoints
- `GET /api/conversations` - Get all conversations
- `GET /api/messages/:wa_id` - Get messages for a specific contact
- `POST /api/messages` - Send a new message
- `PUT /api/messages/:messageId/status` - Update message status

### Health Check
- `GET /health` - Application health status

## 🚀 Deployment

### Deploy to Render

#### Backend Deployment
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `MONGODB_URI=your_mongodb_connection_string`
     - `CORS_ORIGIN=https://your-frontend-url.onrender.com`

#### Frontend Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`
   - **Environment Variables:**
     - `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`
     - `REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com`

### Deploy to Vercel (Frontend)

```bash
cd frontend
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `REACT_APP_API_URL`
- `REACT_APP_SOCKET_URL`

### Deploy to Heroku (Backend)

```bash
cd backend
git init
heroku create your-app-name
git add .
git commit -m "Initial commit"
git push heroku main
```

Set environment variables:
```bash
heroku config:set MONGODB_URI=your_connection_string
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend-url.com
```

## 🧪 Testing Webhook Integration

### Using Sample Data
The application includes sample webhook payloads. To test:

```bash
cd backend
npm run seed
```

### Testing with Postman
Send POST requests to `http://localhost:5000/api/webhook` with sample WhatsApp webhook payloads.

### Webhook Payload Example
```json
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
          "id": "wamid.unique_message_id",
          "timestamp": "1699123200",
          "text": {
            "body": "Hello! This is a test message."
          },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

## 🔧 Database Schema

### Messages Collection (`processed_messages`)
```javascript
{
  id: String (unique),
  meta_msg_id: String (unique, sparse),
  wa_id: String (indexed),
  contact_name: String,
  phone_number: String,
  message_type: String (enum: ['text', 'image', 'document', 'audio', 'video', 'location', 'contact']),
  message_body: String,
  message_url: String,
  timestamp: Date,
  status: String (enum: ['sent', 'delivered', 'read', 'failed']),
  direction: String (enum: ['inbound', 'outbound']),
  webhook_data: Mixed
}
```

### Contacts Collection
```javascript
{
  wa_id: String (unique, indexed),
  phone_number: String,
  contact_name: String,
  profile_picture: String,
  last_message_time: Date,
  last_message_preview: String,
  unread_count: Number
}
```

## 🌟 Features in Detail

### Real-time Messaging
- Socket.IO integration for instant message delivery
- Automatic conversation updates
- Message status synchronization

### Responsive Design
- Mobile-first approach
- Adaptive layout for different screen sizes
- Touch-friendly interface

### Message Status Tracking
- ✓ Sent (single check)
- ✓✓ Delivered (double check)
- ✓✓ Read (double check, colored)

### Search Functionality
- Search by contact name
- Search by phone number
- Search by message content

## 🔒 Security Considerations

- Input validation on all endpoints
- CORS configuration
- Environment variable usage for sensitive data
- MongoDB connection security

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MONGODB_URI format
   - Check network access in MongoDB Atlas
   - Ensure database name matches

2. **Socket.IO Connection Issues**
   - Check CORS settings
   - Verify port configuration
   - Check firewall settings

3. **Frontend API Errors**
   - Verify backend is running
   - Check API_URL configuration
   - Inspect browser network tab

### Logs
- Backend logs: Check console output
- Frontend logs: Open browser developer tools
- Database logs: Check MongoDB Atlas logs

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WhatsApp Web for design inspiration
- Socket.IO for real-time functionality
- MongoDB for database services
- React community for excellent documentation

---

**Note:** This is a demo application for educational purposes. It simulates WhatsApp functionality but does not actually send messages through WhatsApp's service. For production use with real WhatsApp Business API, additional setup and verification with Meta is required.
