document.addEventListener('DOMContentLoaded', () => {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    const clockElement = document.getElementById('clock');
    const pomodoroElement = document.getElementById('pomodoro');
    const countdownElement = document.getElementById('countdown');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const switchElements = document.querySelectorAll('.switch input');
    const settingsPanels = document.querySelectorAll('.settings-panel');

    const defaultBgColor = '#1a1a2e';
    const defaultTextColor = 'white';
    
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
        const dateString = `${year}年${month}月${date}日 ${day}曜日`;

        timeElement.textContent = timeString;
        dateElement.textContent = dateString;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Mode switch
    switchElements.forEach(el => {
        el.addEventListener('change', (e) => {
            clockElement.classList.remove('active');
            pomodoroElement.classList.remove('active');
            countdownElement.classList.remove('active');
            const mode = e.target.value;
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
    const pomodoroMinutesInput = document.getElementById('pomodoroMinutes');
    const shortBreakMinutesInput = document.getElementById('shortBreakMinutes');
    const longBreakMinutesInput = document.getElementById('longBreakMinutes');

    let pomodoroDuration = 25 * 60;
    let shortBreakDuration = 5 * 60;
    let longBreakDuration = 15 * 60;
    let timerDuration = pomodoroDuration;
    let timerInterval;

    function startTimer() {
        clearInterval(timerInterval);
        const startTime = Date.now();
        const endTime = startTime + timerDuration * 1000;
        timerInterval = setInterval(() => {
            const now = Date.now();
            const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));
            const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
            const seconds = String(remainingTime % 60).padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
            if (remainingTime === 0) {
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerDuration = pomodoroDuration;
        document.getElementById('timer').textContent = '25:00';
    }

    document.getElementById('startTimer').addEventListener('click', startTimer);
    document.getElementById('resetTimer').addEventListener('click', resetTimer);
    document.getElementById('pomodoroMode').addEventListener('click', () => {
        timerDuration = pomodoroDuration;
        resetTimer();
    });
    document.getElementById('shortBreakMode').addEventListener('click', () => {
        timerDuration = shortBreakDuration;
        resetTimer();
    });
    document.getElementById('longBreakMode').addEventListener('click', () => {
        timerDuration = longBreakDuration;
        resetTimer();
    });

    // Countdown Timer
    let countdownEndTime;

    function updateCountdown() {
        const now = Date.now();
        const remainingTime = Math.max(0, countdownEndTime - now);
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        countdownDisplay.textContent = `${days}日${hours}時間${minutes}分${seconds}秒`;
        if (remainingTime === 0) {
            clearInterval(timerInterval);
        }
    }

    document.getElementById('startCountdown').addEventListener('click', () => {
        const year = document.getElementById('countdownYear').value;
        const month = document.getElementById('countdownMonth').value - 1;
        const day = document.getElementById('countdownDay').value;
        const hour = document.getElementById('countdownHour').value;
        const minute = document.getElementById('countdownMinute').value;
        const second = document.getElementById('countdownSecond').value;
        countdownEndTime = new Date(year, month, day, hour, minute, second).getTime();
        clearInterval(timerInterval);
        timerInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    });

    document.getElementById('resetCountdown').addEventListener('click', () => {
        clearInterval(timerInterval);
        countdownDisplay.textContent = '00日00時間00分00秒';
    });

    // Settings Panels
    function showPanel(panelId) {
        settingsPanels.forEach(panel => panel.style.display = 'none');
        document.getElementById(panelId).style.display = 'block';
    }

    function hidePanels() {
        settingsPanels.forEach(panel => panel.style.display = 'none');
    }

    document.getElementById('clock-settings').addEventListener('click', () => showPanel('clock-settings-panel'));
    document.getElementById('pomodoro-settings').addEventListener('click', () => showPanel('pomodoro-settings-panel'));
    document.getElementById('countdown-settings').addEventListener('click', () => showPanel('countdown-settings-panel'));

    document.getElementById('close-clock-settings').addEventListener('click', hidePanels);
    document.getElementById('close-pomodoro-settings').addEventListener('click', hidePanels);
    document.getElementById('close-countdown-settings').addEventListener('click', hidePanels);

    // Time format settings
    document.getElementById('time-format').addEventListener('change', (e) => {
        is24Hour = e.target.value === '24h';
    });

    document.getElementById('show-seconds').addEventListener('change', (e) => {
        showSeconds = e.target.checked;
    });

    // Background and text color settings
    document.getElementById('bg-color').addEventListener('change', (e) => {
        document.body.style.backgroundColor = e.target.value;
    });

    document.getElementById('bg-color-pomodoro').addEventListener('change', (e) => {
        document.body.style.backgroundColor = e.target.value;
    });

    document.getElementById('bg-color-countdown').addEventListener('change', (e) => {
        document.body.style.backgroundColor = e.target.value;
    });

    function createColorOptions(containerId, inputId) {
        const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color;
            colorDiv.addEventListener('click', () => {
                document.getElementById(inputId).value = color;
                document.getElementById(inputId).dispatchEvent(new Event('input'));
            });
            container.appendChild(colorDiv);
        });
        const customColorInput = document.createElement('input');
        customColorInput.type = 'color';
        customColorInput.addEventListener('input', (e) => {
            document.getElementById(inputId).value = e.target.value;
        });
        container.appendChild(customColorInput);
    }

    createColorOptions('clock-text-color-container', 'clock-text-color');
    createColorOptions('pomodoro-text-color-container', 'pomodoro-text-color');
    createColorOptions('countdown-text-color-container', 'countdown-text-color');

    function applyTextColor(inputId, targetElement) {
        document.getElementById(inputId).addEventListener('input', (e) => {
            targetElement.style.color = e.target.value;
        });
    }

    applyTextColor('clock-text-color', document.getElementById('time'));
    applyTextColor('clock-text-color', document.getElementById('date'));
    applyTextColor('pomodoro-text-color', document.getElementById('timer'));
    applyTextColor('countdown-text-color', document.getElementById('countdownDisplay'));

    // Apply default colors on close settings
    document.querySelectorAll('.settings-panel button').forEach(button => {
        button.addEventListener('click', () => {
            document.body.style.backgroundColor = defaultBgColor;
            document.getElementById('time').style.color = defaultTextColor;
            document.getElementById('date').style.color = defaultTextColor;
            document.getElementById('timer').style.color = defaultTextColor;
            document.getElementById('countdownDisplay').style.color = defaultTextColor;
        });
    });
});
