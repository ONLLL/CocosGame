// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Enemy from "./enemy-action"
import BaseCreate from "./base-create"
import BattelUi from "./Battel-ui"
import { MapMessege, LocalTowerMessege } from "./GameData";
import SkillRole from "./skill_role";
import Hero from "./hero"

const { ccclass, property } = cc._decorator;

export interface mapCofig {
    lv: number;
    sprite_frame: string;
    map: string;
    nomal: Normal;
    hard: {
        money: number;
        gear: number;
        wave: number;
        lifes: number;
        waveconfig: WaveConfig[]
    }
}
export interface Normal {
    money: number;
    gear: number;
    wave: number;
    lifes: number;
    waveconfig: WaveConfig[]
}
export interface WaveConfig {
    waittime: number;
    total: number;
    type: number[];
    num: number[];
}

export interface EnemyConfig {
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

    // @property(cc.Prefab)
    // enemyprefab: cc.Prefab = null;

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
    touch_circle: cc.Node = null;

    @property(cc.Prefab)
    fireball: cc.Prefab = null;

    @property(cc.Prefab)
    prop_potion: cc.Prefab = null;

    @property(cc.Prefab)
    prop_ice: cc.Prefab = null;

    @property(cc.Prefab)
    prop_holy: cc.Prefab = null;

    @property(cc.Prefab)
    birth_prefab: cc.Prefab = null;

    birth: cc.Node = null;

    @property(cc.Prefab)
    home: cc.Prefab = null;
    //路径
    private road: cc.Vec2[] = [];

    private nextpoint: number = 0;

    private dir: cc.Vec2;

    private roadRect: cc.Object[] = [];

    private i: number = 0;


    //敌人
     enemyArr: cc.Node[] = [];

    //塔
    private towerArr: cc.Node[] = [];

    //单个敌人创建间隔
    private single_time: number = 1;

    //是否开始下一波
    private is_begin_wave: boolean = false;



    //总波速
    private total_wave: number = 0;



    private enemy_z: number = 0;

    private enemy_total: number = 0;

    private wait_time: number = 0;
    clock: number = 0;

    private type: number;
    private num: number;

    //通过奖励
    money: number = 0;
    //火球
    private fireball_1: cc.Node = null;

    speed: number = 1;

    game_over: boolean = false;

    @property(cc.Node)
    gameover_delet: cc.Node = null;

    @property(cc.Node)
    gameover_victory: cc.Node = null;

    @property(cc.Node)
    mask: cc.Node = null;


    //加载资源数量
    loading_num: number = 0;

    enemyjson: EnemyConfig[] = [];

    map: mapCofig[] = [];

    @property(cc.Node)
    hero:cc.Node = null;

    
    @property(cc.Node)
    hero_icon:cc.Node = null;

    hero_ismove:boolean = false;

    @property(cc.Node)
    skill_role:cc.Node = null;

    @property(cc.Node)
    gold:cc.Node  =null;

    @property(cc.Node)
    star:cc.Node  =null;

    @property(cc.AudioClip)
    ice_audioclip:cc.AudioClip = null;

    @property(cc.AudioClip)
    potion_audioclip:cc.AudioClip = null;

    @property(cc.AudioClip)
    holy_audioclip:cc.AudioClip = null;

    @property(cc.AudioClip)
    firball_audioclip:cc.AudioClip = null;

