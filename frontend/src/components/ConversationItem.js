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
  UnreadBadge
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

  return (
    <ConversationItem 
      isActive={isActive} 
      onClick={() => onClick(contact)}
    >
      <Avatar>
        {getInitials(contact.contact_name || contact.phone_number)}
      </Avatar>
      
      <ConversationInfo>
        <ContactName>
          {contact.contact_name || contact.phone_number}
        </ContactName>
        <LastMessage>
          {truncateMessage(contact.last_message_preview)}
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
