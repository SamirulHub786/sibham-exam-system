const mongoose = require('mongoose');
const Question = require('./server/models/Question');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleQuestions = [
  {
    questionNo: 1,
    question: "What is the full form of CPU?",
    optionA: "Central Process Unit",
    optionB: "Central Processing Unit",
    optionC: "Central Processor Unit",
    optionD: "Center Processing Unit",
    correctAnswer: "B",
    difficulty: "Easy",
    topic: "Basics"
  },
  {
    questionNo: 2,
    question: "Which is the smallest unit of computer memory?",
    optionA: "Byte",
    optionB: "Bit",
    optionC: "Kilobyte",
    optionD: "Megabyte",
    correctAnswer: "B",
    difficulty: "Easy",
    topic: "Memory"
  },
  {
    questionNo: 3,
    question: "RAM stands for?",
    optionA: "Random Access Memory",
    optionB: "Read Access Memory",
    optionC: "Run Access Memory",
    optionD: "Rapid Access Memory",
    correctAnswer: "A",
    difficulty: "Easy",
    topic: "Memory"
  },
  {
    questionNo: 4,
    question: "Which of the following is a permanent storage device?",
    optionA: "RAM",
    optionB: "ROM",
    optionC: "Cache",
    optionD: "Register",
    correctAnswer: "B",
    difficulty: "Easy",
    topic: "Memory"
  },
  {
    questionNo: 5,
    question: "What does GPU stand for?",
    optionA: "Graphics Processing Unit",
    optionB: "Graphics Processor Unit",
    optionC: "Group Processing Unit",
    optionD: "Global Processing Unit",
    correctAnswer: "A",
    difficulty: "Easy",
    topic: "Hardware"
  },
  {
    questionNo: 6,
    question: "Which of the following is NOT an operating system?",
    optionA: "Windows",
    optionB: "Linux",
    optionC: "Python",
    optionD: "macOS",
    correctAnswer: "C",
    difficulty: "Easy",
    topic: "Software"
  },
  {
    questionNo: 7,
    question: "What is the main function of the motherboard?",
    optionA: "Store data",
    optionB: "Process instructions",
    optionC: "Connect all components",
    optionD: "Display output",
    correctAnswer: "C",
    difficulty: "Medium",
    topic: "Hardware"
  },
  {
    questionNo: 8,
    question: "HDD stands for?",
    optionA: "Hard Disk Drive",
    optionB: "Hard Data Drive",
    optionC: "Heavy Disk Drive",
    optionD: "High Disk Drive",
    correctAnswer: "A",
    difficulty: "Easy",
    topic: "Storage"
  },
  {
    questionNo: 9,
    question: "SSD is faster than HDD because:",
    optionA: "It has moving parts",
    optionB: "It uses flash memory",
    optionC: "It stores less data",
    optionD: "It requires more power",
    correctAnswer: "B",
    difficulty: "Medium",
    topic: "Storage"
  },
  {
    questionNo: 10,
    question: "What is the main function of a compiler?",
    optionA: "Execute code",
    optionB: "Convert source code to machine code",
    optionC: "Store data",
    optionD: "Display output",
    correctAnswer: "B",
    difficulty: "Medium",
    topic: "Software"
  }
];

// Generate 90 more questions to reach 100
for (let i = 11; i <= 100; i++) {
  const topics = ["Basics", "Memory", "Hardware", "Software", "Storage", "Networking"];
  const difficulties = ["Easy", "Medium", "Hard"];
  
  sampleQuestions.push({
    questionNo: i,
    question: `Question ${i}: Which of the following statements about computers is true?",`,
    optionA: `Option A for Question ${i}`,
    optionB: `Option B for Question ${i}`,
    optionC: `Option C for Question ${i}`,
    optionD: `Option D for Question ${i}`,
    correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    topic: topics[Math.floor(Math.random() * topics.length)]
  });
}

async function seedDB() {
  try {
    await Question.deleteMany({});
    console.log('🗑️ Cleared old questions...');
    
    await Question.insertMany(sampleQuestions);
    console.log('✅ 100 Sample Questions Added!');
    console.log('📊 Questions seeded successfully!');
    
    const count = await Question.countDocuments({});
    console.log(`📈 Total questions in DB: ${count}`);
    
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedDB();
