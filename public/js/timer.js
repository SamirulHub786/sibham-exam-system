class ExamTimer {
  constructor(durationInSeconds = 3600) {
    this.totalDuration = durationInSeconds;
    this.remainingTime = durationInSeconds;
    this.isRunning = false;
    this.intervalId = null;
    this.onTick = null;
    this.onTimeUp = null;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.remainingTime--;
      
      if (this.onTick) {
        this.onTick(this.remainingTime);
      }

      if (this.remainingTime <= 0) {
        this.stop();
        if (this.onTimeUp) {
          this.onTimeUp();
        }
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.isRunning = false;
    }
  }

  getFormattedTime() {
    const hours = Math.floor(this.remainingTime / 3600);
    const minutes = Math.floor((this.remainingTime % 3600) / 60);
    const seconds = this.remainingTime % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  isDanger() {
    return this.remainingTime <= 60;
  }
}

let examTimer = null;

function updateTimerDisplay(timer) {
  const timerElement = document.getElementById('timer');
  if (!timerElement) return;

  timerElement.textContent = timer.getFormattedTime();
  timerElement.className = 'timer';

  if (timer.isDanger()) {
    timerElement.classList.add('danger');
  }
}

function initializeTimer(durationInSeconds = 3600) {
  examTimer = new ExamTimer(durationInSeconds);
  
  examTimer.onTick = (remainingTime) => {
    updateTimerDisplay(examTimer);
    
    if (remainingTime % 30 === 0) {
      saveCurrentAnswer();
    }
  };

  examTimer.onTimeUp = () => {
    console.log('Time is up! Auto-submitting exam...');
    autoSubmitExam();
  };

  examTimer.start();
  updateTimerDisplay(examTimer);

  return examTimer;
}
