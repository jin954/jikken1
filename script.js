document.addEventListener('DOMContentLoaded', () => {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    const clockElement = document.getElementById('clock');
    const pomodoroElement = document.getElementById('pomodoro');
    const countdownElement = document.getElementById('countdown');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const switchElements = document.querySelectorAll('.switch input');

    // Clock
    let showSeconds = true;
    let is24Hour = true;

    function updateClock() {
        const now = new Date();
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const day = dayNames[now.getDay()];
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        let period = '';

        if (!is24Hour) {
            period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
        }

        const timeString = `${String(hours).padStart(2, '0')}:${minutes}${showSeconds ? `:${seconds}` : ''} ${period}`;
        const dateString = `${year}年${month}月${date}日 (${day})`;

        dateElement.innerText = dateString;
        timeElement.innerText = timeString;
    }

    setInterval(updateClock, 1000);

    // Pomodoro Timer
    let pomodoroTime = 25 * 60;
    let shortBreakTime = 5 * 60;
    let longBreakTime = 15 * 60;
    let remainingTime = pomodoroTime;
    let pomodoroInterval;
    let currentMode = 'pomodoro';

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

    // Switch between modes
    switchElements.forEach(switchElement => {
        switchElement.addEventListener('change', () => {
            const mode = switchElement.value;
            clockElement.classList.remove('active');
            pomodoroElement.classList.remove('active');
            countdownElement.classList.remove('active');
            document.getElementById(mode).classList.add('active');
        });
    });

    // Settings
    function openSettingsPanel(panelId) {
        document.getElementById(panelId).style.display = 'block';
    }

    function closeSettingsPanel(panelId) {
        document.getElementById(panelId).style.display = 'none';
    }

    // Clock settings
    document.getElementById('clock-settings').addEventListener('click', () => {
        openSettingsPanel('clock-settings-panel');
    });

    document.getElementById('close-clock-settings').addEventListener('click', () => {
        closeSettingsPanel('clock-settings-panel');
        is24Hour = document.getElementById('time-format').value === '24h';
        showSeconds = document.getElementById('show-seconds').checked;
        const clockBgColor = document.getElementById('clock-bg-color').value;
        const clockTextColor = document.getElementById('clock-text-color').value;
        clockElement.style.backgroundColor = clockBgColor;
        clockElement.style.color = clockTextColor;
        const clockBgImage = document.getElementById('clock-bg-image').files[0];
        if (clockBgImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
                clockElement.style.backgroundImage = `url(${e.target.result})`;
            }
            reader.readAsDataURL(clockBgImage);
        }
    });

    // Pomodoro settings
    document.getElementById('pomodoro-settings').addEventListener('click', () => {
        openSettingsPanel('pomodoro-settings-panel');
    });

    document.getElementById('close-pomodoro-settings').addEventListener('click', () => {
        closeSettingsPanel('pomodoro-settings-panel');
        pomodoroTime = parseInt(document.getElementById('pomodoroMinutes').value) * 60;
        shortBreakTime = parseInt(document.getElementById('shortBreakMinutes').value) * 60;
        longBreakTime = parseInt(document.getElementById('longBreakMinutes').value) * 60;
        const pomodoroBgColor = document.getElementById('pomodoro-bg-color').value;
        const pomodoroTextColor = document.getElementById('pomodoro-text-color').value;
        pomodoroElement.style.backgroundColor = pomodoroBgColor;
        pomodoroElement.style.color = pomodoroTextColor;
        const pomodoroBgImage = document.getElementById('pomodoro-bg-image').files[0];
        if (pomodoroBgImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
                pomodoroElement.style.backgroundImage = `url(${e.target.result})`;
            }
            reader.readAsDataURL(pomodoroBgImage);
        }
        updatePomodoro();
    });

    // Countdown settings
    document.getElementById('countdown-settings').addEventListener('click', () => {
        openSettingsPanel('countdown-settings-panel');
    });

    document.getElementById('close-countdown-settings').addEventListener('click', () => {
        closeSettingsPanel('countdown-settings-panel');
        const countdownBgColor = document.getElementById('countdown-bg-color').value;
        const countdownTextColor = document.getElementById('countdown-text-color').value;
        countdownElement.style.backgroundColor = countdownBgColor;
        countdownElement.style.color = countdownTextColor;
        const countdownBgImage = document.getElementById('countdown-bg-image').files[0];
        if (countdownBgImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
                countdownElement.style.backgroundImage = `url(${e.target.result})`;
            }
            reader.readAsDataURL(countdownBgImage);
        }
    });
});
