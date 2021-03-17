// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Enemy from "./enemy-action"
import BaseCreate from "./base-create"
import BattelUi from "./Battel-ui"

const { ccclass, property } = cc._decorator;

interface mapCofig {
    lv: number;
    sprite_frame: string;
    map: string;
    nomal: Normal;
    hard: {
        money: number;
        gear: number;
        wave: number;
        lifes: number;
    }
}
interface Normal {
    money: number;
    gear: number;
    wave: number;
    lifes: number;
    waveconfig: WaveConfig[]
}
interface WaveConfig {
    waittime: number;
    total: number;
    type: number[];
    num: number[];
}

interface EnemyConfig {
    id: number;
    name: string;
    hp: number;
    att: number;
    speed: number;
    gear: number;
}
@ccclass
export default class LoadingBattel extends cc.Component {

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Prefab)
    enemyprefab: cc.Prefab = null;

    @property(cc.Node)
    lifes: cc.Node = null;
    //当前hp
     present_hp: number = 0;

    @property(cc.Node)
    gear: cc.Node = null;
    //当前齿轮
     present_gear: number = 0;

    @property(cc.Node)
    wave: cc.Node = null;
     //当前波次
      present_wave: number = 0;

    @property(cc.Node)
    touch: cc.Node = null;

    @property(cc.Prefab)
    fireball: cc.Prefab = null;

    @property(cc.Prefab)
    prop_potion: cc.Prefab = null;
    
    @property(cc.Prefab)
    prop_ice: cc.Prefab = null;

    @property(cc.Prefab)
    prop_holy: cc.Prefab = null;

    private road: cc.Vec2[] = [];

    private nextpoint: number = 0;

    private dir: cc.Vec2;

    private roadRect: cc.Object[] = [];

    private i: number = 0;


    //敌人
    private enemyArr: cc.Node[] = [];

    //塔
    private towerArr: cc.Node[] = [];

    //单个敌人创建间隔
    private single_time: number = 1;

    //是否开始下一波
    private is_begin_wave: boolean = true;

   

    //总波速
    private total_wave:number = 0;
    

    
    private enemy_z: number = 0;

    private enemy_total: number = 0;

    private wait_time: number = 0;

    private type: number;
    private num: number;

    //火球
    private fireball_1: cc.Node = null;

     speed:number = 1;

    onLoad() {
        // this.gear = cc.find("Canvas/icon_gear");
        // this.wave = cc.find("Canvas/icon_wave");
        // this.lifes = cc.find("Canvas/icon_lifes");
        
        this.node.on("updateMesseg",()=>{
            this.gear.getComponentInChildren(cc.Label).string = "" + this.present_gear;
            this.wave.getComponentInChildren(cc.Label).string =  `${this.present_wave} / ${this.total_wave}`;
            this.lifes.getComponentInChildren(cc.Label).string = "" + this.present_hp;
        });
    }
    start() {
        cc.resources.load("config/mapConfig", cc.JsonAsset, (err: Error, jsonAsset: cc.JsonAsset) => {
            err && console.log(err);
        let map: mapCofig[] = jsonAsset.json;
        let n: number = Number(localStorage.getItem("choice_lv"))
        let mapdata: mapCofig = map[n - 1];
        let u =map[n - 1].lv
        this.present_gear = mapdata.nomal.gear
        this.present_hp = mapdata.nomal.lifes;
        this.total_wave = mapdata.nomal.wave;

        this.gear.getComponentInChildren(cc.Label).string = "" + this.present_gear;
        this.wave.getComponentInChildren(cc.Label).string =  `${this.present_wave} / ${mapdata.nomal.wave}`;
        this.lifes.getComponentInChildren(cc.Label).string = "" + this.present_hp;


        cc.resources.load(`battelmap/map_${n}`, cc.TiledMapAsset, (err: Error, tiledmap: cc.TiledMapAsset) => {
            let map: cc.TiledMap = this.node.getChildByName('tiledmap').getComponent(cc.TiledMap);
            map.tmxAsset = null;
            map.tmxAsset = tiledmap;

            let mapGroup = map.getObjectGroup("base");
            let arr = mapGroup.getObjects();

            //塔的数量
            localStorage.setItem("tower_count", String(arr.length));
            for (let i = 0; i < arr.length; i++) {
                let value: cc.Object = arr[i];
                let bas = cc.instantiate(this.prefab);

                bas.x = value['x']// - this.node.getContentSize().width / 2;
                bas.y = value['y'];

                this.node.addChild(bas, 20);
                bas.name = String(i);

                this.towerArr.push(bas);
            }

            let wayGroup = map.getObjectGroup("way");
            let way = wayGroup.getObject("111")
            let p = way['polylinePoints'];
            //  console.log(p);
            for (let i = 0; i < p.length; i++) {
                let c = new cc.Vec2(p[i]['x'] + way['x'], p[i]['y'] + way['y']);
                this.road.push(c)
            }

            let click_group = map.getObjectGroup("click");
            let click = click_group.getObject("test");
            let clickarr = click['points'];

            let collider: cc.PolygonCollider = this.node.getComponent(cc.PolygonCollider);

            for (let i = 0; i < clickarr.length; i++) {
                collider.points.push(new cc.Vec2(clickarr[i]['x'] + click['x'], clickarr[i]['y'] + click['y']));
            }
        });

    });

        //开启碰撞系统
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        let collider = this.node.getComponent(cc.PolygonCollider)

        collider.node.on(cc.Node.EventType.TOUCH_START, (touch: cc.Touch, event) => {
            this.canelShowTower();
            let touchLoc: cc.Vec2 = touch.getLocation();
            console.log("hit: ", this.node.convertToNodeSpaceAR(touchLoc).x, " ", this.node.convertToNodeSpaceAR(touchLoc).y);
            if (cc.Intersection.pointInPolygon(touchLoc, collider.world.points)) {
                this.touch.setPosition(this.node.convertToNodeSpaceAR(touchLoc));
                this.touch.getComponent(cc.Animation).play();

                let battel: BattelUi = cc.find("Canvas").getComponent("Battel-ui");

                switch (battel.isCkilckSkill) {
                    case 1:
                        this.createFireBall(this.node.convertToNodeSpaceAR(touchLoc));
                        battel.onClickSkill1();
                        break;
                    case 2:

                        battel.onClickSkill2();
                        break;
                    default:
                        break;
                }

                switch(battel.choice_prop)
                {
                    case 0:

                        break;
                    case 1:
                        this.usePropPotion(this.node.convertToNodeSpaceAR(touchLoc))
                        battel.propSetScale();
                        break;
                    case 2:
                        this.usePropIce(this.node.convertToNodeSpaceAR(touchLoc));
                        battel.propSetScale();
                        break;
                    case 3:
                        this. usePropHoly(this.node.convertToNodeSpaceAR(touchLoc));
                        battel.propSetScale();
                        break;
                }

                console.log("hit: ", touchLoc.x, " ", touchLoc.y);
                
                //测试加速
                this.addSpeed();
                console.log("this.speed:",this.speed)
              
            }
            else {
                console.log("no hit");
            }
        });

    }

    //加速
    addSpeed()
    {
        if(this.speed == 1)
        {
            this.speed = 2;
        }
        else
        {
            this.speed = 1;
        }
    }
    //创建火球  技能一
    createFireBall(point: cc.Vec2) {
        this.fireball_1 = cc.instantiate(this.fireball);
        this.node.addChild(this.fireball_1, 20);
        this.fireball_1.setPosition(new cc.Vec2(point.x, point.y + 1000));
        this.fireball_1.getComponent(cc.Animation).play("fireball");

        let size = this.fireball_1.getContentSize();

        this.fireball_1.getComponent(cc.BoxCollider).enabled = false;
        // let delay = cc.delayTime(1)
        let callfunc_1 = cc.callFunc(() => {
            this.fireball_1.getComponent(cc.BoxCollider).enabled = true;
        });
        let callfunc_2 = cc.callFunc(() => {
            this.fireball_1.getComponent(cc.BoxCollider).enabled = false;
            this.fireball_1.destroy();
            this.fireball_1 = null;
        });
        let act_1 = cc.moveTo(1 * 1.0 / this.speed , new cc.Vec2(point.x, point.y + size.height / 4));
        let act_2 = cc.moveTo(1.0 / 1000 * size.height / 4 * 1.0 / this.speed, point)
        let seq = cc.sequence(act_1, callfunc_1, act_2, callfunc_2);

        this.fireball_1.runAction(seq);
    }


    //道具一  Potion  瓶子
    usePropPotion(point:cc.Vec2)
    {
        let potion = cc.instantiate(this.prop_potion);
        this.node.addChild(potion,10);
        potion.setPosition(point);
        potion.getComponentInChildren(cc.BoxCollider).enabled = false;

        let potion_anim = potion.getComponentInChildren(cc.Animation);
        potion_anim.play();
    }

    //道具二  ICE 冰
    usePropIce(point:cc.Vec2)
    {
        let ice = cc.instantiate(this.prop_ice);
        this.node.addChild(ice,10);
        ice.setPosition(new cc.Vec2(point.x, point.y + 1000));
        ice.getComponentInChildren(cc.BoxCollider).enabled = false;
        ice.getComponentInChildren(cc.Animation).play("prop_ice_move");

        console.log(ice.position.x," ",ice.position.y)
        let func = cc.callFunc(()=>
        {
            ice.getComponentInChildren(cc.Animation).play("prop_ice");
        });

        let seq = cc.sequence(cc.moveTo(1.0  * 1.0 / this.speed ,point),func);

        ice.runAction(seq);
    }
    //道具三  HoLY   激光
    usePropHoly(point:cc.Vec2)
    {
        let holy = cc.instantiate(this.prop_holy);
        this.node.addChild(holy,10);
        holy.setPosition(point);
        holy.getComponentInChildren(cc.BoxCollider).enabled = false;

        let holy_anim = holy.getComponentInChildren(cc.Animation);
        holy_anim.play();
    }

    // //火球消灭敌人
    // fireballWiepOut()
    // {
    //     if(this.fireball_1)
    //     {
    //         for(let i=0; i < this.enemyArr.length; i++)
    //         {
    //             let firePoint = this.fireball_1.getPosition();
    //             let enemyPoint = this.enemyArr[i].getPosition();

    //             let distance:number = cc.Vec2.distance(firePoint,enemyPoint);
    //             if(distance <= this.fireball_1.getContentSize().width * 0.5)
    //             {
    //                 let enemy:Enemy = this.enemyArr[i].getComponent("enemy-action");
    //                 enemy.islive =false;
    //             }
    //         }
    //     }
    // }

    //点击其它隐藏所有塔显示
    canelShowTower() {
        for (let i = 0; i < this.towerArr.length; i++) {
            this.towerArr[i].getChildByName("toggleContainer").active = false;
            this.towerArr[i].getChildByName("hint_panel").active = false;
            this.towerArr[i].getChildByName("show").active = false;
            this.towerArr[i].getChildByName("circle");
        }
    }


    //创建敌人
    createEnemy(type: number, num: number) {
        this.enemy_z = 10;
        this.schedule(() => {
            cc.resources.load("config/enemyConfig", cc.JsonAsset, (err: Error, jsonAsset: cc.JsonAsset) => {
                let enemyjson: EnemyConfig[] = jsonAsset.json;
                console.log("naem:", enemyjson[type].name);
                cc.resources.load(`prefab/${enemyjson[type].name}`, cc.Prefab, (err: Error, prefab: cc.Prefab) => {

                    let enemy = cc.instantiate(prefab);
                    this.node.addChild(enemy)

                    if (this.enemy_z < 0) {
                        this.enemy_z = 0;
                    }
                    else {
                        this.enemy_z--;
                    }
                    enemy.zIndex = this.enemy_z;

                    this.enemyArr.push(enemy);

                    let e: Enemy = enemy.getComponent("enemy-action")
                    e.setValue(enemyjson[type].hp,enemyjson[type].speed,enemyjson[type].gear,enemyjson[type].att);
                    e.setRoad(this.road);
                    e.startMove();
                });
            });
        }, this.single_time * 1.0 / this.speed, num - 1, 0);
    }

    //判断点在不在椭圆内 判断的点  椭圆a 长半轴,椭圆b 短半轴
    inEllipse(point: cc.Vec2, a: number, b: number): boolean {
        let point_x = Math.floor(point.x);
        let point_y = Math.floor(point.y);
        a = Math.ceil(a);
        b = Math.ceil(b);

        let siIn: boolean = point_x * point_x / (a * a) + point_y * point_y / (b * b) < 1

        return siIn;
    }

    //波次等待时间
    waveWaitTime() {

    }

    //加载每波敌人
    waveEnemy() {
        cc.resources.load("config/mapConfig", cc.JsonAsset, (err: Error, jsonAsset: cc.JsonAsset) => {
            let map: mapCofig[] = jsonAsset.json;
            let n: number = Number(localStorage.getItem("choice_lv"))
            let mapdata: mapCofig = map[n - 1];

            let wavedata: WaveConfig = mapdata.nomal.waveconfig[this.present_wave];

            let time = 0;
            for (let i = 0; i < wavedata.type.length; i++) {
                time += wavedata.num[i];
            }
            //  console.log("time",time)
            // this.scheduleOnce(() => {
            //     // this.is_begin_wave = true;
            //     this.present_wave++;
            // }, time * this.single_time);

            for (let i = 0; i < wavedata.type.length; i++) {
                let time: number = 0;

                if (i == 0) {
                    time = 0;
                }
                else {
                    for (let j = 0; j < i; j++) {
                        time += this.single_time * wavedata.num[j];
                    }
                }
                this.scheduleOnce(() => {
                    this.createEnemy(i, wavedata.num[i]);
                }, time * 1.0 / this.speed);
            }
        });
    }


    update() {
        //  this.fireballWiepOut();
        if (this.is_begin_wave) {
            this.waveEnemy();
            this.is_begin_wave = false;
        }

        let count: number = 0;

        for (let i = 0; i < this.enemyArr.length; i++) {
            if (this.enemyArr[i].active) {
                break;
            }
            else {
                count++;
            }
        }
        if (count == this.enemyArr.length && this.enemyArr.length) {
            let num = this.enemyArr.length
            for (let i = 0; i < num; i++) {
                this.enemyArr.pop().destroy();
            }
            console.log("arr: ",this.enemyArr.length);
            this.present_wave++;
            this.wave.getComponentInChildren(cc.Label).string =  `${this.present_wave} / ${this.total_wave}`;

            this.is_begin_wave = true;
        }


        if (this.towerArr.length > 0) {
            for (let j = 0; j < this.towerArr.length; j++) {
                let tower: BaseCreate = this.towerArr[j].getComponent("base-create");

                if (tower.choice_tower_id != 0) {
                    if (this.enemyArr.length > 0) {
                        for (let i = 0; i < this.enemyArr.length; i++) {
                            let temp:Enemy = this.enemyArr[i].getComponent("enemy-action");
                            if (temp.islive) {
                                let circle = this.towerArr[j].getChildByName("circle");
                                let size = circle.getContentSize();
                                let a = size.width * 0.5;
                                let b = size.height * 0.5 * 0.5;

                                let circlePoint = circle.getPosition();
                                circlePoint = circle.parent.convertToWorldSpaceAR(circlePoint);

                                let enemyPoint = this.enemyArr[i].getPosition();
                                enemyPoint = this.enemyArr[i].parent.convertToWorldSpaceAR(enemyPoint);

                                enemyPoint.x -= circlePoint.x;
                                enemyPoint.y -= circlePoint.y;

                                if (this.inEllipse(enemyPoint, a, b)) {
                                    tower.enemy = this.enemyArr[i];
                                    tower.towerAttackDir(enemyPoint, circlePoint);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

    }
}
