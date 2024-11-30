const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');

// Route to add a comment
router.post('/addComment', async (req, res) => {
  try {
    const { questionID, comment, email } = req.body;

    // Validate required fields
    if (!questionID || !comment || !email) {
      return res.status(400).json({ error: 'questionID and comment are required' });
    }

    // Create a new comment
    const newComment = new Comment({
      questionID,
      comment,
      email
    });

    const savedComment = await newComment.save();
    res.status(201).json({ message: 'Comment added successfully', comment: savedComment });
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment', details: error.message });
  }
});

// Route to get all comments for a post by questionID
router.get('/getComments', async (req, res) => {
  try {
    const { questionID } = req.query;
    const comments = await Comment.find({ questionID });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments', details: error.message });
  }
});

module.exports = router;