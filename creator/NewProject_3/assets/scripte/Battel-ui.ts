// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

enum Prop{
    NONE,
    POTION,
    ICE,
    HOLY,
}
@ccclass
export default class BattelUi extends cc.Component {

    //遮挡界面
    @property(cc.Node)
    mask: cc.Node = null;

    //道具
    @property(cc.Node)
    box: cc.Node = null;

    @property(cc.Node)
    prop_potion:cc.Node = null;

    @property(cc.Node)
    prop_ice:cc.Node = null;

    @property(cc.Node)
    prop_holy:cc.Node = null;

    choice_prop:Prop = Prop.NONE;

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
    private skill1_0:cc.SpriteFrame = null;
    private skill1_1:cc.SpriteFrame = null;
    //技能 2
    private skill2: cc.Node = null;
    private skill2_0:cc.SpriteFrame = null;
    private skill2_1:cc.SpriteFrame = null;
    //技能 3
    private skill3: cc.Node = null;
    private skill3_0:cc.SpriteFrame  =null;
    private skill3_1:cc.SpriteFrame = null;
    //点击技能
     isCkilckSkill: number = -1;

    @property(cc.Node)
    birthplace:cc.Node = null;

    start() {
        this.boxAnim = this.box.getComponent(cc.Animation);

        this.skill1 = this.skill.getChildByName('skill1');
        this.skill2 = this.skill.getChildByName('skill2');
        this.skill3 = this.skill.getChildByName('skill3');

        cc.resources.load('images/gamescene/button_desant_1_3',cc.SpriteFrame,(err,spriteFrame:cc.SpriteFrame)=>{
            //    cc.log(self.skill1.name);
                this.skill1_1 = spriteFrame;
            });
            
            cc.resources.load('images/gamescene/button_desant_2',cc.SpriteFrame,(err,spriteFrame:cc.SpriteFrame)=>{
            //    cc.log(self.skill2.name);
                this.skill2_0 = spriteFrame;
            });

            cc.resources.load('images/gamescene/button_desant_1',cc.SpriteFrame,(err,spriteFrame:cc.SpriteFrame)=>{
                // cc.log(self.skill1.name);
                 this.skill1_0 = spriteFrame;
             });
             cc.resources.load('images/gamescene/button_desant_2_3',cc.SpriteFrame,(err,spriteFrame:cc.SpriteFrame)=>{
                //    cc.log(self.skill2.name);
                    this.skill2_1 = spriteFrame;
                });
    }

    //道具按钮
    onClickBox() {
        this.boxStatu = !this.boxStatu;
        if (this.boxStatu) {
            this.box.getChildByName('box').getComponent(cc.Sprite).spriteFrame = this.boxOpen;
            this.boxAnim.play('boxAnim');
        }
        else {
            this.choice_prop = Prop.NONE;

            this.box.getChildByName('box').getComponent(cc.Sprite).spriteFrame = this.boxClose;
            this.boxAnim.play('boxAnimRe');
        }

        this.isCkilckSkill = -1;
        this.skill2.getComponent(cc.Sprite).spriteFrame =  this.skill2_0;
        this.skill1.getComponent(cc.Sprite).spriteFrame = this.skill1_0;
    }

    propSetScale()
    {
        this.choice_prop = Prop.NONE;
        this.prop_potion.scale = 1;
        this.prop_ice.scale = 1;
        this.prop_holy.scale = 1;
    }

    onClickPropPotion()
    {
       if(this.choice_prop != Prop.POTION)
       {
           this.choice_prop = Prop.POTION;
           this.prop_potion.scale = 1.2;
           this.prop_ice.scale = 1;
           this.prop_holy.scale = 1;
       }
       else
       {
        this.choice_prop = Prop.NONE;
       }
    }

    onClickPropIce()
    {
        if(this.choice_prop != Prop.ICE)
        {
            this.choice_prop = Prop.ICE;
            this.prop_potion.scale = 1;
            this.prop_ice.scale = 1.2;
            this.prop_holy.scale = 1;
        }
        else
        {
         this.choice_prop = Prop.NONE;
        }
    }

    onClickPropHoly()
    {
        if(this.choice_prop != Prop.HOLY)
        {
            this.choice_prop = Prop.HOLY;
            this.prop_potion.scale = 1;
            this.prop_ice.scale = 1;
            this.prop_holy.scale = 1.2;
        }
        else
        {
         this.choice_prop = Prop.NONE;
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
    
     
    }

    //返回主界面
    onClickQuit() {
        cc.director.resume();
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
            this.skill1.getComponent(cc.Sprite).spriteFrame = this.skill1_1;
            
            this.skill2.getComponent(cc.Sprite).spriteFrame =  this.skill2_0;
        }
        else{
            
            this.isCkilckSkill = -1;
            this.skill1.getComponent(cc.Sprite).spriteFrame = this.skill1_0;
        }

        if( this.boxStatu)
        {
            this.choice_prop = Prop.NONE;
            this.prop_potion.scale = 1;
            this.prop_ice.scale = 1;
            this.prop_holy.scale = 1;

            this.boxStatu = !this.boxStatu;
            this.box.getChildByName('box').getComponent(cc.Sprite).spriteFrame = this.boxClose;
            this.boxAnim.play('boxAnimRe');
        }
       
    }

     //技能按钮 2
     onClickSkill2() {
        let self = this;
        if(this.isCkilckSkill != 2)
        {
            this.isCkilckSkill = 2;
            this.skill2.getComponent(cc.Sprite).spriteFrame = this.skill2_1;
           
            this.skill1.getComponent(cc.Sprite).spriteFrame = this.skill1_0;
        }
        else{
            this.isCkilckSkill = -1;
            this.skill1.getComponent(cc.Sprite).spriteFrame = this.skill2_0;
        }

        if( this.boxStatu)
        {
            this.choice_prop = Prop.NONE;
            this.prop_potion.scale = 1;
            this.prop_ice.scale = 1;
            this.prop_holy.scale = 1;
            
            this.boxStatu = !this.boxStatu;
            this.box.getChildByName('box').getComponent(cc.Sprite).spriteFrame = this.boxClose;
            this.boxAnim.play('boxAnimRe');
        }
    }

    onLoad()
    {
       
    }

    onEnable(){
      //  console.log('onEnable');
    }
    onDestroy(){
       // console.log('onDestroy');
    }
    update()
    {
     //   console.log('upadte');
    }
    lateUpdate(){
       // console.log('lateUpdate');
    }


   

}
