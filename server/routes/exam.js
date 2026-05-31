const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const ExamResult = require('../models/ExamResult');
const Student = require('../models/Student');

// Get all questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find({}).select('-correctAnswer -explanation');
    
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

// Submit Exam
router.post('/submit', async (req, res) => {
  try {
    const { sessionId, answers } = req.body;

    if (!sessionId || !answers) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and answers are required',
      });
    }

    const student = await Student.findOne({ sessionId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Calculate results
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let attemptedQuestions = 0;
    const answerDetails = [];

    for (const answer of answers) {
      if (answer.selectedOption) {
        attemptedQuestions++;
        const question = await Question.findById(answer.questionId);

        if (question) {
          const isCorrect = question.correctAnswer === answer.selectedOption;
          if (isCorrect) {
            correctAnswers++;
          } else {
            wrongAnswers++;
          }

          answerDetails.push({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
            isCorrect,
          });
        }
      }
    }

    const unattemptedQuestions = 100 - attemptedQuestions;
    const marksObtained = correctAnswers * 1;
    const percentage = (marksObtained / 100) * 100;

    const result = new ExamResult({
      studentId: student._id,
      studentName: student.name,
      rollNo: student.rollNo,
      sessionId: sessionId,
      attemptedQuestions,
      correctAnswers,
      wrongAnswers,
      unattemptedQuestions,
      marksObtained,
      percentage,
      answers: answerDetails,
      startTime: student.startTime,
      endTime: new Date(),
      duration: Math.floor((new Date() - student.startTime) / 1000),
    });

    await result.save();

    // Mark student as inactive
    student.isActive = false;
    student.endTime = new Date();
    await student.save();

    res.json({
      success: true,
      message: 'Exam submitted successfully',
      data: {
        resultId: result._id,
        marksObtained: result.marksObtained,
        percentage: result.percentage,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        unattemptedQuestions: result.unattemptedQuestions,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error submitting exam',
      error: err.message,
    });
  }
});

// Get Result
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

module.exports = router;
