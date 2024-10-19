let images = JSON.parse(localStorage.getItem("images")) || [];
    let currentIndex = 0;
    let displayTime = (localStorage.getItem("displayTime") || 0) * 60 * 1000;
    let timer;
    let selectedMode = 'timer';

    const defaultImage = "default_image.png";

    function loadImage(index) {
        if (images.length > 0) {
            document.getElementById("currentImage").src = images[index].url;
        } else {
            document.getElementById("currentImage").src = defaultImage;
        }
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % (images.length || 1);
        loadImage(currentIndex);
        resetTimer();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + (images.length || 1)) % (images.length || 1);
        loadImage(currentIndex);
        resetTimer();
    }

    function startTimer() {
        timer = setTimeout(nextImage, displayTime);
    }

    function resetTimer() {
        clearTimeout(timer);
        startTimer();
    }

    function openSettings() {
        document.getElementById("settingsModal").style.display = "block";
        updateImageList();
    }

    function closeSettings() {
        document.getElementById("settingsModal").style.display = "none";
    }

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

    function saveSettings() {
        if (selectedMode === 'timer') {
            const hours = document.getElementById("timerHours").value;
            const minutes = document.getElementById("timerMinutes").value;
            displayTime = (parseInt(hours) * 60 + parseInt(minutes)) * 60 * 1000;
            localStorage.setItem("displayTime", (parseInt(hours) * 60 + parseInt(minutes)));
            resetTimer();
        } else if (selectedMode === 'alarm') {
            const alarmTime = document.getElementById("alarmTime").value;
            alert(`アラーム設定: ${alarmTime}`);
        }
    }

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

    function moveImageUp(index) {
        if (index > 0) {
            const temp = images[index];
            images[index] = images[index - 1];
            images[index - 1] = temp;
            localStorage.setItem("images", JSON.stringify(images));
            updateImageList();
        }
    }

    function moveImageDown(index) {
        if (index < images.length - 1) {
            const temp = images[index];
            images[index] = images[index + 1];
            images[index + 1] = temp;
            localStorage.setItem("images", JSON.stringify(images));
            updateImageList();
        }
    }

    function deleteImage(index) {
        images.splice(index, 1);
        localStorage.setItem("images", JSON.stringify(images));
        updateImageList();
    }

    window.onload = function () {
        loadImage(currentIndex);
        startTimer();
    };
</script>

</body>
</html>
