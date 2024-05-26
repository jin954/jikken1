document.addEventListener('DOMContentLoaded', () => {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    const clockElement = document.getElementById('clock');
    const pomodoroElement = document.getElementById('pomodoro');
    const countdownElement = document.getElementById('countdown');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const switchElements = document.querySelectorAll('.switch input');

    // Clock
    function updateClock() {
        const now = new Date();
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const day = dayNames[now.getDay()];
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        dateElement.innerText = `${year}/${month}/${date}(${day})`;
        timeElement.innerText = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Switch between modes
    switchElements.forEach(element => {
        element.addEventListener('change', (e) => {
            const mode = e.target.value;
            clockElement.classList.remove('active');
            pomodoroElement.classList.remove('active');
            countdownElement.classList.remove('active');
            if (mode === 'clock') {
                clockElement.classList.add('active');
            } else if (mode === 'pomodoro') {
                pomodoroElement.classList.add('active');
            } else if (mode === 'countdown') {
                countdownElement.classList.add('active');
            }
        });
    });

    // Pomodoro Timer
    let pomodoroInterval;
    let pomodoroTime = 25 * 60;
    let shortBreakTime = 5 * 60;
    let longBreakTime = 15 * 60;
    let currentMode = 'pomodoro';
    let remainingTime = pomodoroTime;

    function updatePomodoro() {
        const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
        const seconds = String(remainingTime % 60).padStart(2, '0');
        document.getElementById('timer').innerText = `${minutes}:${seconds}`;
    }

    function startPomodoro() {
        clearInterval(pomodoroInterval);
        pomodoroInterval = setInterval(() => {
            remainingTime -= 1;
            if (remainingTime <= 0) {
                clearInterval(pomodoroInterval);
            }
            updatePomodoro();
        }, 1000);
    }

    document.getElementById('pomodoroMode').addEventListener('click', () => {
        currentMode = 'pomodoro';
        remainingTime = pomodoroTime;
        updatePomodoro();
    });

    document.getElementById('shortBreakMode').addEventListener('click', () => {
        currentMode = 'shortBreak';
        remainingTime = shortBreakTime;
        updatePomodoro();
    });

    document.getElementById('longBreakMode').addEventListener('click', () => {
        currentMode = 'longBreak';
        remainingTime = longBreakTime;
        updatePomodoro();
    });

    document.getElementById('startTimer').addEventListener('click', startPomodoro);

    document.getElementById('resetTimer').addEventListener('click', () => {
        clearInterval(pomodoroInterval);
        if (currentMode === 'pomodoro') {
            remainingTime = pomodoroTime;
        } else if (currentMode === 'shortBreak') {
            remainingTime = shortBreakTime;
        } else if (currentMode === 'longBreak') {
            remainingTime = longBreakTime;
        }
        updatePomodoro();
    });

    // Settings
    document.getElementById('open-settings').addEventListener('click', () => {
        document.getElementById('settings').style.display = 'block';
    });

    document.getElementById('close-settings').addEventListener('click', () => {
        document.getElementById('settings').style.display = 'none';
        pomodoroTime = parseInt(document.getElementById('pomodoroMinutes').value) * 60;
        shortBreakTime = parseInt(document.getElementById('shortBreakMinutes').value) * 60;
        longBreakTime = parseInt(document.getElementById('longBreakMinutes').value) * 60;
        if (currentMode === 'pomodoro') {
            remainingTime = pomodoroTime;
        } else if (currentMode === 'shortBreak') {
            remainingTime = shortBreakTime;
        } else if (currentMode === 'longBreak') {
            remainingTime = longBreakTime;
        }
        updatePomodoro();
    });

    // Countdown Timer
    let countdownInterval;
    let countdownTargetDate;

    function updateCountdown() {
        const now = new Date();
        const distance = countdownTargetDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownDisplay.innerText = "00日00時間00分00秒";
            return;
        }

        const days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');

        countdownDisplay.innerText = `${days}日${hours}時間${minutes}分${seconds}秒`;
    }

    function startCountdown() {
        clearInterval(countdownInterval);
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    document.getElementById('startCountdown').addEventListener('click', () => {
        const year = parseInt(document.getElementById('countdownYear').value);
        const month = parseInt(document.getElementById('countdownMonth').value) - 1; // Month is 0-based
        const day = parseInt(document.getElementById('countdownDay').value);
        const hour = parseInt(document.getElementById('countdownHour').value);
        const minute = parseInt(document.getElementById('countdownMinute').value);
        const second = parseInt(document.getElementById('countdownSecond').value);

        countdownTargetDate = new Date(year, month, day, hour, minute, second);
        startCountdown();
    });

    document.getElementById('resetCountdown').addEventListener('click', () => {
        clearInterval(countdownInterval);
        countdownDisplay.innerText = "00日00時間00分00秒";
    });

    // Countdown Settings
    document.getElementById('open-countdown-settings').addEventListener('click', () => {
        document.getElementById('countdown-settings').style.display = 'block';
    });

    document.getElementById('close-countdown-settings').addEventListener('click', () => {
        document.getElementById('countdown-settings').style.display = 'none';
    });
});
