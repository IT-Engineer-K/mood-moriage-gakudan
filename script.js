var flag_speech = 0;
const music = new Audio()
const text_list = [];

function vr_function() {
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    var recognition = new webkitSpeechRecognition();
    recognition.lang = 'ja';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onsoundstart = function() {
        document.getElementById('status').innerHTML = "認識中";
    };
    recognition.onnomatch = function() {
        document.getElementById('status').innerHTML = "もう一度試してください";
    };
    recognition.onerror = function() {
        document.getElementById('status').innerHTML = "エラー";
        if (flag_speech == 0)
            vr_function();
    };
    recognition.onsoundend = function() {
        document.getElementById('status').innerHTML = "停止中";
        vr_function();
    };

    recognition.onresult = function(event) {
        var results = event.results;
        for (var i = event.resultIndex; i < results.length; i++) {
            if (results[i].isFinal) {
                const res_text = results[i][0].transcript
                text_list.push(res_text)
                if (text_list.length > 3)
                    text_list.shift()
                const request_text = text_list.join('\n')
                console.log(request_text)
                document.getElementById('result_text').innerHTML = res_text;

                const formData = new FormData()
                formData.append('text', request_text)
                fetch('http://musicapi.pythonanywhere.com/' /*'http://127.0.0.1:5000' 'https://mudosheng-rishang-gele-tuan.onrender.com/'*/ , {
                    method: "POST",
                    mode: 'cors',
                    body: formData
                }).then(res => res.text()).then(text => {
                    text = encodeURI(text)
                    const newUrl = `https://it-engineer-k.github.io/mood-moriage-gakudan/musics/${text}.mp3`
                    console.log(music.src, newUrl)
                    if (music.src == newUrl)
                        return
                    music.pause()
                    music.src = `https://it-engineer-k.github.io/mood-moriage-gakudan/musics/${text}.mp3`
                    music.play()
                })
                vr_function();
            } else {
                document.getElementById('result_text').innerHTML = results[i][0].transcript;
                flag_speech = 1;
            }
        }
    }
    flag_speech = 0;
    recognition.start();
}