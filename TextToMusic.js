class TextToMusic {
    constructor() {
        this.url = 'https://musicapi.pythonanywhere.com/'
        this.url = 'http://127.0.0.1:5000'
        this.token = Math.random().toString(32).substring(2)
    }

    PlaySound(text) {
        if (text.length > 100)
            text = text.slice(text.length - 100, text.length)

        const formData = new FormData()
        formData.append('text', text)
        formData.append('token', this.token)
        fetch(this.url, {
            method: "POST",
            mode: 'cors',
            body: formData
        }).then(res => res.text()).then(text => {
            text = encodeURI(text)
            const newUrl = `https://it-engineer-k.github.io/mood-moriage-gakudan/musics/${text}.mp3`
            if (music.src == newUrl)
                return
            music.pause()
            music.src = `https://it-engineer-k.github.io/mood-moriage-gakudan/musics/${text}.mp3`
            music.play()
        })
    }
}