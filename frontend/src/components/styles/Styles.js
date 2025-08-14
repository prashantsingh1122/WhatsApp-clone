import styled from 'styled-components';

// Color palette based on WhatsApp Web dark theme
export const colors = {
  primary: '#075E54',
  primaryLight: '#128C7E',
  secondary: '#25D366',
  background: '#111B21',
  chatBackground: '#0B141A',
  sidebarBackground: '#202C33',
  messageBackground: '#182229',
  incomingMessage: '#202C33',
  outgoingMessage: '#005C4B',
  text: '#E9EDEF',
  textSecondary: '#8696A0',
  textMuted: '#667781',
  border: '#8696A026',
  searchBackground: '#202C33',
  hover: '#2A3942',
  active: '#2A3942'
};

// Main container
export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: ${colors.background};
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: ${colors.text};
`;

// Sidebar (conversations list)
export const Sidebar = styled.div`
  width: 30%;
  min-width: 300px;
  max-width: 400px;
  background-color: ${colors.sidebarBackground};
  border-right: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`;

// Sidebar header
export const SidebarHeader = styled.div`
  padding: 16px;
  background-color: ${colors.sidebarBackground};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  gap: 16px;
`;

// Search bar
export const SearchBar = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 8px 16px;
  background-color: ${colors.searchBackground};
  border: none;
  border-radius: 8px;
  color: ${colors.text};
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: ${colors.textMuted};
  }
  
  &:focus {
    background-color: ${colors.hover};
  }
`;

// Conversations list
export const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.textMuted};
    border-radius: 3px;
  }
`;

// Individual conversation item
export const ConversationItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${colors.border};
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${props => props.isActive ? colors.active : 'transparent'};
  
  &:hover {
    background-color: ${colors.hover};
  }
  
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Avatar for contacts
export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
  
  ${props => props.size === 'small' && `
    width: 32px;
    height: 32px;
    font-size: 14px;
  `}
`;

// Conversation info
export const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

// Contact name
export const ContactName = styled.div`
  font-weight: 500;
  color: ${colors.text};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Last message preview
export const LastMessage = styled.div`
  color: ${colors.textSecondary};
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Conversation meta (time, unread count)
export const ConversationMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

// Message time
export const MessageTime = styled.div`
  color: ${colors.textMuted};
  font-size: 12px;
`;

// Unread count badge
export const UnreadBadge = styled.div`
  background-color: ${colors.secondary};
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  display: ${props => props.count > 0 ? 'block' : 'none'};
`;

// Main chat area
export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${colors.chatBackground};
  position: relative;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    width: 100%;
  }
`;

// Chat header
export const ChatHeader = styled.div`
  padding: 16px;
  background-color: ${colors.sidebarBackground};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

// Back button for mobile
export const BackButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${colors.text};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    background-color: ${colors.hover};
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// Contact info in header
export const ContactInfo = styled.div`
  flex: 1;
`;

// Chat messages container
export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.textMuted};
    border-radius: 3px;
  }
`;

// Individual message bubble
export const MessageBubble = styled.div`
  max-width: 70%;
  margin-bottom: 8px;
  align-self: ${props => props.isOutgoing ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.isOutgoing ? 'auto' : '0'};
  margin-right: ${props => props.isOutgoing ? '0' : 'auto'};
`;

// Message content
export const MessageContent = styled.div`
  background-color: ${props => props.isOutgoing ? colors.outgoingMessage : colors.incomingMessage};
  padding: 8px 12px;
  border-radius: 8px;
  position: relative;
  word-wrap: break-word;
  
  ${props => props.isOutgoing ? `
    border-bottom-right-radius: 2px;
  ` : `
    border-bottom-left-radius: 2px;
  `}
`;

// Message text
export const MessageText = styled.div`
  color: ${colors.text};
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

// Message footer (time and status)
export const MessageFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
  margin-top: 4px;
`;

// Message timestamp
export const MessageTimestamp = styled.span`
  color: ${colors.textMuted};
  font-size: 11px;
`;

// Message status indicator
export const MessageStatus = styled.span`
  color: ${props => {
    switch (props.status) {
      case 'sent': return colors.textMuted;
      case 'delivered': return colors.textMuted;
      case 'read': return colors.secondary;
      default: return colors.textMuted;
    }
  }};
  font-size: 12px;
  
  &::after {
    content: ${props => {
      switch (props.status) {
        case 'sent': return '"✓"';
        case 'delivered': return '"✓✓"';
        case 'read': return '"✓✓"';
        default: return '""';
      }
    }};
  }
`;

// Message input area
export const MessageInputArea = styled.div`
  padding: 16px;
  background-color: ${colors.sidebarBackground};
  border-top: 1px solid ${colors.border};
  display: flex;
  align-items: flex-end;
  gap: 12px;
`;

// Message input field
export const MessageInput = styled.textarea`
  flex: 1;
  background-color: ${colors.searchBackground};
  border: none;
  border-radius: 20px;
  padding: 12px 16px;
  color: ${colors.text};
  font-size: 14px;
  font-family: inherit;
  resize: none;
  max-height: 120px;
  min-height: 44px;
  outline: none;
  
  &::placeholder {
    color: ${colors.textMuted};
  }
  
  &:focus {
    background-color: ${colors.hover};
  }
`;

// Send button
export const SendButton = styled.button`
  background-color: ${colors.secondary};
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #1eb757;
  }
  
  &:disabled {
    background-color: ${colors.textMuted};
    cursor: not-allowed;
  }
`;

// Empty state
export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${colors.textMuted};
  text-align: center;
  gap: 16px;
`;

// Loading spinner
export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${colors.border};
  border-top: 2px solid ${colors.secondary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Error message
export const ErrorMessage = styled.div`
  background-color: #ff4444;
  color: white;
  padding: 12px 16px;
  margin: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
`;

// Success message
export const SuccessMessage = styled.div`
  background-color: ${colors.secondary};
  color: white;
  padding: 12px 16px;
  margin: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
`;
