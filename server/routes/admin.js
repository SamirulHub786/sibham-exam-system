const express = require('express');
const router = express.Router();
const ExamResult = require('../models/ExamResult');
const Question = require('../models/Question');
const Student = require('../models/Student');

// Get all exam results
router.get('/results', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const results = await ExamResult.find({})
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalResults = await ExamResult.countDocuments({});

    res.json({
      success: true,
      totalResults,
      totalPages: Math.ceil(totalResults / limit),
      currentPage: page,
      data: results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching results',
      error: err.message,
    });
  }
});

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({});
    const totalSubmitted = await ExamResult.countDocuments({});
    const totalQuestions = await Question.countDocuments({});

    const results = await ExamResult.find({});

    let totalMarks = 0;
    let averagePercentage = 0;
    let highestScore = 0;
    let lowestScore = 100;

    results.forEach(result => {
      totalMarks += result.marksObtained;
      if (result.percentage > highestScore) highestScore = result.percentage;
      if (result.percentage < lowestScore) lowestScore = result.percentage;
    });

    averagePercentage = results.length > 0 ? totalMarks / results.length : 0;
    if (lowestScore === 100) lowestScore = 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        totalSubmitted,
        totalQuestions,
        averagePercentage: averagePercentage.toFixed(2),
        highestScore: highestScore.toFixed(2),
        lowestScore: lowestScore.toFixed(2),
        passedStudents: results.filter(r => r.percentage >= 40).length,
        failedStudents: results.filter(r => r.percentage < 40).length,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: err.message,
    });
  }
});

// Get student result details
router.get('/result/:resultId', async (req, res) => {
  try {
    const result = await ExamResult.findById(req.params.resultId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching result',
      error: err.message,
    });
  }
});

// Add new question
router.post('/question/add', async (req, res) => {
  try {
    const { question, optionA, optionB, optionC, optionD, correctAnswer, difficulty, topic } = req.body;

    if (!question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const lastQuestion = await Question.findOne({}).sort({ questionNo: -1 });
    const questionNo = lastQuestion ? lastQuestion.questionNo + 1 : 1;

    const newQuestion = new Question({
      questionNo,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      difficulty,
      topic,
    });

    await newQuestion.save();

    res.json({
      success: true,
      message: 'Question added successfully',
      data: newQuestion,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding question',
      error: err.message,
    });
  }
});

// Get all questions (admin view with answers)
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ questionNo: 1 });

    res.json({
      success: true,
      totalQuestions: questions.length,
      data: questions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: err.message,
    });
  }
});

module.exports = router;
