import React, { useState, useEffect } from 'react';
import { sendMessage, readMessages } from '../firebase';  // Import the sendMessage function
import styled from 'styled-components';  // For styling

const UserChat = ({userId}) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Fetch chat history for the user
    readMessages(userId, (messages) => {
      const chatHistory = Object.values(messages || {}).sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setChat(chatHistory);
    });
  }, [userId]);

  const sendMessageHandler = () => {
    if (message.trim()) {
      const newMessage = {
        sender: userId,
        content: message,
        timestamp: new Date().toISOString(),
        isAdminReply: false,
      };
      sendMessage(userId, newMessage); // Save message under the user's ID
      setMessage(''); // Clear the input
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  return (
    <ChatContainer>
      <ChatWindow>
        <ChatHeader>
          <h3>Chat with Admin</h3>
        </ChatHeader>
        <Messages>
          {chat.map((msg, idx) => (
            <Message key={idx} className={msg.isAdminReply ? 'admin' : 'user'}>
              <strong>{msg.sender}:</strong> {msg.content}
            </Message>
          ))}
        </Messages>
        <MessageInput>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            onKeyDown={handleKeyDown}
          />
          <SendButton onClick={sendMessageHandler}>Send</SendButton>
        </MessageInput>
      </ChatWindow>
    </ChatContainer>
  );
};

export default UserChat;

// Styled components for layout and design (mimicking WhatsApp web style)

const ChatContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const ChatWindow = styled.div`
  width: 100%;
  max-width: 600px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  background-color: #128C7E;
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 8px 8px 0 0;
`;

const Messages = styled.div`
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
  background-color: #E5DDD5;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${props => props.className === 'admin' ? '#d1ffd6' : '#ece5dd'};
  align-self: ${props => props.className === 'admin' ? 'flex-start' : 'flex-end'};
  max-width: 80%;
  word-wrap: break-word;

  strong {
    margin-right: 5px;
  }
`;

const MessageInput = styled.div`
  display: flex;
  padding: 15px;
  border-top: 1px solid #ddd;
  background-color: #f7f7f7;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  background-color: #128C7E;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #075e54;
  }
`;
