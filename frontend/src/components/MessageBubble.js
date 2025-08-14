import React from 'react';
import moment from 'moment';
import {
  MessageBubble,
  MessageContent,
  MessageText,
  MessageFooter,
  MessageTimestamp,
  MessageStatus
} from './styles/Styles';

const MessageBubbleComponent = ({ message }) => {
  const isOutgoing = message.direction === 'outbound';
  
  const formatTime = (timestamp) => {
    return moment(timestamp).format('HH:mm');
  };

  return (
    <MessageBubble isOutgoing={isOutgoing}>
      <MessageContent isOutgoing={isOutgoing}>
        <MessageText>
          {message.message_body || 'No content'}
        </MessageText>
        <MessageFooter>
          <MessageTimestamp>
            {formatTime(message.timestamp)}
          </MessageTimestamp>
          {isOutgoing && (
            <MessageStatus status={message.status} />
          )}
        </MessageFooter>
      </MessageContent>
    </MessageBubble>
  );
};

export default MessageBubbleComponent;
