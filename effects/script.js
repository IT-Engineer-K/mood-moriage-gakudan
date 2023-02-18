class Effects {
    constructor() {
        this.image_effect = document.getElementById('image-effects');
        this.video_effect = document.getElementById('video-effects');
        this.effect_view = document.getElementById('effects-click');
        this.effects_video_view = document.getElementById('effects-video-view');
        this.background = document.getElementById('background');
        this.image_effect.addEventListener('animationend', () => {
            this.image_effect.classList.remove('train-effect')
            this.image_effect.src = '';
        });

        this.video_effect.addEventListener('animationend', () => {
            this.background.classList.add('sad-effect-fadeout');
            this.background.addEventListener('animationend', () => {
                if (this.background.classList.length == 2) {
                    this.video_effect.style.display = 'none'
                    this.background.classList.remove(...this.background.classList);
                }
            })
        })
        this.video_effect.style.display = 'none'
    }

    train(exit = false) {
        if (exit) {
            return;
        }
        this.image_effect.src = 'effects/train/img/notepad.webp';
        this.image_effect.setAttribute('usemap', '#map');
        this.image_effect.classList.add('train-effect');
        this.effect_view.href = 'https://play.google.com/store/apps/details?id=com.konju.memoapp';
    }

    sad(exit = false) {
        if (exit) {
            this.video_effect.classList.add('sad-effect-fadeout');
            this.background.classList.add('sad-effect-fadeout');
            return;
        }
        if (this.video_effect.style.display != 'none')
            return

        this.video_effect.style.display = 'inline'
        this.video_effect.src = 'effects/sad/img/sad.webm';
        this.video_effect.classList.add('sad-effect');
        this.effects_video_view.classList.add('sad-effect-parent');
        this.background.classList.add('sad-background-effect');
    }
}