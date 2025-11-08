const Chat = require('../models/Chat');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get or create chat
// @route   GET /api/chat/:userId
// @access  Private
exports.getOrCreateChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot chat with yourself'
      });
    }

    // Check if chat exists
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] }
    }).populate('participants', 'name email avatar');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [currentUserId, userId]
      });
      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email avatar');
    }

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all chats for user
// @route   GET /api/chat
// @access  Private
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
      .populate('participants', 'name email avatar')
      .sort('-lastMessageTime')
      .sort('-updatedAt');

    // Calculate unread count for each chat
    const chatsWithUnread = chats.map(chat => {
      const unreadCount = chat.messages.filter(msg => 
        msg.sender.toString() !== req.user.id && !msg.read
      ).length;
      return {
        ...chat.toObject(),
        unreadCount
      };
    });

    res.json({
      success: true,
      count: chats.length,
      data: chatsWithUnread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get chat by ID with messages
// @route   GET /api/chat/chat/:chatId
// @access  Private
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'name email avatar');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    // Mark messages as read when user opens chat
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== req.user.id) {
        msg.read = true;
      }
    });
    await chat.save();

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send message
// @route   POST /api/chat/:chatId/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message in this chat'
      });
    }

    // Add message
    chat.messages.push({
      sender: req.user.id,
      message,
      read: false
    });

    chat.lastMessage = message;
    chat.lastMessageTime = Date.now();
    chat.updatedAt = Date.now();

    await chat.save();

    // Get receiver ID
    const receiverId = chat.participants.find(
      id => id.toString() !== req.user.id.toString()
    );

    if (receiverId) {
      // Create notification
      await Notification.create({
        user: receiverId,
        type: 'chat',
        title: 'New Message',
        message: `You have a new message from ${req.user.name}`,
        link: `/my-chat`
      });

      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        const receiverIdString = receiverId.toString();
        io.to(receiverIdString).emit('receive-message', {
          chatId: chat._id.toString(),
          sender: req.user.id.toString(),
          senderName: req.user.name,
          message,
          timestamp: Date.now()
        });
      }
    }

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'name email avatar');

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: updatedChat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/:chatId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark messages as read
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== req.user.id) {
        msg.read = true;
      }
    });

    await chat.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

