var flag_speech = 0;
const music = new Audio()
var text_list = [];
const textToMusic = new TextToMusic();
var previous_text = '';
var recognize_history = []
var requested_date = 0;

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
            const res_text = results[i][0].transcript;
            const new_text_list = text_list.concat(res_text);
            document.getElementById('result_text').innerHTML = res_text;
            if (results[i].isFinal) {
                text_list = new_text_list;

                // 再生
                textToMusic.PlaySound(text_list.join(', '));

                recognize_history = []
                vr_function();
            } else {
                flag_speech = 1;
                recognize_history.unshift(res_text)


                const utc = Date.now()
                console.log(utc - requested_date)

                // 最後のリクエストから3秒以内だったら何もしない
                if (utc - requested_date < 3000)
                    break
                requested_date = Date.now()



                if (recognize_history.length > 10) {
                    var new_text = '';
                    for (let i = 0; i < recognize_history[0].length; i++) {
                        if (i == recognize_history[10].length || recognize_history[0][i] != recognize_history[10][i])
                            break
                        new_text += recognize_history[0][i]
                    }
                    const request_text = new_text_list.join(', ');
                    if (previous_text != request_text) {
                        console.log(request_text);
                        textToMusic.PlaySound(request_text);
                        previous_text = request_text
                    }
                }
            }

        }
    }
    flag_speech = 0;
    recognition.start();
}