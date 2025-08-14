import React from 'react';
import moment from 'moment';
import {
  MessageBubble,
  MessageContent,
  MessageText,
  MessageFooter,
  MessageTimestamp,
  MessageStatus,
  MessageImage,
  MessageDocument,
  MessageAudio,
  MessageLocation,
  MessageContact
} from './styles/Styles';

const MessageBubbleComponent = ({ message }) => {
  const isOutgoing = message.direction === 'outbound';
  
  const formatTime = (timestamp) => {
    return moment(timestamp).format('HH:mm');
  };

  const renderMessageContent = () => {
    switch (message.message_type) {
      case 'image':
        return (
          <>
            {message.message_url && (
              <MessageImage src={message.message_url} alt="Image" />
            )}
            {message.message_body && (
              <MessageText>{message.message_body}</MessageText>
            )}
          </>
        );
      
      case 'document':
        return (
          <>
            <MessageDocument>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
              <div style={{ fontSize: '12px', color: '#8696A0' }}>
                {message.message_body || 'Document'}
              </div>
            </MessageDocument>
          </>
        );
      
      case 'audio':
        return (
          <MessageAudio>
            <div style={{ fontSize: '24px', marginRight: '8px' }}>🎵</div>
            <div style={{ fontSize: '12px', color: '#8696A0' }}>
              {message.message_body || 'Audio message'}
            </div>
          </MessageAudio>
        );
      
      case 'location':
        return (
          <MessageLocation>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
            <div style={{ fontSize: '12px', color: '#8696A0' }}>
              {message.message_body || 'Location shared'}
            </div>
          </MessageLocation>
        );
      
      case 'contact':
        return (
          <MessageContact>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👤</div>
            <div style={{ fontSize: '12px', color: '#8696A0' }}>
              {message.message_body || 'Contact shared'}
            </div>
          </MessageContact>
        );
      
      default:
        return (
          <MessageText>
            {message.message_body || 'No content'}
          </MessageText>
        );
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      case 'failed':
        return '✗';
      default:
        return '✓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return '#8696A0';
      case 'delivered':
        return '#8696A0';
      case 'read':
        return '#53BDEB';
      case 'failed':
        return '#F15C6D';
      default:
        return '#8696A0';
    }
  };

  return (
    <MessageBubble isOutgoing={isOutgoing}>
      <MessageContent isOutgoing={isOutgoing}>
        {renderMessageContent()}
        <MessageFooter>
          <MessageTimestamp>
            {formatTime(message.timestamp)}
          </MessageTimestamp>
          {isOutgoing && (
            <MessageStatus 
              status={message.status}
              style={{ 
                color: getStatusColor(message.status),
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {getStatusIcon(message.status)}
            </MessageStatus>
          )}
        </MessageFooter>
      </MessageContent>
    </MessageBubble>
  );
};

export default MessageBubbleComponent;
