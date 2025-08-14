import React, { useState, useEffect } from 'react';
import { messageService } from './services/api';
import socketService from './services/socket';
import ConversationItemComponent from './components/ConversationItem';
import ChatAreaComponent from './components/ChatArea';
import {
  AppContainer,
  Sidebar,
  SidebarHeader,
  SearchBar,
  ConversationsList,
  Avatar,
  LoadingSpinner,
  ErrorMessage,
  EmptyState
} from './components/styles/Styles';

function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(true);

  // Load conversations from API
  const loadConversations = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const contactsData = await messageService.getConversations();
      setConversations(contactsData || []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle conversation selection
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    
    // On mobile, hide sidebar when chat is opened
    if (isMobileView) {
      setShowSidebar(false);
    }
  };

  // Handle back button (mobile)
  const handleBackToConversations = () => {
    setSelectedContact(null);
    setShowSidebar(true);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(contact => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const name = (contact.contact_name || '').toLowerCase();
    const phone = contact.phone_number.toLowerCase();
    const message = (contact.last_message_preview || '').toLowerCase();
    
    return name.includes(query) || phone.includes(query) || message.includes(query);
  });

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      
      if (!mobile) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    socketService.connect();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Listen for message updates to refresh conversations
  useEffect(() => {
    const handleMessageUpdate = (updatedMessage) => {
      // Update the conversation list when a new message arrives
      setConversations(prev => {
        return prev.map(contact => {
          if (contact.wa_id === updatedMessage.wa_id) {
            return {
              ...contact,
              last_message_time: updatedMessage.timestamp,
              last_message_preview: updatedMessage.message_body || '',
              unread_count: updatedMessage.direction === 'inbound' 
                ? (selectedContact?.wa_id === contact.wa_id ? 0 : contact.unread_count + 1)
                : contact.unread_count
            };
          }
          return contact;
        }).sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
      });
    };

    socketService.onMessageUpdate(handleMessageUpdate);
    
    return () => {
      socketService.offMessageUpdate();
    };
  }, [selectedContact]);

  return (
    <AppContainer>
      {/* Sidebar - Conversations List */}
      <Sidebar isOpen={showSidebar}>
        <SidebarHeader>
          <Avatar>
            WA
          </Avatar>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>WhatsApp Web Clone</h3>
          </div>
          <div style={{ fontSize: '12px', color: '#8696A0' }}>
            {socketService.isConnected() ? '🟢 Online' : '🔴 Offline'}
          </div>
        </SidebarHeader>

        <SearchBar
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ConversationsList>
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <LoadingSpinner />
            </div>
          )}
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {!isLoading && !error && filteredConversations.length === 0 && (
            <EmptyState>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📱</div>
              <p>No conversations found</p>
              {searchQuery && (
                <p style={{ fontSize: '14px', opacity: 0.7 }}>
                  Try adjusting your search
                </p>
              )}
            </EmptyState>
          )}
          
          {filteredConversations.map(contact => (
            <ConversationItemComponent
              key={contact.wa_id}
              contact={contact}
              isActive={selectedContact?.wa_id === contact.wa_id}
              onClick={handleContactSelect}
            />
          ))}
        </ConversationsList>
      </Sidebar>

      {/* Chat Area */}
      <ChatAreaComponent
        selectedContact={selectedContact}
        onBack={handleBackToConversations}
      />
    </AppContainer>
  );
}

export default App;
