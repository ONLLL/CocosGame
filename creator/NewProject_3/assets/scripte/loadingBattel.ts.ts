// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    onLoad() {

        //  console.log('onload');
        let map: cc.TiledMap = this.node.getChildByName('tiledmap').getComponent(cc.TiledMap);
        let mapGroup = map.getObjectGroup("base");
        let arr = mapGroup.getObjects();

        for (let i = 0; i < arr.length; i++) {
            let value: cc.Object = arr[i];
            let bas = cc.instantiate(this.prefab);

            bas.x = value['x'] - this.node.getContentSize().width / 2;
            bas.y = value['y'] - this.node.getContentSize().height / 2;

            this.node.addChild(bas);
        }


    }
}
