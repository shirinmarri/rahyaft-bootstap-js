window.convertArray = (win1251Array) => {
    var win1251decoder = new TextDecoder('windows-1251');
    var bytes = new Uint8Array(win1251Array);
    var decodedArray = win1251decoder.decode(bytes);
    console.log(decodedArray);
    return decodedArray;
};

window.utilities = {
    focusElement: function (element) {
        element.focus();
    },
    disableElement: function (element) {
        element.setAttribute('disabled', 'disabled');
    },
    enableElement: function (element) {
        element.removeAttribute('disabled');
    },
    scrollToButtom: function (element) {
        element.scrollTop = element.scrollHeight;
    },
    scrollToFragment: (elementId) => {
        var element = document.getElementById(elementId);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
};

window.recorder = {
    record: function (element, elementStop, dotnetHelper) {
        element.hidden = true;
        elementStop.hidden = false;
        var base64data = "";
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                var audioChunks = [];
                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener("stop", () => {
                    element.hidden = false;
                    elementStop.hidden = true;
                    //const audioBlob = new Blob(audioChunks);
                    //const audioUrl = URL.createObjectURL(audioBlob);
                    //const audio = new Audio(audioUrl);
                    //player.src = audioUrl;
                    //audio.play();


                    const clipContainer = document.createElement('article');
                    const audioPlayer = document.createElement('audio');
                    clipContainer.classList.add('clip');
                    audioPlayer.setAttribute('controls', '');

                    clipContainer.appendChild(audioPlayer);
                    //audioPlayer.appendChild(clipContainer);

                    const blob = new Blob(audioChunks, { 'type': 'audio/mp3; codecs=opus' });

                    const audioURL = URL.createObjectURL(blob);
                    audioPlayer.src = audioURL;

                    var reader = new FileReader();

                    reader.onload = function (data) {

                        base64data = data.target.result;
                        return dotnetHelper.invokeMethodAsync('Data', base64data)
                            .then(r => console.log(r));
                    };
                    reader.readAsDataURL(blob);
                    audioChunks = [];
                });

                elementStop.onclick = function () {

                    mediaRecorder.stop();
                }

                setTimeout(() => {
                    if (mediaRecorder.state == "recording")
                        mediaRecorder.stop();
                }, 10000);
            });
    }

}


window.notifications = {

    notifyMe: function (message) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("این مرورگر از قابلیت اعلان برخوردار نیست");
        }
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(message);
        }
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(message);
                }
            });
        }
    }
}