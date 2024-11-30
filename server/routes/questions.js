const express = require('express');
const router = express.Router();
const Question = require('../models/questions'); // Adjust the path to your model

// Route to post a new question
router.post('/create', async (req, res) => {
  try {
    console.log(req.body);
    const { question, tag, email } = req.body;

    // Validate required fields
    if (!question || !tag || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new question
    const newQuestion = new Question({
      question,
      tag,
      isApproved: false, // Default to unapproved
      email,
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json({ message: 'Question posted successfully', question: savedQuestion });
  } catch (error) {
    res.status(500).json({ error: 'Error posting question', details: error.message });
  }
});


// Route to get all approved questions
router.get('/approved', async (req, res) => {
  try {
    // Fetch all questions with isApproved set to true
    const approvedQuestions = await Question.find({ isApproved: true });
    res.status(200).json(approvedQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching approved questions', details: error.message });
  }
});

// Route to get all questions (approved and unapproved) by a specific user
router.get('/user', async (req, res) => {
  try {
    const { email } = req.body;
    // Fetch all questions by the specified user email
    const userQuestions = await Question.find({ email, isApproved:false });
    res.status(200).json(userQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user questions', details: error.message });
  }
});

module.exports = router;