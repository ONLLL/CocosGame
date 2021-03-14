// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EnemyAction from "./enemy-action"
import BaseCreate from "./base-create"

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

   
    //敌人
    private enemyArr:cc.Node[] = [];

    //塔
    private towerArr:cc.Node[] = [];

    onLoad() {

        cc.resources.load("config/mapConfig",cc.JsonAsset,(err:Error,jsonAsset:cc.JsonAsset)=>{
            let map:mapCofig[] = jsonAsset.json;
            let n:number = Number(localStorage.getItem("choice_lv"))
            let mapdata:mapCofig = map[n - 1];
            console.log(n);
            
            this.gear.getComponentInChildren(cc.Label).string = String(mapdata.nomal.gear);
            this.wave.getComponentInChildren(cc.Label).string = String(mapdata.nomal.wave);
           this.lifes.getComponentInChildren(cc.Label).string = String(mapdata.nomal.lifes);

           
            cc.resources.load(`battelmap/map_1`,cc.TiledMapAsset,(err:Error,tiledmap:cc.TiledMapAsset)=>{
                let map: cc.TiledMap = this.node.getChildByName('tiledmap').getComponent(cc.TiledMap);
                map.tmxAsset = null;
                map.tmxAsset = tiledmap;

                let mapGroup = map.getObjectGroup("base");
                let arr = mapGroup.getObjects();
        
                //塔的数量
                localStorage.setItem("tower_count",String(arr.length));
                for (let i = 0; i < arr.length; i++) {
                    let value: cc.Object = arr[i];
                    let bas = cc.instantiate(this.prefab);
        
                    bas.x = value['x']// - this.node.getContentSize().width / 2;
                    bas.y = value['y'];
        
                    this.node.addChild(bas,20);
                    bas.name = String(i);

                    this.towerArr.push(bas);
                }
                
                let wayGroup = map.getObjectGroup("way");
                let way = wayGroup.getObject("111")
                let p = way['polylinePoints'];
              //  console.log(p);
                for(let i=0;i<p.length ;i++){
                    let c = new cc.Vec2(p[i]['x'] + way['x'],p[i]['y'] + way['y']);
                    this.road.push(c)
                }

                let click_group = map.getObjectGroup("click");
                let click =  click_group.getObject("test");
                let clickarr  =click['points'];

                let collider:cc.PolygonCollider = this.node.getComponent(cc.PolygonCollider);
                
                for(let i=0 ;i < clickarr.length;i++)
                {
                    collider.points.push(new cc.Vec2(clickarr[i]['x'] + click['x'],clickarr[i]['y'] + click['y']));
                }
               

                this.createEnemy();
            });

        });
    }
    start(){
        //开启碰撞系统
        cc.director.getCollisionManager().enabled = true;

        let collider = this.node.getComponent(cc.PolygonCollider)

        collider.node.on(cc.Node.EventType.TOUCH_START,(touch:cc.Touch,event)=>{
            let touchLoc:cc.Vec2 = touch.getLocation();

            if(cc.Intersection.pointInPolygon(touchLoc,collider.world.points))
            {
                console.log("hit: ",touchLoc.x," ",touchLoc.y );
            }
            else
            {
                console.log("no hit");
            }
        });
    }

    createEnemy(){
        this.schedule(()=>{
            let enemy = cc.instantiate(this.enemyprefab);
            enemy.parent = this.node;

            this.enemyArr.push(enemy);

            let e:EnemyAction = enemy.getComponent("enemy-action")

            e.setRoad(this.road);
            e.startMove();

        },1,7,0);
    }


    //判断点在不在椭圆内 判断的点  椭圆a 长半轴,椭圆b 短半轴
    inEllipse(point:cc.Vec2,a:number,b:number):boolean
    {
        let point_x = Math.floor(point.x);
        let point_y = Math.floor(point.y);
        a = Math.ceil(a);
        b =Math.ceil(b);

        let siIn:boolean = point_x * point_x /(a * a) + point_y * point_y / (b * b) < 1
       
        return siIn;
    }

    update()
    {
        if(this.towerArr.length > 0)
        {
            for(let base of this.towerArr)
            {
                let tower:BaseCreate = base.getComponent("base-create");

                if(tower.choice_tower_id != 0)
                {
                    if(this.enemyArr.length > 0)
                    {
                        let count = this.enemyArr.length;
                        for(let enemy of this.enemyArr)
                        {
                            --count;
    
                            let circle = base.getChildByName("circle");
                            let size = circle.getContentSize();
                            let a = size.width * 0.5 ;
                            let b = size.height * 0.5 * 0.5;
            
                            let circlePoint = circle.getPosition();
                            circlePoint = circle.parent.convertToWorldSpaceAR(circlePoint);
            
                            let enemyPoint  = enemy.getPosition();
                            enemyPoint = enemy.parent.convertToWorldSpaceAR(enemyPoint);
            
                            enemyPoint.x -= circlePoint.x;
                            enemyPoint.y -= circlePoint.y;
                            
                            if(this.inEllipse(enemyPoint,a,b))
                            {
                                console.log("attack");
                                tower.towerAttackDir(enemyPoint,circlePoint);
                                break;
                            }
                        }
    
                        if(!count)
                        {
                            console.log("no attack");
                            tower.is_attack = false;
                        }
                    }
                }
            }
        }
       
    }
}
