let images = JSON.parse(localStorage.getItem("images")) || [];
let currentIndex = 0;
let displayTime = (localStorage.getItem("displayTime") || 0) * 60 * 1000; 
let timer;
let selectedMode = localStorage.getItem("selectedMode") || 'timer'; // デフォルトはタイマー
let alarmTime = localStorage.getItem("alarmTime") || ''; // アラーム時刻を保持

// 初期設定の画像
const defaultImage = "default_image.png"; 

// 画像をロードする
function loadImage(index) {
    const currentImageElement = document.getElementById("currentImage");
    if (images.length > 0) {
        currentImageElement.src = images[index].url;
    } else {
        currentImageElement.src = defaultImage; // 初期画像を表示
    }
}

// 次の画像へ
function nextImage() {
    currentIndex = (currentIndex + 1) % (images.length || 1);
    loadImage(currentIndex);
    resetTimer(); // タイマーをリセット
}

// 前の画像へ
function prevImage() {
    currentIndex = (currentIndex - 1 + (images.length || 1)) % (images.length || 1);
    loadImage(currentIndex);
    resetTimer(); // タイマーをリセット
}

// タイマーを開始
function startTimer() {
    clearTimeout(timer); // 既存のタイマーをクリア
    const savedStartTime = localStorage.getItem("timerStartTime");
    if (savedStartTime) {
        const elapsed = Date.now() - new Date(savedStartTime).getTime();
        const remainingTime = displayTime - elapsed;
        if (remainingTime > 0) {
            timer = setTimeout(nextImage, remainingTime);
        } else {
            nextImage(); // すでに経過している場合は次の画像へ
        }
    } else if (displayTime > 0) {
        timer = setTimeout(nextImage, displayTime); // 新しいタイマーをセット
        localStorage.setItem("timerStartTime", new Date().toISOString()); // 開始時間を保存
    }
}

// タイマーをリセット
function resetTimer() {
    clearTimeout(timer); // 既存のタイマーをクリア
    localStorage.removeItem("timerStartTime"); // 保存された開始時間をクリア
    startTimer(); // タイマーを再スタート
}

// 設定モーダルを開く
function openSettings() {
    document.getElementById("settingsModal").style.display = "block";
    updateImageList();
}

// 設定モーダルを閉じる
function closeSettings() {
    document.getElementById("settingsModal").style.display = "none";
}

// モード選択（タイマーとアラーム）
function selectMode(mode) {
    selectedMode = mode;
    localStorage.setItem("selectedMode", mode); // モードを保存

    if (mode === 'timer') {
        document.querySelector('.timer-settings').style.display = 'block';
        document.querySelector('.alarm-settings').style.display = 'none';
        changeButtonColors("timer");
    } else {
        document.querySelector('.timer-settings').style.display = 'none';
        document.querySelector('.alarm-settings').style.display = 'block';
        changeButtonColors("alarm");
    }
}

// 保存ボタンの色を変更
function changeSaveButtonColor() {
    const saveButton = document.getElementById("saveButton");
    saveButton.style.backgroundColor = "green"; // 保存後に色を緑に変更
    setTimeout(() => {
        saveButton.style.backgroundColor = ""; // 元の色に戻す
    }, 2000); // 2秒後に元に戻す
}

// タイマーとアラームボタンの色変更
function changeButtonColors(selectedMode) {
    const timerButton = document.getElementById("timerButton");
    const alarmButton = document.getElementById("alarmButton");

    if (selectedMode === "timer") {
        timerButton.style.backgroundColor = "lightblue"; // タイマー選択時の色
        alarmButton.style.backgroundColor = "";
    } else {
        timerButton.style.backgroundColor = "";
        alarmButton.style.backgroundColor = "lightblue"; // アラーム選択時の色
    }
}

// 設定を保存
function saveSettings() {
    if (selectedMode === 'timer') {
        // タイマーの時刻を取得
        const timerTime = document.getElementById("timerTime").value;
        const [hours, minutes] = timerTime.split(":").map(Number);
        displayTime = (hours * 60 + minutes) * 60 * 1000; // ミリ秒に変換
        localStorage.setItem("displayTime", (hours * 60 + minutes)); 
        resetTimer(); // タイマーをリセットして再スタート
    } else if (selectedMode === 'alarm') {
        // アラームの時刻を取得
        alarmTime = document.getElementById("alarmTime").value;
        localStorage.setItem("alarmTime", alarmTime); // アラーム時刻を保存
        alert(`毎日 ${alarmTime} に画像が切り替わります`);
        startAlarmCheck(); // アラームチェックを開始
    }

    // 保存ボタンの色を変更
    changeSaveButtonColor();
}

// アラームチェック関数
function startAlarmCheck() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    const [alarmHours, alarmMinutes] = alarmTime.split(":").map(Number);

    if (currentHours === alarmHours && currentMinutes === alarmMinutes) {
        nextImage(); // アラーム時刻に画像を次に切り替える
    }

    setTimeout(startAlarmCheck, 60000); // 1分おきに再チェック
}

// 画像をアップロードして保存
function saveImages() {
    const uploadInput = document.getElementById("uploadImage");
    if (uploadInput.files.length > 0) {
        for (const file of uploadInput.files) {
            const reader = new FileReader();
            reader.onload = function (e) {
                images.push({ url: e.target.result });
                localStorage.setItem("images", JSON.stringify(images));
                updateImageList();
            };
            reader.readAsDataURL(file);
        }
    }
}

// ページロード時に最初の画像を表示
window.onload = function () {
    loadImage(currentIndex);
    startTimer(); // タイマーの初期化
    startAlarmCheck(); // アラームのチェックも開始

    // 保存されたモードに応じて色を変更
    changeButtonColors(selectedMode);
};