    onLoad() {
        // this.gear = cc.find("Canvas/icon_gear");
        // this.wave = cc.find("Canvas/icon_wave");
        // this.lifes = cc.find("Canvas/icon_lifes");

        this.node.on("updateMesseg", () => {
            this.gear.getComponentInChildren(cc.Label).string = "" + this.present_gear;
            this.wave.getComponentInChildren(cc.Label).string = `${this.present_wave} / ${this.total_wave}`;
            this.lifes.getComponentInChildren(cc.Label).string = "" + this.present_hp;
        });
    }
    start() {
        this.loadingAll();

        //开启碰撞系统
        cc.director.getCollisionManager().enabled = true;
    //    cc.director.getCollisionManager().enabledDebugDraw = true;
        let collider = this.node.getComponent(cc.PolygonCollider)

        collider.node.on(cc.Node.EventType.TOUCH_START, (touch: cc.Touch, event) => {
            this.canelShowTower();
            let touchLoc: cc.Vec2 = touch.getLocation();
            // console.log("hit: ", this.node.convertToNodeSpaceAR(touchLoc).x, " ", this.node.convertToNodeSpaceAR(touchLoc).y);
            if (cc.Intersection.pointInPolygon(touchLoc, collider.world.points)) {
               
                this.touch_circle.setPosition(this.node.convertToNodeSpaceAR(touchLoc));
                this.touch_circle.getComponent(cc.Animation).play("touch");

                let battel: BattelUi = cc.find("Canvas").getComponent("Battel-ui");

                switch (battel.isCkilckSkill) {
                    case 1:
                        this.createFireBall(this.node.convertToNodeSpaceAR(touchLoc));
                        battel.onClickSkill1();
                        battel.skill1_enble_use = false;
                        battel.skillState();
                        break;
                    case 2:
                        this.createCat(this.node.convertToNodeSpaceAR(touchLoc));
                        battel.onClickSkill2();
                        battel.skill2_enble_use = false;
                        battel.skillState();
                        break;
                    default:
                        this.hero_ismove = true;
                        break;
                }

                switch (battel.choice_prop) {
                    case 0:

                        break;
                    case 1:
                        if(Number(localStorage.getItem("prop_potion")) > 0)
                        {
                            localStorage.setItem("prop_potion", String(Number(localStorage.getItem("prop_potion")) - 1));
                            this.node.dispatchEvent(new cc.Event.EventCustom("box_update", true));
    
                            this.usePropPotion(this.node.convertToNodeSpaceAR(touchLoc))
                            battel.propSetScale();
                        }
                       
                        break;
                    case 2:
                        if(Number(localStorage.getItem("prop_ice")) > 0)
                        {
                            localStorage.setItem("prop_ice", String(Number(localStorage.getItem("prop_ice")) - 1));
                            this.node.dispatchEvent(new cc.Event.EventCustom("box_update", true));
    
                            this.usePropIce(this.node.convertToNodeSpaceAR(touchLoc));
                            battel.propSetScale();
                        }
                       
                        break;
                    case 3:
                        if(Number(localStorage.getItem("prop_holy")) > 0)
                        {
                            localStorage.setItem("prop_holy", String(Number(localStorage.getItem("prop_holy")) - 1));
                            this.node.dispatchEvent(new cc.Event.EventCustom("box_update", true));
    
                            this.usePropHoly(this.node.convertToNodeSpaceAR(touchLoc));
                            battel.propSetScale();
                        }
                        
                        break;
                    default:
                        this.hero_ismove = true;
                        break;
                }

                //let hero:Hero = this.hero.getComponentInChildren("hero"); 
                //console.log("tset:",hero.test(this.node.convertToNodeSpaceAR(touchLoc)));

               // let hero:Hero = this.hero.getComponentInChildren("hero"); 
               // hero.target_point = this.node.convertToNodeSpaceAR(touchLoc); 
               // console.log(`pos: ${hero.findPos()}, target: ${hero.target_point}`);

              
                if(this.hero_ismove && this.hero_icon.getComponent(cc.Toggle).isChecked)
                {
                    this.hero_ismove = false;
                    let hero:Hero = this.hero.getComponentInChildren("hero"); 
                    if(!hero.is_move)
                    {
                        hero.target_point = this.node.convertToNodeSpaceAR(touchLoc);   
                        //hero.targetMove(this.node.convertToNodeSpaceAR(touchLoc))  
                        hero.targetRoad();                   
                        hero.startMove();
                    }
                    
                }

      //          console.log("hit: ", touchLoc.x, " ", touchLoc.y);

                //测试加速
                //   this.addSpeed();
    //            console.log("this.speed:", this.speed)

            }
            else {
   //             console.log("no hit");
            }
        });


        this.node.on("create_enemy", () => {
//            console.log("on")
          
                this.birth.active = false;
           
            this.birth.getChildByName("wave_direction3").getComponent(cc.Sprite).fillRange = 0;
            this.schedule(this.birthPressBar, 0.5, cc.macro.REPEAT_FOREVER, 0);
            this.clock = this.wait_time;
        })

        //  this.schedule(this.birthPressBar,1.0 / this.wait_time,5,0);
    }

