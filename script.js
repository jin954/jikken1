let images = JSON.parse(localStorage.getItem("images")) || [];
let currentIndex = 0;
let displayTime = (localStorage.getItem("displayTime") || 0) * 60 * 1000; 
let timer;
let selectedMode = 'timer'; // タイマーがデフォルトモード
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
    if (displayTime > 0) {
        timer = setTimeout(nextImage, displayTime); // タイマーを再設定
    }
}

// タイマーをリセット
function resetTimer() {
    clearTimeout(timer); // 既存のタイマーをクリア
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
    if (mode === 'timer') {
        document.querySelector('.timer-settings').style.display = 'block';
        document.querySelector('.alarm-settings').style.display = 'none';
    } else {
        document.querySelector('.timer-settings').style.display = 'none';
        document.querySelector('.alarm-settings').style.display = 'block';
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

        // タイマー用の保存ボタンを「設定済み」に変更
        const saveButton = document.getElementById("saveTimer");
        saveButton.textContent = "設定済み";
        saveButton.disabled = true;

        // タイマー用のリセットボタンを表示
        const resetButton = document.getElementById("resetTimer");
        resetButton.style.display = "inline";

    } else if (selectedMode === 'alarm') {
        // アラームの時刻を取得
        alarmTime = document.getElementById("alarmTime").value;
        localStorage.setItem("alarmTime", alarmTime); // アラーム時刻を保存
        alert(`毎日 ${alarmTime} に画像が切り替わります`);
        startAlarmCheck(); // アラームチェックを開始

        // アラーム用の保存ボタンを「設定済み」に変更
        const saveButton = document.getElementById("saveAlarm");
        saveButton.textContent = "設定済み";
        saveButton.disabled = true;

        // アラーム用のリセットボタンを表示
        const resetButton = document.getElementById("resetAlarm");
        resetButton.style.display = "inline";
    }
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

// 設定をリセット
function resetSettings() {
    localStorage.removeItem("displayTime");
    localStorage.removeItem("alarmTime");
    displayTime = 0;
    alarmTime = '';

    clearTimeout(timer); // タイマーを停止
    loadImage(currentIndex); // 初期画像を再表示

    // 「設定済み」を「保存」に戻す
    const saveButton = document.getElementById("saveButton");
    saveButton.textContent = "保存";
    saveButton.disabled = false;

    // 「リセット」ボタンを非表示に
    const resetButton = document.getElementById("resetButton");
    resetButton.style.display = "none";
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

// 画像リストの更新
function updateImageList() {
    const imageList = document.getElementById("imageList");
    imageList.innerHTML = "";
    images.forEach((image, index) => {
        const imageItem = document.createElement("div");
        imageItem.classList.add("image-item");
        
        const img = document.createElement("img");
        img.src = image.url;
        img.width = 50;
        img.height = 50;
        imageItem.appendChild(img);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("image-item-buttons");

        const upButton = document.createElement("button");
        upButton.textContent = "↑";
        upButton.onclick = () => moveImageUp(index);
        buttonContainer.appendChild(upButton);

        const downButton = document.createElement("button");
        downButton.textContent = "↓";
        downButton.onclick = () => moveImageDown(index);
        buttonContainer.appendChild(downButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.onclick = () => deleteImage(index);
        buttonContainer.appendChild(deleteButton);

        imageItem.appendChild(buttonContainer);
        imageList.appendChild(imageItem);
    });
}

// 画像を上に移動
function moveImageUp(index) {
    if (index > 0) {
        const temp = images[index];
        images[index] = images[index - 1];
        images[index - 1] = temp;
        localStorage.setItem("images", JSON.stringify(images));
        updateImageList();
    }
}

// 画像を下に移動
function moveImageDown(index) {
    if (index < images.length - 1) {
        const temp = images[index];
        images[index] = images[index + 1];
        images[index + 1] = temp;
        localStorage.setItem("images", JSON.stringify(images));
        updateImageList();
    }
}

// 画像を削除
function deleteImage(index) {
    images.splice(index, 1);
    localStorage.setItem("images", JSON.stringify(images));
    updateImageList();
}

// ページロード時に最初の画像を表示
window.onload = function () {
    // 設定があればその画像を表示
    if (localStorage.getItem("displayTime")) {
        loadImage(currentIndex);
    } else {
        // 設定がなければ初期画像を表示
        loadImage(0);
    }

    // タイマーとアラームの初期化
    startTimer(); // タイマーの初期化
    startAlarmCheck(); // アラームのチェックも開始

    // 設定があれば「保存」を「設定済み」に変更
    const saveButton = document.getElementById("saveButton");
    if (localStorage.getItem("displayTime") || localStorage.getItem("alarmTime")) {
        saveButton.textContent = "設定済み";
        saveButton.disabled = true;

       
