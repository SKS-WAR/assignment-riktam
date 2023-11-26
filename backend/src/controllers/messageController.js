const Message = require('../models/Message');
const User = require('../models/User');
const Group = require('../models/Group');

const sendMessage = async (req, res) => {
  const { content, senderId, groupId } = req.body;

  try {
    const user = await User.findById(senderId);
    const group = await Group.findById(groupId);

    if (!user || !group) {
      return res.status(404).json({ message: 'User or group not found' });
    }

    const newMessage = new Message({ content, sender: senderId, group: groupId });
    const savedMessage = await newMessage.save();

    return res.status(201).json(savedMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const likeMessage = async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.body;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.likes.push(userId);
    const updatedMessage = await message.save();

    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  sendMessage,
  likeMessage,
};
