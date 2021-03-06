// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  @property(cc.Node)
  bg: cc.Node = null;

  @property(cc.Node)
  mask:cc.Node = null;

  private anim: cc.Animation = null;
  // onLoad () {}

  start() {
    this.anim = this.bg.getComponent(cc.Animation);
  }

  onClickRoomBack() {
    this.anim.play('heroHomeAnimRe');
   
    let act = cc.delayTime(0.3);
    let callfunc = cc.callFunc(()=>{
      this.mask.active = false;
      this.bg.parent.active = false;
    });
    this.bg.runAction(cc.sequence(act,callfunc));
  }

  onClickPowerBack() {
    this.anim.play('powerupsAnimRe');
    //this.bg.parent.active = false;

    let act = cc.delayTime(0.3);
    let callfunc = cc.callFunc(()=>{
      this.mask.active = false;
      this.bg.parent.active = false;
    });
    this.bg.runAction(cc.sequence(act,callfunc));
  }

  onClickShopBack() {
    this.anim.play('shopAnimRe');
   // this.bg.parent.active = false;

    let act = cc.delayTime(0.3);
    let callfunc = cc.callFunc(()=>{
      this.mask.active = false;
      this.bg.parent.active = false;
    });
    this.bg.runAction(cc.sequence(act,callfunc));
  }

  onClickTowerBack() {
    this.anim.play('shopAnimRe');
   // this.bg.parent.active = false;

    let act = cc.delayTime(0.3);
    let callfunc = cc.callFunc(()=>{
      this.mask.active = false;
      this.bg.parent.active = false;
    });
    this.bg.runAction(cc.sequence(act,callfunc));
  }

  onClickMask(){
    if(this.bg.active)
    {
      this.anim.play('toBatteAnimRe');
      //this.bg.parent.active = false;
  
      let act = cc.delayTime(0.3);
      let callfunc = cc.callFunc(()=>{
        this.mask.active = false;
        this.bg.parent.active = false;
      });
      this.bg.runAction(cc.sequence(act,callfunc));
    }
  }
}
