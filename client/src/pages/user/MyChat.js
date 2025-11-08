import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './MyChat.css';

const MyChat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const selectedChatRef = useRef(selectedChat);

  // Keep ref updated with selected chat
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected');
      const userId = user._id || user.id;
      newSocket.emit('join-room', userId);
    });

    newSocket.on('receive-message', (data) => {
      // Always refresh chats list to update last message and unread counts
      setChats(prevChats => {
        const currentSelectedChat = selectedChatRef.current;
        return prevChats.map(chat => {
          if (chat._id === data.chatId) {
            // Update last message and increment unread count if not viewing this chat
            const isViewing = currentSelectedChat?._id === data.chatId;
            return {
              ...chat,
              lastMessage: data.message,
              lastMessageTime: data.timestamp,
              unreadCount: isViewing ? (chat.unreadCount || 0) : (chat.unreadCount || 0) + 1
            };
          }
          return chat;
        });
      });

      // If the message is for the currently selected chat, add it to messages
      const currentSelectedChat = selectedChatRef.current;
      if (currentSelectedChat && data.chatId === currentSelectedChat._id) {
        setMessages((prev) => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => 
            msg.message === data.message && 
            (msg.sender?._id || msg.sender) === data.sender &&
            Math.abs(new Date(msg.timestamp || 0) - new Date(data.timestamp || 0)) < 1000
          );
          if (exists) return prev;
          return [...prev, {
            sender: data.sender,
            message: data.message,
            timestamp: data.timestamp,
            read: false
          }];
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Check if chatId is passed via navigation state
  useEffect(() => {
    if (location.state?.chatId && chats.length > 0) {
      const chat = chats.find(c => c._id === location.state.chatId);
      if (chat) {
        setSelectedChat(chat);
      }
    }
  }, [location.state, chats]);

  // Fetch chats on mount
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  // Mark messages as read when chat is selected
  useEffect(() => {
    if (selectedChat) {
      // Small delay to ensure messages are loaded first
      const timer = setTimeout(() => {
        markMessagesAsRead();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedChat, messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/chat');
      setChats(res.data.data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Error loading chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const res = await axios.get(`/api/chat/chat/${selectedChat._id}`);
      setMessages(res.data.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error loading messages');
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedChat) return;
    try {
      await axios.put(`/api/chat/${selectedChat._id}/read`);
      // Update chat unread count
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messageText = newMessage.trim();
      setNewMessage('');

      // Optimistically add message to UI
      const tempMessage = {
        sender: user._id || user.id,
        message: messageText,
        timestamp: Date.now(),
        read: false
      };
      setMessages((prev) => [...prev, tempMessage]);

      // Send message to server
      const res = await axios.post(`/api/chat/${selectedChat._id}/message`, {
        message: messageText
      });

      // Update messages with server response
      if (res.data.data && res.data.data.messages) {
        setMessages(res.data.data.messages);
      } else {
        fetchMessages();
      }

      // Refresh chats to update last message
      fetchChats();
    } catch (error) {
      toast.error('Error sending message');
      // Remove optimistic message on error
      fetchMessages();
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const res = await axios.get(`/api/chat/user/${userId}`);
      const chat = res.data.data;
      setSelectedChat(chat);
      // Check if chat already exists in list
      if (!chats.find(c => c._id === chat._id)) {
        setChats(prev => [chat, ...prev]);
      }
    } catch (error) {
      toast.error('Error starting chat');
    }
  };

  const getOtherUser = (chat) => {
    if (!chat.participants) return null;
    return chat.participants.find((p) => (p._id || p) !== (user._id || user.id));
  };

  const isMessageFromMe = (message) => {
    const senderId = message.sender?._id || message.sender;
    const myId = user._id || user.id;
    return senderId.toString() === myId.toString();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="my-chat">
        <div className="loading">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="my-chat">
      <div className="chat-container">
        <div className="chats-list">
          <div className="chats-header">
            <h2>Chats</h2>
          </div>
          {chats.length === 0 ? (
            <div className="no-chats">
              <p>No chats yet. Start a conversation!</p>
            </div>
          ) : (
            <div className="chats">
              {chats.map((chat) => {
                const otherUser = getOtherUser(chat);
                const unreadCount = chat.unreadCount || 0;
                return (
                  <div
                    key={chat._id}
                    className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''} ${unreadCount > 0 ? 'unread' : ''}`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="chat-avatar">
                      {otherUser?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="chat-info">
                      <div className="chat-info-header">
                        <h4>{otherUser?.name || 'User'}</h4>
                        {chat.lastMessageTime && (
                          <span className="chat-time">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      <p className="chat-preview">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="unread-badge">{unreadCount}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="chat-messages">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-header-avatar">
                    {getOtherUser(selectedChat)?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <h3>{getOtherUser(selectedChat)?.name || 'User'}</h3>
                </div>
              </div>
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isMine = isMessageFromMe(message);
                    return (
                      <div
                        key={message._id || index}
                        className={`message ${isMine ? 'sent' : 'received'}`}
                      >
                        <p className="message-text">{message.message}</p>
                        <span className="message-time">
                          {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  autoComplete="off"
                />
                <button type="submit" disabled={!newMessage.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">💬</div>
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyChat;

