import styled from 'styled-components';

// WhatsApp Web Colors
const colors = {
  primary: '#00a884', // WhatsApp green
  secondary: '#667781', // Secondary text
  background: '#ffffff', // Main background
  sidebar: '#ffffff', // Sidebar background
  chatBackground: '#efeae2', // Chat background (default)
  messageOut: '#d9fdd3', // Outgoing message bubble
  messageIn: '#ffffff', // Incoming message bubble
  header: '#f0f2f5', // Header background
  border: '#e9edef', // Border color
  icon: '#54656f', // Icon color
  link: '#00a884', // Link color
  error: '#ff6b6b', // Error color
  success: '#25d366', // Success color
  typing: '#8696a0', // Typing indicator
  unread: '#25d366', // Unread indicator
  timestamp: '#667781', // Timestamp color
  status: {
    sent: '#8696a0',
    delivered: '#53bdeb',
    read: '#34b7f1'
  }
};

// Main container
export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: ${colors.background};
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #111b21;
`;

// Sidebar styles
export const Sidebar = styled.div`
  width: 400px;
  height: 100vh;
  background: ${colors.sidebar};
  border-right: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    width: 100%;
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`;

export const SidebarHeader = styled.div`
  height: 60px;
  background: ${colors.header};
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid ${colors.border};
  position: relative;
`;

export const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: #111b21;
  margin-left: 12px;
`;

export const SearchContainer = styled.div`
  padding: 8px 12px;
  background: ${colors.background};
  border-bottom: 1px solid ${colors.border};
  position: relative;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: none;
  border-radius: 8px;
  background: ${colors.header};
  font-size: 15px;
  color: #111b21;
  outline: none;

  &::placeholder {
    color: ${colors.secondary};
  }

  &:focus {
    background: ${colors.background};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.secondary};
  font-size: 16px;
`;

export const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${colors.background};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cccccc;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #999999;
  }
`;

// Conversation item styles
export const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${colors.border};
  position: relative;

  &:hover {
    background: ${colors.header};
  }

  &.active {
    background: ${colors.header};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ConversationAvatar = styled.div`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  background: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin-right: 15px;
  flex-shrink: 0;
  position: relative;
`;

export const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: ${colors.unread};
  border: 2px solid ${colors.background};
  border-radius: 50%;
`;

export const ConversationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const ConversationName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ConversationTime = styled.div`
  font-size: 12px;
  color: ${colors.timestamp};
  white-space: nowrap;
  margin-left: 8px;
`;