    //加载所有资源
    loadingAll() {
        //地图信息
        cc.resources.load("config/mapConfig", cc.JsonAsset, (err: Error, jsonAsset: cc.JsonAsset) => {
   //         err && console.log(err);
            this.map = jsonAsset.json;
            let n: number = Number(localStorage.getItem("choice_lv"))
  //          console.log("n:", n)
            let mapdata: mapCofig = this.map[n - 1];
            let u = this.map[n - 1].lv
            this.present_gear = mapdata.nomal.gear
            this.present_hp = mapdata.nomal.lifes;
            this.total_wave = mapdata.nomal.wave;
            this.money = mapdata.nomal.money;
            this.wait_time = mapdata.nomal.waveconfig[0].waittime;

            this.gear.getComponentInChildren(cc.Label).string = "" + this.present_gear;
            this.wave.getComponentInChildren(cc.Label).string = `${this.present_wave} / ${mapdata.nomal.wave}`;
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

                let birth = map.getObjectGroup("birth");
                let birth_point = birth.getObject("point");

                this.birth = cc.instantiate(this.birth_prefab);
                this.node.addChild(this.birth, 20);
                this.birth.setPosition(birth_point['x'], birth_point['y']);
                this.birth.getComponent(cc.Animation).play();

                let wayGroup = map.getObjectGroup("way");
                let way = wayGroup.getObject("111")
                let p = way['polylinePoints'];
                //  console.log(p);
                for (let i = 0; i < p.length; i++) {
                    let c = new cc.Vec2(p[i]['x'] + way['x'], p[i]['y'] + way['y']);
                    this.road.push(c)
                }

                this.setHero(this.road);

                let click_group = map.getObjectGroup("click");
                let click = click_group.getObject("test");
                let clickarr = click['points'];

                let collider: cc.PolygonCollider = this.node.getComponent(cc.PolygonCollider);

                for (let i = 0; i < clickarr.length; i++) {
                    collider.points.push(new cc.Vec2(clickarr[i]['x'] + click['x'], clickarr[i]['y'] + click['y']));
                }
                //加载完成
                this.node.dispatchEvent(new cc.Event.EventCustom("loading_finished", true));
            });

             //加载完成
             this.node.dispatchEvent(new cc.Event.EventCustom("loading_finished",true));
        });

        //敌人信息
        cc.resources.load("config/enemyConfig", cc.JsonAsset, (err: Error, jsonAsset: cc.JsonAsset) => {
            this.enemyjson = jsonAsset.json;

             //加载完成
             this.node.dispatchEvent(new cc.Event.EventCustom("loading_finished",true));
        });

    }

    //设置角色
    setHero(road:cc.Vec2[])
    {
        let hero:Hero = this.hero.getComponentInChildren("hero");
        hero.setRoad(road);
        this.hero.zIndex = 20;
    }
    
    onClickHeroIcon()
    {
        this.hero.getChildByName("halo").active= !this.hero.getChildByName("halo").active;
    }
    //出生点进度
    birthPressBar(dt) {
   
        if(this.present_wave == this.total_wave)
        {
            this.unschedule(this.birthPressBar);
            this.birth.active = false;
            return;
        }
        
        // let n = 1.0 / this.wait_time;
        this.clock += dt;
        this.birth.getChildByName("wave_direction3").getComponent(cc.Sprite).fillRange += dt / this.wait_time;

        if (this.clock >= this.wait_time) {
            this.birth.active = false;
            this.clock = 0;
            this.waveEnemy();
            this.birth.getChildByName("wave_direction3").getComponent(cc.Sprite).fillRange = 0;
            // this.unschedule(this.birthPressBar);
        }
        else if (this.clock >= this.wait_time / 2) {
            this.birth.active = true;
        }
    }
    //加速
    addSpeed() {
        if (this.speed == 1) {
            this.speed = 2;
        }
        else {
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
        let act_1 = cc.moveTo(1 * 1.0 / this.speed, new cc.Vec2(point.x, point.y + size.height / 4));
        let act_2 = cc.moveTo(1.0 / 1000 * size.height / 4 * 1.0 / this.speed, point)
        let seq = cc.sequence(act_1, callfunc_1, act_2, callfunc_2);

        this.fireball_1.runAction(seq);
    }

    //猫消失
    CatFalse(dt)
    {
        this.skill_role.active = false;
    }
    //创建猫  技能二
    createCat(point: cc.Vec2)
    {
        this.unschedule(this.CatFalse);
        this.skill_role.active = true;
        let role:SkillRole = this.skill_role.getComponentInChildren("skill_role");
        role.initRole();
        this.skill_role.zIndex = 25;
        this.skill_role.setPosition(point);
       
        this.scheduleOnce(this.CatFalse,20);
    }
    //道具一  Potion  瓶子
    usePropPotion(point: cc.Vec2) {
        let potion = cc.instantiate(this.prop_potion);
        this.node.addChild(potion, 10);
        potion.setPosition(point);
        potion.getComponentInChildren(cc.BoxCollider).enabled = false;

        let potion_anim = potion.getComponentInChildren(cc.Animation);
        potion_anim.play();
    }

    //道具二  ICE 冰
    usePropIce(point: cc.Vec2) {
        let ice = cc.instantiate(this.prop_ice);
        this.node.addChild(ice, 10);
        ice.setPosition(new cc.Vec2(point.x, point.y + 1000));
        ice.getComponentInChildren(cc.BoxCollider).enabled = false;
        ice.getComponentInChildren(cc.Animation).play("prop_ice_move");

        cc.audioEngine.playEffect(this.ice_audioclip,false)
 //       console.log(ice.position.x, " ", ice.position.y)
        let func = cc.callFunc(() => {
            ice.getComponentInChildren(cc.Animation).play("prop_ice");
        });

        let seq = cc.sequence(cc.moveTo(1.0 * 1.0 / this.speed, point), func);

        ice.runAction(seq);
    }
    //道具三  HoLY   激光
    usePropHoly(point: cc.Vec2) {
        let holy = cc.instantiate(this.prop_holy);
        this.node.addChild(holy, 10);
        holy.setPosition(point);
        holy.getComponentInChildren(cc.BoxCollider).enabled = false;

        let holy_anim = holy.getComponentInChildren(cc.Animation);
        holy_anim.play();
    }


    //点击其它隐藏所有塔显示
    canelShowTower() {
        for (let i = 0; i < this.towerArr.length; i++) {
            this.towerArr[i].getChildByName("toggleContainer").active = false;
            let tower =  this.towerArr[i].getChildByName("toggleContainer").children;
            for(let i=0;i<tower.length;i++)
            {
                tower[i].getComponent(cc.Toggle).isChecked = false;
            }

            this.towerArr[i].getChildByName("hint_panel").active = false;
            this.towerArr[i].getChildByName("show").active = false;
            this.towerArr[i].getChildByName("circle").active = false;
        }
    }


    //创建敌人
    createEnemy(type: number, num: number) {
        this.enemy_z = 10;
        this.schedule(() => {
            //   cc.resources.load("config/enemyConfig", cc.JsonAsset, (err: Error, jsonAsset: cc.JsonAsset) => {
            //     let enemyjson: EnemyConfig[] = jsonAsset.json;
            //console.log("naem:", enemyjson[type].name);
            cc.resources.load(`prefab/${this.enemyjson[type].name}`, cc.Prefab, (err: Error, prefab: cc.Prefab) => {

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

                let e: Enemy = enemy.getComponentInChildren("enemy-action")
                e.setValue(this.enemyjson[type].hp, this.enemyjson[type].speed, this.enemyjson[type].gear, this.enemyjson[type].att);
                e.setRoad(this.road);
                e.startMove();
            });
            // });
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
    waveWaitTime(dt) {
        if (this.present_wave == this.total_wave)
        {
            this.unschedule(this.waveWaitTime);
        }
        this.waveEnemy();
        this.is_begin_wave = true;

       
    }

    //加载每波敌人
    waveEnemy() {
        //cc.resources.load("config/mapConfig", cc.JsonAsset, (err: Error, jsonAsset: cc.JsonAsset) => {
        this.map
        let n: number = Number(localStorage.getItem("choice_lv"))
        let mapdata: mapCofig = this.map[n - 1];

        if(this.present_wave == this.total_wave)
        {
            this.unschedule(this.birthPressBar);
            this.birth.active = false;
            return;
        }
        
        let wavedata: WaveConfig = mapdata.nomal.waveconfig[this.present_wave];

        this.present_wave++;
        this.wave.getComponentInChildren(cc.Label).string = `${this.present_wave} / ${this.total_wave}`;
       
        
        let time = 0;
        for (let i = 0; i < wavedata.type.length; i++) {
            time += wavedata.num[i];
        }


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

       
        // });
    }

    //技能二role 攻击敌人
    skillRoleAtt()
    {
            if (this.enemyArr.length > 0 && this.skill_role.active) {
                for (let i = 0; i < this.enemyArr.length; i++) {
                    let enemy: Enemy = this.enemyArr[i].getComponentInChildren("enemy-action");

                    if (enemy.islive) 
                    {

                        let role_rect = this.skill_role.getChildByName("rang").getBoundingBox();
                        role_rect.origin = this.skill_role.convertToWorldSpaceAR(role_rect.origin);
                       

                        let enemy_rect = this.enemyArr[i].getChildByName("enemy").getBoundingBox();
                        enemy_rect.origin = this.enemyArr[i].convertToWorldSpaceAR(enemy_rect.origin);
                        
                        let crash:boolean = role_rect.intersects(enemy_rect);

                        if(crash)
                        {
   //                         console.log("rang");

                            let role:SkillRole = this.skill_role.getChildByName("role").getComponent("skill_role");
    //                        console.log(role);
                            role.attackEnemy(this.enemyArr[i]);
                            break;
                        }
                    }
                }
            }
        
    }

    heroAtt()
    {
        if (this.enemyArr.length > 0 && this.hero.active) {
            for (let i = 0; i < this.enemyArr.length; i++) {
                let enemy: Enemy = this.enemyArr[i].getComponentInChildren("enemy-action");

                if (enemy.islive) 
                {
                   
                    let hero_rect = this.hero.getChildByName("hero").getBoundingBox();

                    hero_rect.origin = this.hero.convertToWorldSpaceAR(hero_rect.origin);
                   
                    let enemy_rect = this.enemyArr[i].getChildByName("enemy").getBoundingBox();
                    enemy_rect.origin = this.enemyArr[i].convertToWorldSpaceAR(enemy_rect.origin);
                    
                    let crash:boolean = hero_rect.intersects(enemy_rect);

                    if(crash)
                    {
     //                   console.log("rang");

                        let hero:Hero = this.hero.getComponentInChildren("hero");
                      
                        hero.attack(this.enemyArr[i]);
                        break;
                    }
                    else
                    {
                        enemy.is_crash = false;
                    }
                }
            }
        }
    }

    update() {
        if (this.game_over) {

            if (this.present_hp <= 0) {
                this.game_over = false;
                this.unscheduleAllCallbacks();
                this.scheduleOnce(() => {
                    this.mask.active = true;
                    this.gameover_delet.active = true;
                }, 3);
            }
            return;
        }

        
        this.skillRoleAtt();

        this. heroAtt();
        //  this.fireballWiepOut();
        // if (this.is_begin_wave) {
        //     this.schedule(this.birthPressBar,1.0 / this.wait_time,-1,0);
        //     this.is_begin_wave = false;
        // }

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

            //进度条出现
            this.birth.active = true;
            //this.birth.getChildByName("wave_direction3").getComponent(cc.Sprite).fillRange = 0;

            //游戏结束  更改游戏数据
            if (this.present_wave == this.total_wave) {
                this.game_over = true;
                let star_num = Number(localStorage.getItem("star"));
                let gold_num = Number(localStorage.getItem("gold"));

                let map: MapMessege[] = [];

                map = JSON.parse(localStorage.getItem("map_messege"));

                let local_tower:LocalTowerMessege[] = [];
                local_tower = JSON.parse(localStorage.getItem("tower_messege"));
    
                switch(Number(localStorage.getItem("choice_lv")))
                {
                    case 1:
                        local_tower[2].unlock = true;
                        break;
                    case 2:
                        local_tower[3].unlock = true;
                        break;
                    case 3:
                        local_tower[4].unlock = true;
                        break;
                    case 4:
                        local_tower[5].unlock = true;
                        break;
                    default:
                        break;
                }
                
                localStorage.setItem("tower_messege",JSON.stringify(local_tower));

                gold_num += this.money;

                let star_lv: number = 0;

                if (this.present_hp == 20) {
                    star_lv = 3;
                    switch (map[Number(localStorage.getItem("choice_lv")) - 1].normal_star) {
                        case 0:
                            star_num += 3;
                            break;
                        case 1:
                            star_num += 2;
                            break;
                        case 2:
                            star_num += 1;
                            break;
                        case 3:
                            star_num += 0;
                            break;
                        default:
                            break;
                    }

                    map[Number(localStorage.getItem("choice_lv")) - 1].normal_star = 3;
                    map[Number(localStorage.getItem("choice_lv")) - 1].is_finish = true;
                }
                else if (this.present_hp >= 10) {
                    star_lv = 2;
                    switch (map[Number(localStorage.getItem("choice_lv")) - 1].normal_star) {
                        case 0:
                            star_num += 2;
                            break;
                        case 1:
                            star_num += 1;
                            break;
                        case 2:
                            star_num += 0;
                            break;
                        case 3:
                            star_num += 0;
                            break;
                        default:
                            break;
                    }

                    map[Number(localStorage.getItem("choice_lv")) - 1].normal_star = 2;
                    map[Number(localStorage.getItem("choice_lv")) - 1].is_finish = true;
                }
                else {
                    star_lv = 1;
                    switch (map[Number(localStorage.getItem("choice_lv")) - 1].normal_star) {
                        case 0:
                            star_num += 1;
                            break;
                        case 1:
                            star_num += 0;
                            break;
                        case 2:
                            star_num += 0;
                            break;
                        case 3:
                            star_num += 0;
                            break;
                        default:
                            break;
                    }
                    map[Number(localStorage.getItem("choice_lv")) - 1].normal_star = 1;
                    map[Number(localStorage.getItem("choice_lv")) - 1].is_finish = true;
                }

                //存储数据
                localStorage.setItem("gold", String(gold_num));
                localStorage.setItem("star", String(star_num));
                localStorage.setItem("map_messege", JSON.stringify(map));
                localStorage.setItem("max_maplv", String(Number(localStorage.getItem("max_maplv")) + 1));

                
        this.gold.getComponentInChildren(cc.Label).string = "" + gold_num;

        this.star.getComponentInChildren(cc.Label).string =  "" + star_num;

        this.gold.active = true;

        this.star.active = true;

                this.unscheduleAllCallbacks();
                this.scheduleOnce(() => {
                    this.mask.active = true;
                    this.gameover_victory.active = true;
                    this.gameover_victory.getChildByName("gold").getComponentInChildren(cc.Label).string = "x " + this.money;
                    this.gameover_victory.getChildByName(`star_${star_lv}`).active = true;
                }, 3);

            }
        }


        if (this.towerArr.length > 0) {
            for (let j = 0; j < this.towerArr.length; j++) {
                let tower: BaseCreate = this.towerArr[j].getComponent("base-create");

                if (tower.choice_tower_id != 0) {
                    if (this.enemyArr.length > 0) {
                        for (let i = 0; i < this.enemyArr.length; i++) {
                            let temp: Enemy = this.enemyArr[i].getComponentInChildren("enemy-action");
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
