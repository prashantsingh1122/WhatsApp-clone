import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/api';
import socketService from '../services/socket';
import MessageBubbleComponent from './MessageBubble';
import {
  ChatArea,
  ChatHeader,
  BackButton,
  Avatar,
  ContactInfo,
  ContactName,
  MessagesContainer,
  MessageInputArea,
  MessageInput,
  SendButton,
  EmptyState,
  LoadingSpinner,
  ErrorMessage,
  TypingIndicator,
  MessageReactions,
  ReactionButton
} from './styles/Styles';

const ChatAreaComponent = ({ selectedContact, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketService.emit('typing', { wa_id: selectedContact.wa_id, isTyping: true });
    }
    
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      setIsTyping(false);
      socketService.emit('typing', { wa_id: selectedContact.wa_id, isTyping: false });
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  // Load messages for selected contact
  const loadMessages = async (pageNum = 1, append = false) => {
    if (!selectedContact) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await messageService.getMessages(selectedContact.wa_id, pageNum, 50);
      
      if (append) {
        setMessages(prev => [...response.messages, ...prev]);
      } else {
        setMessages(response.messages);
        setTimeout(scrollToBottom, 100);
      }
      
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedContact || isSending) return;
    
    setIsSending(true);
    const messageText = inputMessage.trim();
    setInputMessage(''); // Clear input immediately for better UX
    
    // Clear typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setIsTyping(false);
    socketService.emit('typing', { wa_id: selectedContact.wa_id, isTyping: false });
    
    try {
      const newMessage = await messageService.sendMessage(
        selectedContact.wa_id,
        messageText
      );
      
      // Add message to local state immediately
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      setInputMessage(messageText); // Restore message if failed
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea and handle typing
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    handleTyping();
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  // Load messages when contact changes
  useEffect(() => {
    if (selectedContact) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      loadMessages(1);
      
      // Join the conversation room for real-time updates
      socketService.joinConversation(selectedContact.wa_id);
      
      return () => {
        socketService.leaveConversation(selectedContact.wa_id);
      };
    }
  }, [selectedContact]);

  // Set up Socket.IO listeners for real-time updates
  useEffect(() => {
    const handleMessageUpdate = (updatedMessage) => {
      if (!selectedContact || updatedMessage.wa_id !== selectedContact.wa_id) {
        return;
      }
      
      setMessages(prev => {
        // Check if message already exists (update) or is new
        const existingIndex = prev.findIndex(msg => 
          msg.id === updatedMessage.id || msg.meta_msg_id === updatedMessage.meta_msg_id
        );
        
        if (existingIndex !== -1) {
          // Update existing message
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...updatedMessage };
          return updated;
        } else {
          // Add new message
          return [...prev, updatedMessage];
        }
      });
      
      // Scroll to bottom if user is near the bottom
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
        if (isNearBottom) {
          setTimeout(scrollToBottom, 100);
        }
      }
    };

    const handleTypingUpdate = (data) => {
      if (data.wa_id === selectedContact?.wa_id) {
        setIsTyping(data.isTyping);
      }
    };

    socketService.onMessageUpdate(handleMessageUpdate);
    socketService.on('typing', handleTypingUpdate);
    
    return () => {
      socketService.offMessageUpdate();
      socketService.off('typing');
    };
  }, [selectedContact]);

  // Load more messages when scrolling to top
  const handleScroll = () => {
    if (!messagesContainerRef.current || isLoading || !hasMore) return;
    
    const container = messagesContainerRef.current;
    if (container.scrollTop === 0) {
      loadMessages(page + 1, true);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!selectedContact) {
    return (
      <ChatArea>
        <EmptyState>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h2>WhatsApp Web Clone</h2>
          <p>Select a conversation to start messaging</p>
        </EmptyState>
      </ChatArea>
    );
  }

  return (
    <ChatArea isOpen={!!selectedContact}>
      {/* Chat Header */}
      <ChatHeader>
        <BackButton onClick={onBack}>
          ←
        </BackButton>
        
        <Avatar size="small">
          {getInitials(selectedContact.contact_name || selectedContact.phone_number)}
        </Avatar>
        
        <ContactInfo>
          <ContactName>
            {selectedContact.contact_name || selectedContact.phone_number}
          </ContactName>
          <div style={{ fontSize: '12px', color: '#8696A0' }}>
            {selectedContact.phone_number}
            {isTyping && (
              <span style={{ marginLeft: '8px', color: '#25D366' }}>
                • typing
              </span>
            )}
          </div>
        </ContactInfo>
      </ChatHeader>

      {/* Messages Container */}
      <MessagesContainer
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {isLoading && page === 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <LoadingSpinner />
          </div>
        )}
        
        {hasMore && page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
            {isLoading ? <LoadingSpinner /> : <div style={{ color: '#8696A0', fontSize: '12px' }}>Scroll up to load more</div>}
          </div>
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {messages.map((message) => (
          <MessageBubbleComponent
            key={message.id || message._id}
            message={message}
          />
        ))}
        
        {isTyping && (
          <TypingIndicator>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '12px', color: '#8696A0' }}>typing</div>
              <div style={{ display: 'flex', gap: '2px' }}>
                <div style={{ width: '4px', height: '4px', backgroundColor: '#8696A0', borderRadius: '50%', animation: 'typing 1.4s infinite' }}></div>
                <div style={{ width: '4px', height: '4px', backgroundColor: '#8696A0', borderRadius: '50%', animation: 'typing 1.4s infinite 0.2s' }}></div>
                <div style={{ width: '4px', height: '4px', backgroundColor: '#8696A0', borderRadius: '50%', animation: 'typing 1.4s infinite 0.4s' }}></div>
              </div>
            </div>
          </TypingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {/* Message Input */}
      <MessageInputArea>
        <MessageInput
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isSending}
          rows={1}
        />
        <SendButton
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isSending}
        >
          {isSending ? <LoadingSpinner style={{ width: '20px', height: '20px' }} /> : '➤'}
        </SendButton>
      </MessageInputArea>
    </ChatArea>
  );
};

export default ChatAreaComponent;
