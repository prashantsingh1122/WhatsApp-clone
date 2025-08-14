import React, { useState, useEffect } from 'react';
import { messageService } from './services/api';
import socketService from './services/socket';
import ChatAreaComponent from './components/ChatArea';
import ConversationItemComponent from './components/ConversationItem';
import {
  AppContainer,
  Sidebar,
  SidebarHeader,
  HeaderTitle,
  SearchContainer,
  SearchInput,
  SearchIcon,
  ConversationsList
} from './components/styles/Styles';

function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    socketService.connect();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Load conversations
  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conversation =>
    conversation.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.phone_number?.includes(searchTerm)
  );

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    setSelectedContact(conversation);
    if (isMobile) {
      // On mobile, hide sidebar when conversation is selected
      document.body.style.overflow = 'hidden';
    }
  };

  // Handle back button (mobile)
  const handleBack = () => {
    setSelectedContact(null);
    if (isMobile) {
      document.body.style.overflow = 'auto';
    }
  };

  // Handle conversation update (real-time)
  useEffect(() => {
    const handleConversationUpdate = (updatedConversation) => {
      setConversations(prev => 
        prev.map(conv => 
          conv.wa_id === updatedConversation.wa_id 
            ? { ...conv, ...updatedConversation }
            : conv
        )
      );
    };

    socketService.on('conversationUpdate', handleConversationUpdate);
    
    return () => {
      socketService.off('conversationUpdate');
    };
  }, []);

  return (
    <AppContainer>
      {/* Sidebar */}
      <Sidebar isOpen={!selectedContact || !isMobile}>
        <SidebarHeader>
          <HeaderTitle>WhatsApp</HeaderTitle>
        </SidebarHeader>
        
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <ConversationsList>
          {isLoading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              color: '#667781'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  border: '2px solid #e9edef',
                  borderTop: '2px solid #00a884',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 12px'
                }}></div>
                <div>Loading conversations...</div>
              </div>
            </div>
          ) : error ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#ff6b6b' 
            }}>
              {error}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#667781' 
            }}>
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationItemComponent
                key={conversation.wa_id}
                conversation={conversation}
                isActive={selectedContact?.wa_id === conversation.wa_id}
                onClick={() => handleConversationSelect(conversation)}
              />
            ))
          )}
        </ConversationsList>
      </Sidebar>

      {/* Chat Area */}
      <ChatAreaComponent
        selectedContact={selectedContact}
        onBack={handleBack}
      />
    </AppContainer>
  );
}

export default App;
