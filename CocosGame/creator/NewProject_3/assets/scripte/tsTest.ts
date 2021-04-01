// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // @property(cc.Animation)
    // anim: cc.Animation = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
       //this.anim = this.node.getComponent(cc.Animation);
    }
    onLoad(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    }
    
    onDestrot(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    }

    onKeyDown(event){
        switch(event.keyCode){
            case cc.macro.KEY.a:
                console.log('Press aKey');
                cc.director.loadScene('StartScene');
                break;
        }
    }

    onKeyUp(event){
        switch(event.keyCod){
            case cc.macro.KEY.a:
                console.log('release a key');
                cc.director.loadScene('StartScene');
                break;
        }
    }
    // update (dt) {}
}
