import React from 'react';
import moment from 'moment';
import {
  ConversationItem,
  Avatar,
  ConversationInfo,
  ContactName,
  LastMessage,
  ConversationMeta,
  MessageTime,
  UnreadBadge,
  OnlineIndicator
} from './styles/Styles';

const ConversationItemComponent = ({ contact, isActive, onClick }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timestamp) => {
    const now = moment();
    const messageTime = moment(timestamp);
    
    if (now.diff(messageTime, 'days') === 0) {
      return messageTime.format('HH:mm');
    } else if (now.diff(messageTime, 'days') === 1) {
      return 'Yesterday';
    } else if (now.diff(messageTime, 'days') < 7) {
      return messageTime.format('dddd');
    } else {
      return messageTime.format('DD/MM/YYYY');
    }
  };

  const truncateMessage = (message, maxLength = 30) => {
    if (!message) return 'No messages yet';
    return message.length > maxLength 
      ? `${message.substring(0, maxLength)}...` 
      : message;
  };

  const getMessagePreview = () => {
    if (!contact.last_message_preview) return 'No messages yet';
    
    // Add message type indicators
    let preview = contact.last_message_preview;
    if (contact.last_message_type === 'image') {
      preview = '📷 ' + preview;
    } else if (contact.last_message_type === 'document') {
      preview = '📄 ' + preview;
    } else if (contact.last_message_type === 'audio') {
      preview = '🎵 ' + preview;
    } else if (contact.last_message_type === 'location') {
      preview = '📍 ' + preview;
    } else if (contact.last_message_type === 'contact') {
      preview = '👤 ' + preview;
    }
    
    return truncateMessage(preview);
  };

  const isOnline = () => {
    // Simulate online status based on last activity
    if (!contact.last_message_time) return false;
    const lastActivity = moment(contact.last_message_time);
    const now = moment();
    return now.diff(lastActivity, 'minutes') < 5;
  };

  return (
    <ConversationItem 
      isActive={isActive} 
      onClick={() => onClick(contact)}
    >
      <div style={{ position: 'relative' }}>
        <Avatar>
          {getInitials(contact.contact_name || contact.phone_number)}
        </Avatar>
        {isOnline() && <OnlineIndicator />}
      </div>
      
      <ConversationInfo>
        <ContactName>
          {contact.contact_name || contact.phone_number}
        </ContactName>
        <LastMessage>
          {getMessagePreview()}
        </LastMessage>
      </ConversationInfo>
      
      <ConversationMeta>
        <MessageTime>
          {formatTime(contact.last_message_time)}
        </MessageTime>
        <UnreadBadge count={contact.unread_count}>
          {contact.unread_count}
        </UnreadBadge>
      </ConversationMeta>
    </ConversationItem>
  );
};

export default ConversationItemComponent;
