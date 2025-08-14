import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
    console.log('Connecting to Socket.IO server:', SOCKET_URL);
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from Socket.IO server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('Socket disconnected');
    }
  }

  // Join a conversation room
  joinConversation(waId) {
    if (this.socket?.connected) {
      this.socket.emit('join_conversation', waId);
      console.log('Joined conversation:', waId);
    }
  }

  // Leave a conversation room
  leaveConversation(waId) {
    if (this.socket?.connected) {
      this.socket.emit('leave_conversation', waId);
      console.log('Left conversation:', waId);
    }
  }

  // Listen for message updates
  onMessageUpdate(callback) {
    if (this.socket) {
      this.socket.on('messageUpdate', callback);
      this.listeners.set('messageUpdate', callback);
    }
  }

  // Remove message update listener
  offMessageUpdate() {
    if (this.socket && this.listeners.has('messageUpdate')) {
      this.socket.off('messageUpdate', this.listeners.get('messageUpdate'));
      this.listeners.delete('messageUpdate');
    }
  }

  // Generic event listener
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  // Remove generic event listener
  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
