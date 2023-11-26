const Group = require('../models/Group');
const User = require('../models/User');

const createGroup = async (req, res) => {
  const { name } = req.body;

  try {
    const newGroup = new Group({ name });
    const savedGroup = await newGroup.save();

    return res.status(201).json(savedGroup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (deletedGroup) {
      return res.status(200).json(deletedGroup);
    } else {
      return res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const searchGroup = async (req, res) => {
  const { groupName } = req.params;

  try {
    const groups = await Group.find({ name: { $regex: groupName, $options: 'i' } });

    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const addMember = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group || !user) {
      return res.status(404).json({ message: 'Group or user not found' });
    }

    group.members.push(userId);
    const updatedGroup = await group.save();

    return res.status(200).json(updatedGroup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createGroup,
  deleteGroup,
  searchGroup,
  addMember,
};