const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { v4: uuidv4 } = require('uuid');

// Register Student
router.post('/register', async (req, res) => {
  try {
    const { name, rollNo, email } = req.body;

    if (!name || !rollNo) {
      return res.status(400).json({
        success: false,
        message: 'Name and Roll No are required',
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Roll No already exists. Cannot start exam twice.',
      });
    }

    // Create session ID
    const sessionId = uuidv4();

    const student = new Student({
      name,
      rollNo,
      email,
      sessionId,
      startTime: new Date(),
    });

    await student.save();

    res.json({
      success: true,
      message: 'Registration successful',
      data: {
        studentId: student._id,
        sessionId: student.sessionId,
        name: student.name,
        rollNo: student.rollNo,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error registering student',
      error: err.message,
    });
  }
});

// Get Student Details
router.get('/:sessionId', async (req, res) => {
  try {
    const student = await Student.findOne({ sessionId: req.params.sessionId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: err.message,
    });
  }
});

module.exports = router;
