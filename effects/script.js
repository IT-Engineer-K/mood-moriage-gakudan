class Effects {
    constructor() {
        this.image_effect = document.getElementById('image-effects');
        this.video_effect = document.getElementById('video-effects');
        this.effect_view = document.getElementById('effects-click');
        this.background = document.getElementById('background');
        this.image_effect.addEventListener('animationend', () => {
            this.image_effect.classList.remove('train-effect')
            this.image_effect.src = '';
        });

        this.video_effect.addEventListener('animationend', () => {
            if (this.video_effect.style.display == 'none')
                return;
            this.background.classList.add('sad-background-fadeout');
            this.video_effect.classList.add('sad-fadeout');
            this.sad_is_running = false;
            this.background.addEventListener('animationend', () => {
                if (this.background.classList.length == 2) {
                    this.video_effect.style.display = 'none'
                    this.video_effect.classList.remove(...this.video_effect.classList);
                    this.background.classList.remove(...this.background.classList);
                }
            });
        });
        this.video_effect.style.display = 'none';
        this.train_is_running = false;
        this.sad_is_running = false;
    }

    train(exit = false) {
        if (exit) {
            this.train_is_running = false;
            var duration = 20000;
            var currentTime = this.image_effect.getAnimations()[0].currentTime

            this.image_effect.classList.add('train-effect');
            const exit_train = setInterval(() => {
                duration *= .995;
                currentTime += 10
                currentTime *= duration / (duration + 100);

                this.image_effect.style.animationDuration = `${duration}ms`;
                if (this.image_effect.getAnimations().length == 0)
                    clearInterval(exit_train)
            }, 10);
            return;
        }
        this.train_is_running = true;
        this.image_effect.src = 'effects/train/img/notepad.webp';
        this.image_effect.setAttribute('usemap', '#map');
        this.image_effect.classList.add('train-effect');
        this.effect_view.href = 'https://play.google.com/store/apps/details?id=com.konju.memoapp';
    }

    sad(exit = false) {
        if (exit) {
            if (this.video_effect.style.display == 'none')
                return;
            this.background.classList.add('sad-background-fadeout');
            this.video_effect.classList.add('sad-fadeout');
            this.sad_is_running = false;
            this.background.addEventListener('animationend', () => {
                if (this.background.classList.length == 2) {
                    this.video_effect.style.display = 'none'
                    this.video_effect.classList.remove(...this.video_effect.classList);
                    this.background.classList.remove(...this.background.classList);
                }
            });
        }
        if (this.video_effect.style.display != 'none')
            return
        this.sad_is_running = true;

        this.video_effect.style.display = 'inline'
        this.video_effect.src = 'effects/sad/img/sad.webm';
        this.video_effect.classList.add('sad-effect');
        this.background.classList.add('sad-background-effect');
    }
}