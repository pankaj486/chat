import React, { useState, useEffect } from 'react';
import { sendMessage, readMessages, markMessagesAsRead, getUnreadCountsForAllUsers } from '../firebase.js';
import styled from 'styled-components';

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    setLoadingUsers(true);
    getUnreadCountsForAllUsers((counts) => {
      setUnreadCounts(counts);
      setUsers(Object.keys(counts));
      setLoadingUsers(false);
    });
  }, []);

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
    setChat([]);
    setLoadingChat(true);
    markMessagesAsRead(userId);
    readMessages(userId, (messages) => {
      const chatHistory = Object.values(messages || {}).sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setChat(chatHistory);
      setLoadingChat(false);
    });
  };

  const sendMessageHandler = () => {
    if (message.trim() && selectedUser) {
      const newMessage = {
        sender: 'Admin',
        content: message,
        timestamp: new Date().toISOString(),
        isAdminReply: true,
      };
      sendMessage(selectedUser, newMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  return (
    <AdminChatContainer>
      <Sidebar>
        <h3>Users</h3>
        {
          loadingUsers ? 
          <Loader>Loading users...</Loader>:
          <UserList>
            {users.map((userId) => (
              <UserItem key={userId} isActive={userId === selectedUser}>
                <UserButton onClick={() => handleUserClick(userId)}>
                  {userId} 
                  {unreadCounts[userId] > 0 && (
                    <UnreadCount>{unreadCounts[userId]}</UnreadCount>
                  )}
                </UserButton>
              </UserItem>
            ))}
          </UserList>
        }
      </Sidebar>
      <ChatArea>
        {selectedUser ? (
          <ChatWindow>
            <ChatHeader>
              <h2>Chat with {selectedUser}</h2>
            </ChatHeader>
            {
              loadingChat ? 
              <Loader>Loading chat history...</Loader>:
              <ChatMessages>
                {chat.map((msg, idx) => (
                  <Message key={idx} className={msg.isAdminReply ? 'admin' : 'user'}>
                    <strong>{msg.sender}:</strong> {msg.content}
                  </Message>
                ))}
              </ChatMessages>
            }
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
        ) : (
          <NoChatSelected>
            <h3>Select a user to start a chat</h3>
          </NoChatSelected>
        )}
      </ChatArea>
    </AdminChatContainer>
  );
};

export default AdminChat;

const AdminChatContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserItem = styled.li`
  background-color: ${(props) => (props.isActive ? "#d1e7dd" : "#f8f9fa")};
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#c9dfd4" : "#c9dfd4")};
  }
`;

const UserButton = styled.button`
  background-color: transparent;
  border: none;
  // padding: 10px;
  width: 100%;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
`;

const UnreadCount = styled.span`
  background-color: #ff3b30;
  color: white;
  border-radius: 50%;
  padding: 3px 10px;
  font-size: 14px;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
`;

const ChatArea = styled.div`
  flex: 1;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const ChatWindow = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatHeader = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  max-width: 80%;
  background-color: ${props => props.className === 'admin' ? '#d1ffd6' : '#e0e0e0'};
  align-self: ${props => props.className === 'admin' ? 'flex-start' : 'flex-end'};

  strong {
    margin-right: 5px;
  }
`;

const MessageInput = styled.div`
  display: flex;
  padding: 15px;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 16px;
`;

const SendButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const NoChatSelected = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  font-size: 18px;
  color: #555;
`;

const Loader = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: #555;
`;