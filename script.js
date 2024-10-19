let images = JSON.parse(localStorage.getItem("images")) || [];

function openSettings() {
    document.getElementById("settingsModal").style.display = "block";
}

function closeSettings() {
    document.getElementById("settingsModal").style.display = "none";
}

function selectMode(mode) {
    if (mode === 'timer') {
        document.querySelector('.timer-settings').style.display = 'block';
    } else if (mode === 'alarm') {
        document.querySelector('.timer-settings').style.display = 'none';
    }
}

function saveSettings() {
    const timerHours = document.getElementById("timerHours").value;
    const timerMinutes = document.getElementById("timerMinutes").value;
    console.log("タイマー設定が保存されました: " + timerHours + "時間 " + timerMinutes + "分");
}

function saveImages() {
    const uploadInput = document.getElementById("uploadImage");
    if (uploadInput.files.length > 0) {
        for (const file of uploadInput.files) {
            const reader = new FileReader();
            reader.onload = function (e) {
                images.push({ url: e.target.result });
                localStorage.setItem("images", JSON.stringify(images));
                displayImages();
            };
            reader.readAsDataURL(file);
        }
    }
}

function displayImages() {
    const imageList = document.getElementById("imageList");
    imageList.innerHTML = "";
    images.forEach((image, index) => {
        const div = document.createElement("div");
        div.className = "image-item";
        div.innerHTML = `
            <img src="${image.url}" alt="登録画像" width="50">
            <button onclick="moveImage(${index}, -1)">↑</button>
            <button onclick="moveImage(${index}, 1)">↓</button>
            <button onclick="deleteImage(${index})">削除</button>
        `;
        imageList.appendChild(div);
    });
}

function moveImage(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const temp = images[index];
    images[index] = images[newIndex];
    images[newIndex] = temp;
    localStorage.setItem("images", JSON.stringify(images));
    displayImages();
}

function deleteImage(index) {
    images.splice(index, 1);
    localStorage.setItem("images", JSON.stringify(images));
    displayImages();
}

function initialize() {
    displayImages();
    document.getElementById("uploadImage").addEventListener("change", saveImages);
    document.getElementById("settingsButton").addEventListener("click", openSettings);
    document.querySelector(".close-button").addEventListener("click", closeSettings);
    document.getElementById("saveTimerSettings").addEventListener("click", saveSettings);
}

document.addEventListener("DOMContentLoaded", initialize);
