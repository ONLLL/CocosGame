// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    //遮挡界面
    @property(cc.Node)
    mask: cc.Node = null;

    //道具
    @property(cc.Node)
    box: cc.Node = null;

    //道具点开
    @property(cc.SpriteFrame)
    boxOpen: cc.SpriteFrame = null;

    //关闭道具
    @property(cc.SpriteFrame)
    boxClose: cc.SpriteFrame = null;

    private boxAnim: cc.Animation = null;
    private boxStatu: boolean = false;

    //暂停界面
    @property(cc.Node)
    pauseInterface: cc.Node = null;

    //金币商店
    @property(cc.Node)
    shopPowerus: cc.Node = null;

    //道具商店
    @property(cc.Node)
    powerups: cc.Node = null;

    //技能
    @property(cc.Node)
    skill: cc.Node = null;
    //技能 1
   
    private skill1: cc.Node = null;
    //技能 2
    private skill2: cc.Node = null;
    //技能 3
    private skill3: cc.Node = null;
    //点击技能
    private isCkilckSkill: number = -1;

    start() {
        this.boxAnim = this.box.getComponent(cc.Animation);

        this.skill1 = this.skill.getChildByName('skill1');
        this.skill2 = this.skill.getChildByName('skill2');
        this.skill3 = this.skill.getChildByName('skill3');
    }

    //道具按钮
    onClickBox() {
        this.boxStatu = !this.boxStatu;
        if (this.boxStatu) {
            this.box.getChildByName('box').getComponent(cc.Sprite).spriteFrame = this.boxOpen;
            this.boxAnim.play('boxAnim');
        }
        else {
            this.box.getChildByName('box').getComponent(cc.Sprite).spriteFrame = this.boxClose;
            this.boxAnim.play('boxAnimRe');
        }

    }

    //暂停按钮
    onClickPause() {
        cc.director.pause();
        this.mask.active = !this.mask.active;
        this.pauseInterface.active = !this.pauseInterface.active;
        this.pauseInterface.getComponent(cc.Animation).play('pauseAnim');
    }

    //重新开始
    onClickRestart() {
        cc.log('restart');
      //  cc.director.loadScene('BattelScene');
    }

    //返回主界面
    onClickQuit() {
        cc.log('quit');
        cc.director.loadScene('StartScene');
    }

    //取消暂停界面
    onClickPauseCancel() {
        this.mask.active = !this.mask.active;
        cc.director.resume();
        let act1 = this.pauseInterface.getComponent(cc.Animation).play('pauseAnimRe');

        let finshed = cc.callFunc(function () {
            this.pauseInterface.getChildByName('pause_window').setScale(1);
            this.pauseInterface.getChildByName('pause_window').opacity = 255;
            this.pauseInterface.active = !this.pauseInterface.active;
        }, this);

        let sqe = cc.sequence(cc.scaleBy(0.2, 1.5),cc.scaleBy(0.01,0.75), finshed);

        this.pauseInterface.getChildByName('pause_window').runAction(sqe);
    }

    //道具商店
    onClickBoxShop() {
        this.mask.active = !this.mask.active;
        this.powerups.getComponent(cc.Animation).play('powerupsAnim');
    }

    //道具商店取消
    onClickPowerupsCancel() {
        this.mask.active = !this.mask.active;
        this.powerups.getComponent(cc.Animation).play('powerupsAnimRe');
    }

    //金币购买页面取消
    onClickShopCancel() {
        this.mask.active = !this.mask.active;
        this.shopPowerus.getComponent(cc.Animation).play('shopAnimRe');
    }

   
    //技能按钮 1 
    onClickSkill1() {
        let self = this;
        if(this.isCkilckSkill != 1)
        {
            this.isCkilckSkill = 1;
            cc.resources.load('images/gamescene/button_desant_1_3',cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
                cc.log(self.skill1.name);
                self.skill1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            
            cc.resources.load('images/gamescene/button_desant_2',cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
                cc.log(self.skill2.name);
                self.skill2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            // cc.resources.load('images/gamescene/button_desant_3',cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
            //     cc.log(self.skill3.name);
            //     self.skill3.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            // });
        }
        else{
            this.isCkilckSkill = -1;
            cc.resources.load('images/gamescene/button_desant_1',cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
                cc.log(self.skill1.name);
                self.skill1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    }

    //技能按钮 1 
    onClickSkill2() {
        let self = this;
        if(this.isCkilckSkill != 2)
        {
            this.isCkilckSkill = 2;
            cc.resources.load('images/gamescene/button_desant_1',cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
                cc.log(self.skill1.name);
                self.skill1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load('images/gamescene/button_desant_2_3',cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
                cc.log(self.skill2.name);
                self.skill2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            // cc.resources.load('images/gamescene/button_desant_3',cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
            //     cc.log(self.skill3.name);
            //     self.skill3.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            // });
        }
        else{
            this.isCkilckSkill = -1;
            cc.resources.load('images/gamescene/button_desant_2',cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
                cc.log(self.skill2.name);
                self.skill2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    }

}
