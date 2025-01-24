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
export const sendMessage = (userId, message) => {
    const messagesRef = ref(db, 'messages/' + userId);  // Path to store messages for the specific user
    const newMessageRef = push(messagesRef);  // Create a unique key
    set(newMessageRef, {
      sender: message.sender,
      content: message.content,
      timestamp: message.timestamp,
      isAdminReply: message.isAdminReply,
      read: false,  // Initially mark as unread
    });
  };
  
  // Reading messages
  export const readMessages = (userId, callback) => {
    const messagesRef = ref(db, 'messages/' + userId);
    onValue(messagesRef, (snapshot) => {
      callback(snapshot.val());  // Get all messages for the user
    });
  };
  
  // Mark all messages as read
  export const markMessagesAsRead = (userId) => {
    const messagesRef = ref(db, 'messages/' + userId);
    get(messagesRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        update(childSnapshot.ref, { read: true }); // Mark as read
      });
    });
  };

  
  
  // Get unread messages count
  export const getUnreadCount = (userId, callback) => {
    const messagesRef = ref(db, 'messages/' + userId);
    onValue(messagesRef, (snapshot) => {
      const unreadMessages = snapshot.val() ? Object.values(snapshot.val()).filter(msg => msg.read === false) : [];
      callback(unreadMessages.length);  // Get the number of unread messages
    });
  };

export { auth, db };
