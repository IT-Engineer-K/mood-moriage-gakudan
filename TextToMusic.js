class TextToMusic {
    constructor() {
        this.url = 'http://127.0.0.1:5000'
        this.url = 'https://musicapi.pythonanywhere.com/'
        this.token = Math.random().toString(32).substring(2)
        this.audio = {}
        this.fadeSpeed = 1
        this.old_url
    }

    // audioの切り替え
    PlayAudio(name) {
        if (undefined == this.audio[name]) {
            this.audio[name] = new Audio();
            this.audio[name].src = name;
        }
        const audio = this.audio[name];
        console.log(!audio.paused)
        if (name == this.old_url && !audio.paused) {
            return;
        }

        if (this.old_url == undefined) {
            audio.play();
            return;
        }

        const stopAudio = this.audio[this.old_url]
        var end_func = setInterval(function() {
                stopAudio.volume -= .01;

                //音楽が完全に止まった時
                if (stopAudio.volume <= (.01)) {
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
        if (text.length > 300)
            text = text.slice(text.length - 100, text.length)
        text = text.replaceAll('\n', ', ')
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

            this.PlayAudio(newUrl);
            this.old_url = newUrl;
        })
    }
}