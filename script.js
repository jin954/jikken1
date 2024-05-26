document.addEventListener('DOMContentLoaded', () => {
    const pomodoroButton = document.getElementById('pomodoro-mode');
    const shortBreakButton = document.getElementById('short-break-mode');
    const longBreakButton = document.getElementById('long-break-mode');
    const timerDisplay = document.getElementById('timer-display');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const settingsButton = document.getElementById('settings-button');

    let mode = 'pomodoro';
    let timeLeft = 25 * 60;
    let timerInterval;

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (timerInterval) return;

        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                return;
            }

            timeLeft--;
            updateTimerDisplay();
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = mode === 'pomodoro' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
        updateTimerDisplay();
    }

    function setMode(newMode) {
        mode = newMode;
        resetTimer();

        document.body.style.backgroundColor =
            mode === 'pomodoro' ? '#1c1c2e' :
            mode === 'shortBreak' ? '#4a4a72' :
            '#33334d';
    }

    pomodoroButton.addEventListener('click', () => setMode('pomodoro'));
    shortBreakButton.addEventListener('click', () => setMode('shortBreak'));
    longBreakButton.addEventListener('click', () => setMode('longBreak'));
    startButton.addEventListener('click', startTimer);
    resetButton.addEventListener('click', resetTimer);

    updateTimerDisplay();
});
