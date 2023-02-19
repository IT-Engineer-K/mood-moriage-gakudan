var flag_speech = 0;
const music = new Audio()
var text_list = [];
const textToMusic = new TextToMusic();
const effects = new Effects();
var previous_text = '';
var recognize_history = []
var requested_date = 0;
const chat = document.getElementById('chat');
const draft = document.getElementById('draft');
const submitButton = document.getElementById('submit')
const recordButton = document.getElementById('record')
const recordIcon = document.getElementById('record_icon')
let recognizing = false

// 一番下までスクロールしているかどうか
function isScrollBottom() {
    return Math.abs(chat.scrollHeight - (chat.scrollTop + chat.offsetHeight)) < 1;
};

function resizeDraft() {
    draft.style.height = '0px';
    draft.style.height = draft.scrollHeight + 'px';
    if (recognizing) return;
    if (draft.value == '') {
        submitButton.style.display = 'none';
        recordButton.style.display = 'inline';
    } else {
        submitButton.style.display = 'inline';
        recordButton.style.display = 'none';
    }
}
resizeDraft();
draft.focus();
draft.select();

// ショートカット
function shortcut(e) {
    if (e.keyCode == 10) {
        submit(draft.value);
        draft.value = '';
        submitButton.style.display = 'none';
        recordButton.style.display = 'inline';
        resizeDraft();
    }
}

draft.addEventListener('input', resizeDraft);
draft.addEventListener('keypress', shortcut);

function createEffect(name) {
    name = decodeURI(name)
    switch (name) {
        case 'eye-catch':
            effects.train();
            break;
        case 'Cat_life':
            effects.train();
            break;
        case '夏の霧':
            effects.sad();
            break;
        case 'yonhonnorecorder':
            effects.train();
            break;
            musics = [
                'おとぼけダンス', '大混乱', 'Funny_Funny', '全力で逃げる時のBGM', 'トッカータとフーガ〜ギャグVer〜', 'シラけムードは少し気まずい',
                '修羅場_怒り心頭', 'おばけとかぼちゃのスープ', 'いちごホイップ', '昼下がり気分', '冬の朝焼け',
                'Happy_birthday', 'happytime', '夏休みの探検', 'Recollections', 'パステルハウス',
                'なんでしょう？', '謹賀新年', 'ジングルベル'
            ]
    }
    if (effects.sad_is_running && name != '夏の霧')
        effects.sad(exit = true);
    else if (effects.train_is_running && !['eye-catch', 'yonhonnorecorder', 'Cat_life'].includes(name))
        effects.train(exit = true);
}

function submit(text) {
    if (text == '')
        return

    const is_bottom = isScrollBottom()
    const comment = chat.appendChild(document.createElement('div'))
    comment.classList.add('comment')
    comment.classList.add('my-comment')
    comment.innerText = text;
    draft.value = '';
    if (is_bottom) chat.scrollTo(0, chat.scrollHeight)

    text_list.push(text);

    // 再生
    textToMusic.PlaySound(text_list.join(', '), createEffect);
}

window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
var recognition = new webkitSpeechRecognition();

function vr_function(start = false) {
    recognition.lang = 'ja';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onsoundstart = function() {
        console.log("認識中");
    };
    recognition.onnomatch = function() {
        console.log("もう一度試してください");
    };
    recognition.onerror = function(e) {
        if (e.error == 'not-allowed')
            console.log("エラー", e);
        if (flag_speech == 0)
            vr_function();
    };
    recognition.onsoundend = function() {
        console.log("停止中");
        if (recognizing)
            var request_function = setInterval(() => {
                try {
                    vr_function(true);
                    clearInterval(request_function)
                } catch (e) {
                    recognition.stop();
                }
            }, 100)
    };

    recognition.onresult = function(event) {
        var results = event.results;
        for (var i = event.resultIndex; i < results.length; i++) {
            const res_text = results[i][0].transcript;

            draft.value = res_text;


            if (results[i].isFinal) {
                submit(res_text)
                vr_function();
                recognize_history = []
            } else {
                flag_speech = 1;
                recognize_history.unshift(res_text)


                const utc = Date.now()

                // 最後のリクエストから2秒以内だったら何もしない
                if (utc - requested_date < 2000)
                    break
                requested_date = Date.now()
            }

        }
        resizeDraft();
    }
    flag_speech = 0;

    if (start) {
        recognition.start();
        recognizing = true;
    }
}


function switchTypeMode() {
    if (recognizing) {
        recognition.stop();
        recognizing = false;
        resizeDraft();
        recordIcon.classList.remove('red-icon');
        recordIcon.src = 'img/record.svg';
        draft.removeAttribute('disabled');
        draft.setAttribute('placeholder', '入力してください');
        return;
    }
    recordIcon.classList.add('red-icon');
    vr_function(true);
    recordIcon.src = 'img/recording.svg';
    draft.setAttribute('disabled', true);
    draft.setAttribute('placeholder', '喋ってください');
}