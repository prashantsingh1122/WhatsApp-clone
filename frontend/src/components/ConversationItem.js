import React from 'react';
import moment from 'moment';
import {
  ConversationItem,
  ConversationAvatar,
  OnlineIndicator,
  ConversationContent,
  ConversationHeader,
  ConversationName,
  ConversationTime,
  ConversationPreview,
  MessageTypeIcon,
  UnreadBadge
} from './styles/Styles';

const ConversationItemComponent = ({ conversation, isActive, onClick }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const now = moment();
    const messageTime = moment(timestamp);
    
    if (now.isSame(messageTime, 'day')) {
      return messageTime.format('HH:mm');
    } else if (now.diff(messageTime, 'days') === 1) {
      return 'yesterday';
    } else if (now.diff(messageTime, 'days') < 7) {
      return messageTime.format('ddd');
    } else {
      return messageTime.format('DD/MM/YY');
    }
  };

  const getMessagePreview = () => {
    if (!conversation.last_message_preview) return '';
    
    const type = conversation.last_message_type || 'text';
    const icon = {
      text: '',
      image: '🖼️',
      document: '📄',
      audio: '🎵',
      location: '📍',
      contact: '👤'
    }[type] || '';
    
    return `${icon} ${conversation.last_message_preview}`;
  };

  const isOnline = () => {
    // Simulate online status - in real app, this would come from user status
    return Math.random() > 0.7;
  };

  return (
    <ConversationItem 
      className={isActive ? 'active' : ''}
      onClick={onClick}
    >
      <ConversationAvatar>
        {getInitials(conversation.contact_name || conversation.phone_number)}
        {isOnline() && <OnlineIndicator />}
      </ConversationAvatar>
      
      <ConversationContent>
        <ConversationHeader>
          <ConversationName>
            {conversation.contact_name || conversation.phone_number}
          </ConversationName>
          <ConversationTime>
            {formatTime(conversation.last_message_time)}
          </ConversationTime>
        </ConversationHeader>
        
        <ConversationPreview>
          {getMessagePreview()}
        </ConversationPreview>
      </ConversationContent>
      
      {conversation.unread_count > 0 && (
        <UnreadBadge>
          {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
        </UnreadBadge>
      )}
    </ConversationItem>
  );
};

export default ConversationItemComponent;
