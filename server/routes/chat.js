const express = require('express');
const router = express.Router();
const {
  getOrCreateChat,
  getChats,
  getChatById,
  sendMessage,
  markAsRead
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getChats);
router.get('/chat/:chatId', protect, getChatById);
router.get('/user/:userId', protect, getOrCreateChat);
router.post('/:chatId/message', protect, sendMessage);
router.put('/:chatId/read', protect, markAsRead);

module.exports = router;

