class AD {
    constructor() {
        this.ad_effect = document.getElementById('ad-effect');
        this.ad_effect_view = document.getElementById('ad-click');
        this.ad_effect.addEventListener('animationend', () => {
            this.ad_effect.classList.remove('train-effect')
            this.ad_effect.src = '';
        })
    }
    train() {
        this.ad_effect.src = 'ad/train/img/notepad.webp';
        this.ad_effect.classList.add('train-effect');
        this.ad_effect_view.href = 'https://play.google.com/store/apps/details?id=com.konju.memoapp';
    }
}