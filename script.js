body {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    background: #1a1a2e;
    color: white;
}

#date {
    font-size: 0.8em;
}

#time {
    font-size: 2em;
    letter-spacing: -0.03em;
}

#clock, #pomodoro, #countdown {
    text-align: center;
    display: none;
}

#clock.active, #pomodoro.active, #countdown.active {
    display: block;
}

.switch {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.switch label {
    margin-right: 10px;
    padding: 5px 10px;
    border: 2px solid black;
    border-radius: 25px;
    background: white;
    color: black;
    cursor: pointer;
}

.switch input[type="radio"] {
    display: none;
}

.switch input[type="radio"]:checked + label {
    background: black;
    color: white;
}

#pomodoro, #countdown {
    transform: scale(0.8);
}

#pomodoro .buttons, #countdown .buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

#pomodoro .buttons button, #countdown .buttons button {
    margin: 0 5px;
    padding: 5px 15px;
    border: 2px solid black;
    border-radius: 25px;
    background: white;
    color: black;
    cursor: pointer;
    font-size: 0.8em;
}

#timer, #countdownDisplay {
    font-size: 2em;
    margin: 10px 0;
}

.pomodoro-controls {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.pomodoro-controls button {
    margin: 0 5px;
    padding: 5px 10px;
    border: 2px solid black;
    border-radius: 25px;
    background: white;
    color: black;
    cursor: pointer;
    font-size: 1em;
}

.settings-button {
    font-size: 1.5em;
    background: none;
    border: none;
    cursor: pointer;
    color: white;
}

.settings-panel {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -10%);
    background: rgba(26, 26, 46, 0.9);
    padding: 20px;
    border-radius: 10px;
    color: white;
}

.settings-panel label {
    display: block;
    margin: 10px 0;
}

.settings-panel select {
    margin-left: 10px;
}

.settings-panel button {
    margin-top: 10px;
    padding: 5px 10px;
    border: 2px solid black;
    border-radius: 25px;
    background: white;
    color: black;
    cursor: pointer;
    font-size: 1em;
}

