const User = require('../models/User');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const { username, password, isAdmin } = req.body;
    
    try {
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ username, password: hashedPassword, isAdmin });
        const savedUser = await newUser.save();
        
        return res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const editUser = async (req, res) => {
    const { userId } = req.params;
    const { username, password, isAdmin } = req.body;
    
    try {
        // Hash the password before updating it
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, password: hashedPassword, isAdmin },
            { new: true }
            );
            
            if (updatedUser) {
                return res.status(200).json(updatedUser);
            }
            
            return res.status(404).json({ message: 'User not found' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
    
    const listUsers = async (req, res) => {
        try {
            const users = await User.find();
            return res.status(200).json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
    
    const getUserById = async (req, res) => {
        const { userId } = req.params;
        
        try {
            const user = await User.findById(userId);
            
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
    
    
    const searchUsers = async (req, res) => {
        const { username } = req.params;
        
        try {
            const users = await User.find({ username: { $regex: username, $options: 'i' } });
            return res.status(200).json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
    
    module.exports = {
        createUser,
        editUser,
        listUsers,
        searchUsers,
        getUserById,
    };
    