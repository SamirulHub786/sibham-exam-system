# SIBHAM EXAM SYSTEM
## Semester 1 - Fundamentals of Computer

Online exam platform for SIBHAM COMPUTER INSTITUTE, RAIRANGPUR

### Exam Details
- **Institute**: SIBHAM COMPUTER INSTITUTE, RAIRANGPUR
- **Course**: Semester 1 - Fundamentals of Computer
- **Total Marks**: 100
- **Duration**: 1 Hour (60 minutes)
- **Total Questions**: 100
- **Marks per Question**: 1
- **Negative Marking**: No

### Features
✅ Student Registration (Name/Roll No)
✅ 100 MCQ Questions
✅ Real-time Timer (1 Hour Countdown)
✅ Auto-submit on time over
✅ Instant Result Display
✅ Admin Dashboard
✅ Student Performance Analytics
✅ Question Bank Management

### Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Server**: Express.js

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/SamirulHub786/sibham-exam-system.git
cd sibham-exam-system

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the server
npm start
```

### Project Structure
```
sibham-exam-system/
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   ├── js/
│   │   ├── exam.js
│   │   ├── timer.js
│   │   └── admin.js
│   ├── index.html
│   ├── exam.html
│   └── admin.html
├── server/
│   ├── models/
│   │   ├── Student.js
│   │   ├── ExamResult.js
│   │   └── Question.js
│   ├── routes/
│   │   ├── student.js
│   │   ├── exam.js
│   │   └── admin.js
│   └── config/
│       └── db.js
├── app.js
├── package.json
├── .env.example
└── README.md
```

### Usage
1. Student opens the portal
2. Enters Name and Roll Number
3. Takes the 1-hour exam
4. Timer counts down - auto-submit on expiry
5. Results displayed instantly
6. Admin views analytics

### API Endpoints

**Student Routes:**
- `POST /api/student/register` - Register student
- `GET /api/student/:sessionId` - Get student details

**Exam Routes:**
- `GET /api/exam/questions` - Get all questions
- `POST /api/exam/submit` - Submit exam
- `GET /api/exam/result/:resultId` - Get result

**Admin Routes:**
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/results` - Get all results
- `GET /api/admin/questions` - Get questions (with answers)
- `POST /api/admin/question/add` - Add new question

---
**Created by**: Samirul Hub
**Last Updated**: 2026-05-31
