let currentQuestionIndex = 0;
let allQuestions = [];
let studentAnswers = {};
let currentSessionId = null;
let currentStudentId = null;

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path === '/' || path === '/index.html') {
    initializeWelcomePage();
  } else if (path === '/exam') {
    initializeExamPage();
  }
});

function initializeWelcomePage() {
  const form = document.getElementById('registrationForm');
  if (form) {
    form.addEventListener('submit', handleRegistration);
  }
}

async function handleRegistration(e) {
  e.preventDefault();

  const name = document.getElementById('studentName').value.trim();
  const rollNo = document.getElementById('rollNo').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !rollNo) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    const response = await fetch('/api/student/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, rollNo, email }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('sessionId', data.data.sessionId);
      localStorage.setItem('studentId', data.data.studentId);
      localStorage.setItem('studentName', data.data.name);
      localStorage.setItem('studentRollNo', data.data.rollNo);

      document.getElementById('welcomeSection').style.display = 'none';
      document.getElementById('loadingSection').style.display = 'flex';

      setTimeout(() => {
        window.location.href = '/exam';
      }, 1000);
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    console.error('Registration error:', err);
    alert('Registration failed. Please try again.');
  }
}

async function initializeExamPage() {
  currentSessionId = localStorage.getItem('sessionId');
  currentStudentId = localStorage.getItem('studentId');

  if (!currentSessionId || !currentStudentId) {
    window.location.href = '/';
    return;
  }

  const studentName = localStorage.getItem('studentName');
  const studentRollNo = localStorage.getItem('studentRollNo');
  document.getElementById('studentInfo').textContent = `${studentName} (${studentRollNo})`;

  await loadQuestions();

  initializeTimer(3600);

  displayQuestion(0);

  document.getElementById('submitBtn').addEventListener('click', showSubmitModal);
}

async function loadQuestions() {
  try {
    const response = await fetch('/api/exam/questions');
    const data = await response.json();

    if (data.success) {
      allQuestions = data.data;
      createQuestionGrid();
    } else {
      alert('Error loading questions');
    }
  } catch (err) {
    console.error('Error loading questions:', err);
    alert('Failed to load questions');
  }
}

function createQuestionGrid() {
  const grid = document.getElementById('questionGrid');
  grid.innerHTML = '';

  allQuestions.forEach((q, index) => {
    const btn = document.createElement('button');
    btn.className = 'question-btn';
    btn.textContent = q.questionNo || (index + 1);
    btn.onclick = (e) => {
      e.preventDefault();
      displayQuestion(index);
    };
    grid.appendChild(btn);
  });

  updateQuestionStats();
}

function updateQuestionGrid() {
  const buttons = document.querySelectorAll('.question-btn');
  buttons.forEach((btn, index) => {
    btn.classList.remove('current', 'answered');
    if (index === currentQuestionIndex) {
      btn.classList.add('current');
    } else if (studentAnswers[index]) {
      btn.classList.add('answered');
    }
  });
}

function updateQuestionStats() {
  const answered = Object.keys(studentAnswers).length;
  const remaining = allQuestions.length - answered;

  document.getElementById('attemptedCount').textContent = answered;
  document.getElementById('remainingCount').textContent = remaining;
}

function displayQuestion(index) {
  if (index < 0 || index >= allQuestions.length) return;

  saveCurrentAnswer();

  currentQuestionIndex = index;
  const question = allQuestions[index];

  document.getElementById('questionNo').textContent = index + 1;
  document.getElementById('questionTitle').textContent = question.question;

  document.getElementById('textA').textContent = question.optionA;
  document.getElementById('textB').textContent = question.optionB;
  document.getElementById('textC').textContent = question.optionC;
  document.getElementById('textD').textContent = question.optionD;

  const answers = document.querySelectorAll('input[name="answer"]');
  answers.forEach(ans => ans.checked = false);

  if (studentAnswers[index]) {
    const radio = document.getElementById('option' + studentAnswers[index]);
    if (radio) radio.checked = true;
  }

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === allQuestions.length - 1;

  updateQuestionGrid();
}

function saveCurrentAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (selected) {
    studentAnswers[currentQuestionIndex] = selected.value;
  } else {
    delete studentAnswers[currentQuestionIndex];
  }
  updateQuestionStats();
  updateQuestionGrid();
}

function nextQuestion() {
  if (currentQuestionIndex < allQuestions.length - 1) {
    displayQuestion(currentQuestionIndex + 1);
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    displayQuestion(currentQuestionIndex - 1);
  }
}

function showSubmitModal() {
  const answered = Object.keys(studentAnswers).length;
  const unanswered = allQuestions.length - answered;

  document.getElementById('modalAttempted').textContent = answered;
  document.getElementById('modalUnanswered').textContent = unanswered;

  document.getElementById('submitModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('submitModal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('submitModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

async function confirmSubmit() {
  saveCurrentAnswer();

  const answers = [];
  Object.keys(studentAnswers).forEach(qIndex => {
    answers.push({
      questionId: allQuestions[qIndex]._id,
      selectedOption: studentAnswers[qIndex],
    });
  });

  try {
    if (examTimer) {
      examTimer.stop();
    }

    const response = await fetch('/api/exam/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: currentSessionId,
        answers: answers,
      }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('resultId', data.data.resultId);
      showResult(data.data);
    } else {
      alert('Error submitting exam: ' + data.message);
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('Failed to submit exam');
  }
}

function showResult(result) {
  const percentage = result.percentage.toFixed(2);
  const passed = percentage >= 40;

  const html = `
    <div class="result-page">
      <div class="result-header ${passed ? 'passed' : 'failed'}">
        <h1>${passed ? '✅ PASSED' : '❌ FAILED'}</h1>
        <p>Exam Submitted Successfully</p>
      </div>

      <div class="result-score">
        <div class="score-display">
          <span class="marks">${result.marksObtained}</span>
          <span class="total">/ 100</span>
          <span class="percentage">${percentage}%</span>
        </div>
      </div>

      <div class="result-stats">
        <div class="stat-card">
          <div class="stat-label">Attempted</div>
          <div class="stat-value">${result.correctAnswers + result.wrongAnswers}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Correct</div>
          <div class="stat-value success">${result.correctAnswers}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Wrong</div>
          <div class="stat-value danger">${result.wrongAnswers}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Unanswered</div>
          <div class="stat-value">${result.unattemptedQuestions}</div>
        </div>
      </div>

      <div class="result-actions">
        <button class="btn btn-primary" onclick="location.href='/'">Start New Exam</button>
        <button class="btn btn-secondary" onclick="location.href='/admin'">Admin Panel</button>
      </div>
    </div>
  `;

  document.body.innerHTML = html;
  addResultStyles();
}

function addResultStyles() {
  const style = document.createElement('style');
  style.textContent = `
    body { background: white; }
    .result-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .result-header {
      text-align: center;
      color: white;
      margin-bottom: 30px;
    }
    .result-header.passed h1 {
      color: #10b981;
      font-size: 48px;
    }
    .result-header.failed h1 {
      color: #ef4444;
      font-size: 48px;
    }
    .result-score {
      background: white;
      padding: 40px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 30px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .score-display {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 10px;
    }
    .marks {
      font-size: 64px;
      font-weight: bold;
      color: #2563eb;
    }
    .total {
      font-size: 32px;
      color: #64748b;
    }
    .percentage {
      font-size: 36px;
      font-weight: bold;
      color: #10b981;
    }
    .result-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
      max-width: 600px;
      width: 100%;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .stat-label {
      color: #64748b;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #2563eb;
    }
    .stat-value.success {
      color: #10b981;
    }
    .stat-value.danger {
      color: #ef4444;
    }
    .result-actions {
      display: flex;
      gap: 15px;
    }
    .result-actions .btn {
      width: auto;
      padding: 12px 30px;
    }
  `;
  document.head.appendChild(style);
}

function autoSubmitExam() {
  console.log('Auto-submitting exam due to time expiry');
  saveCurrentAnswer();
  confirmSubmit();
}
