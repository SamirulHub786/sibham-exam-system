# 🚀 SIBHAM EXAM SYSTEM - QUICK START GUIDE

## Prerequisites
- Node.js installed (v14 or higher)
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

## Installation Steps

### Step 1: Clone Repository
```bash
git clone https://github.com/SamirulHub786/sibham-exam-system.git
cd sibham-exam-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Database

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod
# Then seed questions
node server/seedQuestions.js
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `.env` file:
```env
MONGODB_URI=your_connection_string_here
```
6. Seed questions:
```bash
node server/seedQuestions.js
```

### Step 4: Start Server
```bash
npm start
```

Server will run on: `http://localhost:5000`

## Access Portal

- **Student Exam**: http://localhost:5000
- **Admin Dashboard**: http://localhost:5000/admin

## Features

✅ Student Registration (Name/Roll No)
✅ 100 MCQ Questions
✅ 1-Hour Countdown Timer
✅ Auto-submit on time expiry
✅ Instant Result Display
✅ Admin Dashboard
✅ Analytics (Pass/Fail, Average Score)
✅ Question Bank Management
✅ No Negative Marking

## Exam Details

- **Institute**: SIBHAM COMPUTER INSTITUTE, RAIRANGPUR
- **Course**: Semester 1 - Fundamentals of Computer
- **Total Marks**: 100
- **Duration**: 1 Hour (60 minutes)
- **Total Questions**: 100
- **Marks per Question**: 1
- **Passing Score**: 40 marks (40%)

## API Endpoints

### Student
- `POST /api/student/register` - Register student
- `GET /api/student/:sessionId` - Get student info

### Exam
- `GET /api/exam/questions` - Get all questions
- `POST /api/exam/submit` - Submit exam
- `GET /api/exam/result/:resultId` - Get result

### Admin
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/results` - Get all results
- `GET /api/admin/questions` - Get questions
- `POST /api/admin/question/add` - Add new question

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**Port Already in Use**
- Change PORT in `.env` file
- Or kill process: `lsof -i :5000` and `kill -9 <PID>`

**Missing Questions**
- Run: `node server/seedQuestions.js`

## Project Structure
```
sibham-exam-system/
├── public/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── exam.html
│   └── admin.html
├── server/
│   ├── models/
│   ├── routes/
│   └── config/
├── app.js
├── package.json
├── .env
└── README.md
```

---
**Ready to go! Start the exam portal now!** 🎓
