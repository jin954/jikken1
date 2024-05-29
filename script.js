document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-pomodoro');
    const resetButton = document.getElementById('reset-pomodoro');
    const settingsButton = document.getElementById('open-settings');
    const setPomodoroButton = document.getElementById('set-pomodoro');
    const pomodoroModeButton = document.getElementById('pomodoro-mode');
    const shortBreakModeButton = document.getElementById('short-break-mode');
    const longBreakModeButton = document.getElementById('long-break-mode');
    const pomodoroMinutesInput = document.getElementById('pomodoro-minutes');
    const shortBreakMinutesInput = document.getElementById('short-break-minutes');
    const longBreakMinutesInput = document.getElementById('long-break-minutes');
    const backgroundColorSelect = document.getElementById('background-color');

    let interval;
    let timerRunning = false;
    let remainingTime = 0;

    // Load settings from localStorage
    loadSettings();

    startButton.addEventListener('click', startPomodoro);
    resetButton.addEventListener('click', resetPomodoro);
    settingsButton.addEventListener('click', toggleSettings);
    setPomodoroButton.addEventListener('click', setPomodoroSettings);
    pomodoroModeButton.addEventListener('click', () => setMode('pomodoro'));
    shortBreakModeButton.addEventListener('click', () => setMode('short-break'));
    longBreakModeButton.addEventListener('click', () => setMode('long-break'));

    function startPomodoro() {
        if (!timerRunning) {
            timerRunning = true;
            const currentMode = document.querySelector('.buttons button.active').id;
            let minutes;

            if (currentMode === 'pomodoro-mode') {
                minutes = parseInt(pomodoroMinutesInput.value);
            } else if (currentMode === 'short-break-mode') {
                minutes = parseInt(shortBreakMinutesInput.value);
            } else if (currentMode === 'long-break-mode') {
                minutes = parseInt(longBreakMinutesInput.value);
            }

            remainingTime = minutes * 60;
            interval = setInterval(updateTimer, 1000);
        }
    }

    function resetPomodoro() {
        clearInterval(interval);
        timerRunning = false;
        remainingTime = 0;
        const currentMode = document.querySelector('.buttons button.active').id;
        let minutes;

        if (currentMode === 'pomodoro-mode') {
            minutes = parseInt(pomodoroMinutesInput.value);
        } else if (currentMode === 'short-break-mode') {
            minutes = parseInt(shortBreakMinutesInput.value);
        } else if (currentMode === 'long-break-mode') {
            minutes = parseInt(longBreakMinutesInput.value);
        }

        document.getElementById('timer').textContent = `${minutes}:00`;
    }

    function toggleSettings() {
        const settings = document.getElementById('settings');
        settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
    }

    function setPomodoroSettings() {
        const pomodoroMinutes = pomodoroMinutesInput.value;
        const shortBreakMinutes = shortBreakMinutesInput.value;
        const longBreakMinutes = longBreakMinutesInput.value;
        const backgroundColor = backgroundColorSelect.value;

        // Save settings to localStorage
        localStorage.setItem('pomodoroMinutes', pomodoroMinutes);
        localStorage.setItem('shortBreakMinutes', shortBreakMinutes);
        localStorage.setItem('longBreakMinutes', longBreakMinutes);
        localStorage.setItem('backgroundColor', backgroundColor);

        // Update the timer display with new settings
        document.getElementById('timer').textContent = `${pomodoroMinutes}:00`;

        // Update the background color
        document.body.style.backgroundColor = backgroundColor;

        // Update button styles based on background color
        updateButtonStyles(backgroundColor);

        toggleSettings();
    }

    function loadSettings() {
        const pomodoroMinutes = localStorage.getItem('pomodoroMinutes') || 25;
        const shortBreakMinutes = localStorage.getItem('shortBreakMinutes') || 5;
        const longBreakMinutes = localStorage.getItem('longBreakMinutes') || 15;
        const backgroundColor = localStorage.getItem('backgroundColor') || '#1a1a2e';

        pomodoroMinutesInput.value = pomodoroMinutes;
        shortBreakMinutesInput.value = shortBreakMinutes;
        longBreakMinutesInput.value = longBreakMinutes;
        backgroundColorSelect.value = backgroundColor;

        // Set the timer display to the loaded pomodoro time
        document.getElementById('timer').textContent = `${pomodoroMinutes}:00`;

        // Set the background color
        document.body.style.backgroundColor = backgroundColor;

        // Update button styles based on background color
        updateButtonStyles(backgroundColor);
    }

    function setMode(mode) {
        // Remove active class from all buttons
        document.querySelectorAll('.buttons button').forEach(button => button.classList.remove('active'));

        // Add active class to the clicked button
        if (mode === 'pomodoro') {
            pomodoroModeButton.classList.add('active');
            document.getElementById('timer').textContent = `${pomodoroMinutesInput.value}:00`;
        } else if (mode === 'short-break') {
            shortBreakModeButton.classList.add('active');
            document.getElementById('timer').textContent = `${shortBreakMinutesInput.value}:00`;
        } else if (mode === 'long-break') {
            longBreakModeButton.classList.add('active');
            document.getElementById('timer').textContent = `${longBreakMinutesInput.value}:00`;
        }

        // Update button styles based on background color
        updateButtonStyles(document.body.style.backgroundColor);
    }

    function updateTimer() {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerRunning = false;
            // ここにタイマー終了時の処理を追加することができます
        }
    }

    function updateButtonStyles(backgroundColor) {
        const activeButton = document.querySelector('.buttons button.active');
        if (backgroundColor === '#FFFFFF') {
            activeButton.classList.add('white-bg');
        } else {
            document.querySelectorAll('.buttons button').forEach(button => button.classList.remove('white-bg'));
        }
    }
});
