// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;


@ccclass
export default class CreatEnemy extends cc.Component {

    private hp:number;
    private speed:number;
    private harm:number;

    @property(cc.Node)
    enemy:cc.Node = null;


    private i:number = 0;
    start(){

            // let n:number = Number(localStorage.getItem("choice_lv"))
           
            // cc.resources.load("battelmap/map_"+n,cc.TiledMapAsset,(err:Error,tiledmap:cc.TiledMapAsset)=>{
            //     let map: cc.TiledMap = this.node.parent.getComponentInChildren(cc.TiledMap);
                
            //     let wayGroup = map.getObjectGroup("way");

            //     let way = wayGroup.getObjects();
                
            //     console.log(way);
        
            //     for (let i = 0; i < way.length; i++) {
            //         let value: cc.Object = way[i];

            //         let x = value['x'] - this.node.getContentSize().width / 2;
            //         let y = value['y'] - this.node.getContentSize().height / 2 - 10;
                    
            //         this.road.push(new cc.Vec2(x,y));
            //     }
        
            // });
    }
    update(){
     //   console.log(this.enemy.position.x," ",this.enemy.position.y)
    }
    
    createEnemy(){
        let clip:cc.AnimationClip[] = this.enemy.getComponent(cc.Animation).getClips();
        this.enemy.getComponent(cc.Animation).play(clip[this.i].name);
        this.enemy.scaleX= -1;
        this.i++;
    }
}
