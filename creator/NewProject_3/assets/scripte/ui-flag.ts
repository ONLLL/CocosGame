// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

   @property(cc.Node)
   flag:cc.Node = null;

   @property(cc.Node)
   mask:cc.Node =null;

   private anim:cc.Animation =null;

    start () {
        this.anim = this.flag.getComponent(cc.Animation);
    }

    onClickFlag(){
        this.mask.active = !this.mask.active;
       
        this.anim.play('toBattelAnim');
    }
}
