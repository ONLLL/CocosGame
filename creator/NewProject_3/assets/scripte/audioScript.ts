// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioClip)
    back_music: cc.AudioClip = null;

    @property(cc.AudioClip)
    button_effect: cc.AudioClip = null;

    @property(cc.AudioClip)
    buy_effect: cc.AudioClip = null;

    @property(cc.Toggle)
    music_toggle: cc.Toggle = null;

    @property(cc.Toggle)
    sound_toggle: cc.Toggle = null;

    @property(Number)
    music_volume:number = 0;

    @property(Number)
    effect_volume:number = 0

    onLoad() {
        let music = localStorage.getItem("music");
        let soud = localStorage.getItem("soud");

        if (music == '1') {
            cc.audioEngine.playMusic(this.back_music, true);
        
        }

        if (this.music_toggle) {
            if (music == '1') {
                this.music_toggle.isChecked = false;
            }
            else {
                this.music_toggle.isChecked = true;
            }
        }

        if (this.sound_toggle) {
            if (soud == '1') {
                this.sound_toggle.isChecked = false;
            }
            else {
                this.sound_toggle.isChecked = true;
            }
        }

        
    }

    playButtonEffect() {
        let soud = localStorage.getItem("soud");
        if (soud == '1') {
            cc.audioEngine.playEffect(this.button_effect, false);
        }
    }

    playBuyEffect() {
        let soud = localStorage.getItem("soud");
        if (soud == '1') {
            cc.audioEngine.playEffect(this.buy_effect, false);
        }
    }

    onClickMusic() {
        if (!this.sound_toggle.isChecked) {
            cc.audioEngine.playEffect(this.button_effect, false);
        }
        if (!this.music_toggle.isChecked) {
            localStorage.setItem("music", '1');
            cc.audioEngine.playMusic(this.back_music, true);
        }
        else {
            localStorage.setItem("music", '0');
            cc.audioEngine.stopMusic()
        }
    }

    onClickSound() {
        if (!this.sound_toggle.isChecked) {
            cc.audioEngine.playEffect(this.button_effect, false);
        }
        if (!this.sound_toggle.isChecked) {
            localStorage.setItem("soud", '1');
            cc.audioEngine.playEffect(this.button_effect, false);
        }
        else {
            localStorage.setItem("soud", '0');

        }
    }

}
