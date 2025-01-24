import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, get, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1_iY5NtwQSq5Vzr23CBn99NWYfySpsl8",
  authDomain: "chat-95e35.firebaseapp.com",
  projectId: "chat-95e35",
  storageBucket: "chat-95e35.firebasestorage.app",
  messagingSenderId: "486771796356",
  appId: "1:486771796356:web:9140a57f0d44f563e0d5d1",
  measurementId: "G-NTZS9NFXJ6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get database and authentication instances
const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

// Sending a message
  export const sendMessage = (receiverId, message) => {
    const messagesRef = ref(db, `messages/${receiverId}`); // Path to store messages for the specific receiver
    const newMessageRef = push(messagesRef); // Create a unique key for the message
    set(newMessageRef, {
      sender: message.sender,         // Sender ID
      content: message.content,       // Message content
      timestamp: message.timestamp,   // Timestamp of the message
      isAdminReply: message.isAdminReply, // Boolean indicating if it's an admin reply
      read: false,                    // Initially mark as unread
    });
  };

  export const readMessages = (userId, callback) => {
    const messagesRef = ref(db, `messages/${userId}`);
    onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val();
      callback(messages); // Return all messages for the specific user
    });
  };

  export const markMessagesAsRead = (userId) => {
    const messagesRef = ref(db, `messages/${userId}`);
    get(messagesRef).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          update(childSnapshot.ref, { read: true }); // Update `read` status for each message
        });
      }
    });
  };

  export const getUnreadCountsForAllUsers = (callback) => {
    const messagesRef = ref(db, 'messages/');
    onValue(messagesRef, (snapshot) => {
      const allChats = snapshot.val();
      const unreadCounts = {};
  
      for (const userId in allChats) {
        const messages = Object.values(allChats[userId]);
        const unreadMessages = messages.filter(msg => !msg.read);
        unreadCounts[userId] = unreadMessages.length; // Count unread messages for each user
      }
  
      callback(unreadCounts); // Return an object with userId and their unread count
    });
  };

export { auth, db };
