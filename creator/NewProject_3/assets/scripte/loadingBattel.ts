// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EnemyAction from "./enemy-action"

const { ccclass, property } = cc._decorator;

interface mapCofig{
    lv: number;
    sprite_frame: string;
    map: string;
    nomal: {
        money: number;
        gear: number;
        wave: number;
        lifes: number;
    }
    hard: {
        money: number;
        gear: number;
        wave: number;
        lifes: number;
    }
}
@ccclass
export default class LoadingBattel extends cc.Component {

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Prefab)
    enemyprefab:cc.Prefab = null;

    @property(cc.Node)
    lifes:cc.Node = null;

    @property(cc.Node)
    gear:cc.Node = null;

    @property(cc.Node)
    wave:cc.Node = null;

    private road:cc.Vec2[] = [];

    private nextpoint:number = 0;

    private dir:cc.Vec2;

    private roadRect:cc.Object[] = [];

    private i:number = 0;

   

    onLoad() {

        cc.resources.load("config/mapConfig",cc.JsonAsset,(err:Error,jsonAsset:cc.JsonAsset)=>{
            let map:mapCofig[] = jsonAsset.json;
            let n:number = Number(localStorage.getItem("choice_lv"))
            let mapdata:mapCofig = map[n - 1];
            console.log(n);
            
            this.gear.getComponentInChildren(cc.Label).string = String(mapdata.nomal.gear);
            this.wave.getComponentInChildren(cc.Label).string = String(mapdata.nomal.wave);
           this.lifes.getComponentInChildren(cc.Label).string = String(mapdata.nomal.lifes);

           
            cc.resources.load("battelmap/map_1",cc.TiledMapAsset,(err:Error,tiledmap:cc.TiledMapAsset)=>{
                let map: cc.TiledMap = this.node.getChildByName('tiledmap').getComponent(cc.TiledMap);
                map.tmxAsset = tiledmap;

                let mapGroup = map.getObjectGroup("base");
                let arr = mapGroup.getObjects();
        
                //塔的数量
                localStorage.setItem("tower_count",String(arr.length));
                for (let i = 0; i < arr.length; i++) {
                    let value: cc.Object = arr[i];
                    let bas = cc.instantiate(this.prefab);
        
                    bas.x = value['x']// - this.node.getContentSize().width / 2;
                    bas.y = value['y']// - this.node.getContentSize().height / 2 - 10;
        
                    this.node.addChild(bas,20);
                    bas.name = String(i);
                }
                
                let wayGroup = map.getObjectGroup("way");
                let way = wayGroup.getObject("111")
                let p = way['polylinePoints'];
              //  console.log(p);
                for(let i=0;i<p.length ;i++){
                    let c = new cc.Vec2(p[i]['x'] + way['x'],p[i]['y'] + way['y']);
                    this.road.push(c)
                }

                this.scheduleOnce(()=>{
                    this.createEnemy();
                })
            });

        });
    }
    start(){
    
    }

    createEnemy(){
        this.schedule(()=>{
            let enemy = cc.instantiate(this.enemyprefab);
            enemy.parent = this.node;

            let e:EnemyAction = enemy.getComponent("enemy-action")
            e.setRoad(this.road);
          //  e.startMove();

        },1,7,0);
    }
}
