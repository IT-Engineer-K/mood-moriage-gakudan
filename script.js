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
            document.getElementById('result_text').innerHTML = res_text;
            if (results[i].isFinal) {
                text_list.push(res_text);
                // 再生
                textToMusic.PlaySound(text_list.join(', '));

                recognize_history = []
                vr_function();
            } else {
                flag_speech = 1;
                recognize_history.unshift(res_text)


                const utc = Date.now()

                // 最後のリクエストから3秒以内だったら何もしない
                if (utc - requested_date < 1000)
                    break
                requested_date = Date.now()



                if (recognize_history.length > 5) {
                    var new_text = '';
                    for (let i = 0; i < recognize_history[0].length; i++) {
                        if (i == recognize_history[5].length || recognize_history[0][i] != recognize_history[5][i])
                            break
                        new_text += recognize_history[0][i]
                    }

                    if (new_text == '') break
                    const request_text = text_list.concat(new_text).join(', ');
                    if (request_text.length < 20)
                        break
                    if (previous_text != request_text) {
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