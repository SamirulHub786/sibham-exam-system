const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
  },
  totalQuestions: {
    type: Number,
    default: 100,
  },
  attemptedQuestions: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  wrongAnswers: {
    type: Number,
    default: 0,
  },
  unattemptedQuestions: {
    type: Number,
    default: 0,
  },
  totalMarks: {
    type: Number,
    default: 100,
  },
  marksObtained: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedOption: String,
    isCorrect: Boolean,
  }],
  startTime: Date,
  endTime: Date,
  duration: Number,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['submitted', 'auto-submitted'],
    default: 'submitted',
  },
});

module.exports = mongoose.model('ExamResult', examResultSchema);
