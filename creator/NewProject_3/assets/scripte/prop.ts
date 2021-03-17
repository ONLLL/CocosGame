// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    //开启碰撞盒
    openBox()
    {
        this.node.getComponent(cc.BoxCollider).enabled = true;
    }

    //销毁节点
    deleteProp()
    {
        this.node.parent.destroy();
    }
}
