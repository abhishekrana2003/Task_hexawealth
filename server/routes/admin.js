const express = require('express');
const router = express.Router();
const Question = require('../models/questions'); 
const dotenv = require('dotenv');
dotenv.config();

// Middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (req.body.email !== adminEmail) {
    return res.status(403).json({ error: 'Access denied: Only admins can perform this action' });
  }
  
  next();
};

// Route to approve a post
router.post('/approve',adminMiddleware, async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    const updatedPost = await Question.findByIdAndUpdate(postId, { isApproved: true }, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post approved successfully', post: updatedPost });
  } catch (error) {
    res.status(500).json({ error: 'Error approving post', details: error.message });
  }
});

// Route to reject a post (delete the post)
router.post('/reject', adminMiddleware, async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    const deletedPost = await Question.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post rejected and deleted successfully', post: deletedPost });
  } catch (error) {
    res.status(500).json({ error: 'Error rejecting post', details: error.message });
  }
});

// Route to fetch all unapproved (pending) posts
router.get('/pending', adminMiddleware, async (req, res) => {
  try {
    const pendingPosts = await Question.find({ isApproved: false });

    res.status(200).json({ pendingPosts });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending posts', details: error.message });
  }
});

module.exports = router;