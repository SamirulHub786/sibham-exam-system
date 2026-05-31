// Admin Dashboard JavaScript
let currentPage = 1;
let currentLimit = 10;

// Initialize admin page
document.addEventListener('DOMContentLoaded', () => {
  initializeAdmin();
});

function initializeAdmin() {
  // Setup tab navigation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.dataset.tab;
      switchTab(tab);
    });
  });

  // Setup form handlers
  const addQuestionForm = document.getElementById('addQuestionForm');
  if (addQuestionForm) {
    addQuestionForm.addEventListener('submit', handleAddQuestion);
  }

  // Load dashboard by default
  switchTab('dashboard');
}

function switchTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.admin-tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Show selected tab
  const selectedTab = document.getElementById(tabName + 'Tab');
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Update nav items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Load data based on tab
  if (tabName === 'dashboard') {
    loadDashboard();
  } else if (tabName === 'results') {
    loadResults();
  } else if (tabName === 'questions') {
    loadQuestions();
  }
}

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const response = await fetch('/api/admin/analytics');
    const data = await response.json();

    if (data.success) {
      document.getElementById('totalStudents').textContent = data.data.totalStudents;
      document.getElementById('totalSubmitted').textContent = data.data.totalSubmitted;
      document.getElementById('totalQuestions').textContent = data.data.totalQuestions;
      document.getElementById('averagePercentage').textContent = data.data.averagePercentage + '%';
      document.getElementById('highestScore').textContent = data.data.highestScore + '%';
      document.getElementById('lowestScore').textContent = data.data.lowestScore + '%';
      document.getElementById('passedStudents').textContent = data.data.passedStudents;
      document.getElementById('failedStudents').textContent = data.data.failedStudents;
    }
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

// ===== RESULTS =====
async function loadResults(page = 1) {
  currentPage = page;
  
  try {
    const response = await fetch(`/api/admin/results?page=${page}&limit=${currentLimit}`);
    const data = await response.json();

    if (data.success) {
      displayResults(data.data);
      displayPagination(data.totalPages, page);
    }
  } catch (err) {
    console.error('Error loading results:', err);
  }
}

function displayResults(results) {
  const tbody = document.getElementById('resultsBody');
  tbody.innerHTML = '';

  if (results.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="text-center">No results found</td></tr>';
    return;
  }

  results.forEach(result => {
    const row = document.createElement('tr');
    const status = result.status === 'auto-submitted' ? '⏱️ Auto' : '✅ Submitted';
    
    row.innerHTML = `
      <td>${result.rollNo}</td>
      <td>${result.studentName}</td>
      <td>${result.marksObtained}</td>
      <td>${result.percentage.toFixed(2)}%</td>
      <td>${result.attemptedQuestions}</td>
      <td>${result.correctAnswers}</td>
      <td>${result.wrongAnswers}</td>
      <td>${result.duration}</td>
      <td>${status}</td>
      <td>
        <button class="btn btn-small btn-primary" onclick="viewResultDetails('${result._id}')">View</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function displayPagination(totalPages, currentPage) {
  const controls = document.getElementById('paginationControls');
  controls.innerHTML = '';

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '← Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => loadResults(currentPage - 1);
  controls.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.classList.toggle('active', i === currentPage);
    pageBtn.onclick = () => loadResults(i);
    controls.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => loadResults(currentPage + 1);
  controls.appendChild(nextBtn);
}

async function viewResultDetails(resultId) {
  try {
    const response = await fetch(`/api/admin/result/${resultId}`);
    const data = await response.json();

    if (data.success) {
      displayResultModal(data.data);
    }
  } catch (err) {
    console.error('Error loading result details:', err);
  }
}

function displayResultModal(result) {
  const detailsDiv = document.getElementById('resultDetails');
  
  const html = `
    <div class="result-details">
      <div class="result-details-item">
        <span class="result-details-label">Student Name</span>
        <span class="result-details-value">${result.studentName}</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Roll Number</span>
        <span class="result-details-value">${result.rollNo}</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Marks Obtained</span>
        <span class="result-details-value">${result.marksObtained} / 100</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Percentage</span>
        <span class="result-details-value">${result.percentage.toFixed(2)}%</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Questions Attempted</span>
        <span class="result-details-value">${result.attemptedQuestions}</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Correct Answers</span>
        <span class="result-details-value" style="color: #10b981">${result.correctAnswers}</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Wrong Answers</span>
        <span class="result-details-value" style="color: #ef4444">${result.wrongAnswers}</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Unanswered</span>
        <span class="result-details-value">${result.unattemptedQuestions}</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Time Spent</span>
        <span class="result-details-value">${Math.floor(result.duration / 60)} minutes ${result.duration % 60} seconds</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Submitted At</span>
        <span class="result-details-value">${new Date(result.submittedAt).toLocaleString()}</span>
      </div>
      <div class="result-details-item">
        <span class="result-details-label">Status</span>
        <span class="result-details-value">${result.status === 'auto-submitted' ? '⏱️ Auto-submitted' : '✅ Submitted'}</span>
      </div>
    </div>
  `;

  detailsDiv.innerHTML = html;
  document.getElementById('resultModal').style.display = 'flex';
}

function closeResultModal() {
  document.getElementById('resultModal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('resultModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// ===== QUESTIONS =====
async function loadQuestions() {
  try {
    const response = await fetch('/api/admin/questions');
    const data = await response.json();

    if (data.success) {
      displayQuestions(data.data);
    }
  } catch (err) {
    console.error('Error loading questions:', err);
  }
}

function displayQuestions(questions) {
  const tbody = document.getElementById('questionsBody');
  tbody.innerHTML = '';

  if (questions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No questions found</td></tr>';
    return;
  }

  questions.forEach(q => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${q.questionNo}</td>
      <td>${q.question.substring(0, 50)}...</td>
      <td>${q.topic || '-'}</td>
      <td>${q.difficulty}</td>
      <td><strong>${q.correctAnswer}</strong></td>
      <td>
        <button class="btn btn-small btn-secondary" onclick="editQuestion('${q._id}')">Edit</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ===== ADD QUESTION =====
async function handleAddQuestion(e) {
  e.preventDefault();

  const question = document.getElementById('questionText').value.trim();
  const optionA = document.getElementById('optionAText').value.trim();
  const optionB = document.getElementById('optionBText').value.trim();
  const optionC = document.getElementById('optionCText').value.trim();
  const optionD = document.getElementById('optionDText').value.trim();
  const correctAnswer = document.getElementById('correctAnswer').value;
  const difficulty = document.getElementById('difficulty').value;
  const topic = document.getElementById('topic').value.trim();

  if (!question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    const response = await fetch('/api/admin/question/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        difficulty,
        topic,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert('✅ Question added successfully!');
      document.getElementById('addQuestionForm').reset();
      loadQuestions();
    } else {
      alert('❌ Error: ' + data.message);
    }
  } catch (err) {
    console.error('Error adding question:', err);
    alert('Failed to add question');
  }
}

function editQuestion(questionId) {
  alert('Edit functionality coming soon!');
}
