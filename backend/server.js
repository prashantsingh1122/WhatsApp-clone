const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration
const getCorsOrigins = () => {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  }
  return [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "https://whatsapp-clonee-alpha.vercel.app",
    "https://whatsapp-clonee-git-main-itsshivam135-gmailcoms-projects.vercel.app",
    "https://whatsapp-clonee-ncarn3kik-itsshivam135-gmailcoms-projects.vercel.app"
  ];
};

const corsOptions = {
  origin: getCorsOrigins(),
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

// Debug CORS configuration
console.log('🌐 CORS Origins:', getCorsOrigins());
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('📡 CORS_ORIGIN env var:', process.env.CORS_ORIGIN);

app.use(cors(corsOptions));

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: corsOptions
});

// Make io available to controllers
app.set('io', io);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', messageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'WhatsApp Clone Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      webhook: '/api/webhook',
      conversations: '/api/conversations',
      messages: '/api/messages/:wa_id',
      sendMessage: 'POST /api/messages',
      updateStatus: 'PUT /api/messages/:messageId/status'
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_conversation', (wa_id) => {
    socket.join(`conversation_${wa_id}`);
    console.log(`Client ${socket.id} joined conversation ${wa_id}`);
  });
  
  socket.on('leave_conversation', (wa_id) => {
    socket.leave(`conversation_${wa_id}`);
    console.log(`Client ${socket.id} left conversation ${wa_id}`);
  });

  socket.on('typing', (data) => {
    const { wa_id, isTyping } = data;
    // Broadcast typing status to other users in the conversation
    socket.to(`conversation_${wa_id}`).emit('typing', { wa_id, isTyping });
    console.log(`User ${wa_id} is ${isTyping ? 'typing' : 'not typing'}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
