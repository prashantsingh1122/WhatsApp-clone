import React from 'react';
import moment from 'moment';
import {
  MessageBubble,
  MessageContent,
  MessageStatus,
  StatusIcon,
  MessageTime,
  MessageImage,
  MessageDocument,
  MessageAudio,
  MessageLocation,
  MessageContact
} from './styles/Styles';

const MessageBubbleComponent = ({ message }) => {
  const isOutgoing = message.direction === 'outbound';
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return moment(timestamp).format('HH:mm');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '✓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'read':
        return '#34b7f1';
      case 'delivered':
        return '#53bdeb';
      default:
        return '#8696a0';
    }
  };

  const renderMessageContent = () => {
    const type = message.message_type || 'text';
    
    switch (type) {
      case 'image':
        return (
          <MessageImage 
            src={message.message_body} 
            alt="Image" 
            onClick={() => window.open(message.message_body, '_blank')}
          />
        );
      
      case 'document':
        return (
          <MessageDocument onClick={() => window.open(message.message_body, '_blank')}>
            <div className="icon">📄</div>
            <div className="info">
              <div className="name">Document</div>
              <div className="size">Click to download</div>
            </div>
          </MessageDocument>
        );
      
      case 'audio':
        return (
          <MessageAudio>
            <div className="play-button">▶️</div>
            <div className="waveform"></div>
          </MessageAudio>
        );
      
      case 'location':
        return (
          <MessageLocation onClick={() => window.open(message.message_body, '_blank')}>
            <div className="icon">📍</div>
            <div className="text">Location</div>
          </MessageLocation>
        );
      
      case 'contact':
        return (
          <MessageContact>
            <div className="avatar">👤</div>
            <div className="name">Contact</div>
            <div className="phone">Tap to view</div>
          </MessageContact>
        );
      
      default:
        return message.message_body;
    }
  };

  return (
    <MessageBubble isOutgoing={isOutgoing}>
      <MessageContent hasStatus={isOutgoing}>
        {renderMessageContent()}
      </MessageContent>
      
      {isOutgoing && (
        <MessageStatus>
          <MessageTime>{formatTime(message.timestamp)}</MessageTime>
          <StatusIcon 
            status={message.status || 'sent'}
            style={{ color: getStatusColor(message.status || 'sent') }}
          >
            {getStatusIcon(message.status || 'sent')}
          </StatusIcon>
        </MessageStatus>
      )}
      
      {!isOutgoing && (
        <MessageTime>{formatTime(message.timestamp)}</MessageTime>
      )}
    </MessageBubble>
  );
};

export default MessageBubbleComponent;
