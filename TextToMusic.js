class TextToMusic {
    constructor() {
        this.url = 'https://musicapi.pythonanywhere.com/'
        this.token = Math.random().toString(32).substring(2)
        this.fadeSpeed = 1
        this.audio = {}
        this.old_url

        const musics = ['おとぼけダンス', '大混乱', 'Funny_Funny', '全力で逃げる時のBGM', 'トッカータとフーガ〜ギャグVer〜', 'シラけムードは少し気まずい', '修羅場_怒り心頭', 'おばけとかぼちゃのスープ', 'いちごホイップ', 'eye-catch', '夏の霧', '昼下がり気分', '冬の朝焼け', 'Happy_birthday', 'yonhonnorecorder', 'happytime', '夏休みの探検', 'Recollections', 'パステルハウス', 'なんでしょう？', 'Cat_life', '謹賀新年', 'ジングルベル']
        for (let i = 0; i < musics.length; i++) {
            const key = `https://it-engineer-k.github.io/mood-moriage-gakudan/musics/${musics[i]}.mp3`
            this.audio[key] = new Audio()
            this.audio[key].src = key
            this.audio[key].play()
        }
    }

    // audioの切り替え
    PlayAudio(name) {
        if (undefined == this.audio[name]) {
            this.audio[name] = new Audio()
            this.audio[name].src = name
        }
        const audio = this.audio[name]

        if (this.old_url == undefined) {
            audio.play();
            return;
        }

        const stopAudio = this.audio[this.old_url]
        var end_func = setInterval(function() {
                stopAudio.volume -= .01;

                //音楽が完全に止まった時
                if (stopAudio.volume <= (1 / 100)) {
                    stopAudio.volume = 1;
                    stopAudio.pause();
                    audio.currentTime = 0
                    audio.play();
                    clearInterval(end_func);
                }
            },
            10);
    }


    PlaySound(text) {
        if (text.length > 100)
            text = text.slice(text.length - 100, text.length)
        console.log(text)

        const formData = new FormData()
        formData.append('text', text)
        formData.append('token', this.token)
        fetch(this.url, {
            method: "POST",
            mode: 'cors',
            body: formData
        }).then(res => res.text()).then(text => {
            text = encodeURI(text)
            console.log(decodeURI(text))
            const newUrl = `https://it-engineer-k.github.io/mood-moriage-gakudan/musics/${text}.mp3`
            if (music.src == newUrl)
                return;
            if (newUrl == this.old_url) return;

            this.PlayAudio(newUrl);
            this.old_url = newUrl;
        })
    }
}