export const ConversationPreview = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${colors.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MessageTypeIcon = styled.span`
  margin-right: 4px;
  font-size: 16px;
`;

export const UnreadBadge = styled.div`
  background: ${colors.unread};
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
  flex-shrink: 0;
`;

// Chat area styles
export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${colors.chatBackground};
  position: relative;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`;

export const ChatHeader = styled.div`
  height: 60px;
  background: ${colors.header};
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid ${colors.border};
  position: relative;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: ${colors.icon};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  margin-right: 12px;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const ContactInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ContactName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #111b21;
`;

export const ContactStatus = styled.div`
  font-size: 13px;
  color: ${colors.secondary};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const HeaderButton = styled.button`
  background: none;
  border: none;
  color: ${colors.icon};
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

// Messages container
export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  background: ${colors.chatBackground};
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cccccc;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #999999;
  }
`;

export const MessageGroup = styled.div`
  margin-bottom: 8px;
  animation: fadeIn 0.3s ease;
`;

export const MessageDate = styled.div`
  text-align: center;
  margin: 16px 0;
  font-size: 12px;
  color: ${colors.secondary};
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 12px;
  border-radius: 8px;
  display: inline-block;
  margin-left: 50%;
  transform: translateX(-50%);
`;

// Message bubble styles
export const MessageBubble = styled.div`
  max-width: 65%;
  margin: 2px 0;
  padding: 6px 7px 8px 9px;
  border-radius: 7.5px;
  position: relative;
  word-wrap: break-word;
  animation: fadeIn 0.3s ease;

  ${props => props.isOutgoing ? `
    background: ${colors.messageOut};
    margin-left: auto;
    margin-right: 16px;
    border-top-right-radius: 0;
  ` : `
    background: ${colors.messageIn};
    margin-left: 16px;
    margin-right: auto;
    border-top-left-radius: 0;
  `}
`;

export const MessageContent = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: #111b21;
  margin-bottom: ${props => props.hasStatus ? '4px' : '0'};
`;

export const MessageStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 11px;
  color: ${colors.timestamp};
`;

export const StatusIcon = styled.span`
  font-size: 14px;
  color: ${props => {
    if (props.status === 'read') return colors.status.read;
    if (props.status === 'delivered') return colors.status.delivered;
    return colors.status.sent;
  }};
`;

export const MessageTime = styled.span`
  font-size: 11px;
  color: ${colors.timestamp};
`;

// Message input area
export const MessageInputArea = styled.div`
  background: ${colors.background};
  border-top: 1px solid ${colors.border};
  padding: 10px 16px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  min-height: 62px;
`;

export const MessageInput = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 20px;
  max-height: 100px;
  min-height: 20px;
  padding: 9px 12px;
  background: ${colors.header};
  border-radius: 8px;
  color: #111b21;
  font-family: inherit;

  &::placeholder {
    color: ${colors.secondary};
  }

  &:focus {
    background: ${colors.background};
  }
`;

export const SendButton = styled.button`
  background: ${props => props.disabled ? colors.secondary : colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  font-size: 18px;

  &:hover:not(:disabled) {
    background: ${props => props.disabled ? colors.secondary : '#008f72'};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

// Empty state
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${colors.secondary};
  text-align: center;
  padding: 40px;

  h2 {
    font-size: 32px;
    margin-bottom: 16px;
    color: #111b21;
  }

  p {
    font-size: 14px;
    line-height: 20px;
  }
`;

// Loading and error states
export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${colors.border};
  border-top: 2px solid ${colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  background: ${colors.error};
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px;
  font-size: 14px;
  text-align: center;
`;

// Typing indicator
export const TypingIndicator = styled.div`
  padding: 8px 16px;
  color: ${colors.typing};
  font-size: 12px;
  font-style: italic;
  animation: fadeIn 0.3s ease;
`;

// Message media styles
export const MessageImage = styled.img`
  max-width: 100%;
  border-radius: 4px;
  cursor: pointer;
`;

export const MessageDocument = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  cursor: pointer;

  .icon {
    font-size: 24px;
    margin-right: 8px;
  }

  .info {
    flex: 1;
  }

  .name {
    font-weight: 600;
    font-size: 12px;
  }

  .size {
    font-size: 11px;
    color: ${colors.secondary};
  }
`;

export const MessageAudio = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  cursor: pointer;

  .play-button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${colors.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .waveform {
    flex: 1;
    height: 20px;
    background: linear-gradient(90deg, ${colors.primary} 0%, ${colors.primary} 30%, ${colors.border} 30%, ${colors.border} 100%);
    border-radius: 10px;
  }
`;

export const MessageLocation = styled.div`
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  cursor: pointer;

  .icon {
    font-size: 24px;
    color: ${colors.primary};
    margin-bottom: 4px;
  }

  .text {
    font-size: 12px;
    font-weight: 600;
  }
`;

export const MessageContact = styled.div`
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  cursor: pointer;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${colors.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .name {
    font-size: 12px;
    font-weight: 600;
  }

  .phone {
    font-size: 11px;
    color: ${colors.secondary};
  }
`;

// Responsive design
export const MobileOverlay = styled.div`
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 5;
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

// Avatar component
export const Avatar = styled.div`
  width: ${props => props.size === 'small' ? '40px' : '49px'};
  height: ${props => props.size === 'small' ? '40px' : '49px'};
  border-radius: 50%;
  background: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => props.size === 'small' ? '16px' : '18px'};
  flex-shrink: 0;
  position: relative;
`;
