import Enemy from "./enemy-action";
import LoadingBattel from "./loadingBattel"
import {MapMessege,LocalTowerMessege} from "./GameData";

const { ccclass, property } = cc._decorator;

interface TowerConfig {
    id: number;
    name: string;
    icon: string;
    menu_selectable: string;
    menu_noselectable: string;
    describe: string;
    config: Tower[];
}
interface Tower {
    atlas: string;
    sprite_frame: string;
    lv: number;
    upgrand_price: number;
    lv_price: number;
    att: number; 1
    rang: number;
    speed: number;
}


enum towerDir{
    none,
    left_down,
    right_down,
    left_up,
    right_up
}


@ccclass
export default class BaseCreate extends cc.Component {

    @property(cc.Node)
    lifes:cc.Node = null;

    @property(cc.Node)
    gold:cc.Node =null;

    @property(cc.Node)
    wave:cc.Node = null;

    toggleContainer: cc.Node = null;

    menu1: cc.Node = null;
     menu2: cc.Node = null;
     menu3: cc.Node = null;
     menu4: cc.Node = null;
     menu5: cc.Node = null;
     menu6: cc.Node = null;
     choice_tower: cc.Node = null;
     land: cc.Node = null;
     hint: cc.Node = null;

     show: cc.Node = null;

     circle:cc.Node = null;

     towerConfig: TowerConfig[] = [];
     tower_lv: number = 0;

     choice_tower_id: number = 0;


     gold_count: number = 3740;
     lifes_count:number;
     wave_count:number ;

     anim:cc.Animation = null;

    //是否攻击
     is_attack:Boolean = false;

    //当前基地
     base_now:number;

    //左下攻击
     anim_LD:string = null;
    //右下攻击
     anim_RD:string = null;
    //左上攻击
     anim_LU:string = null;
    //右上攻击
     anim_RU:string = null;

     tower_dir:towerDir = towerDir.none;
     anim_name:string = null;

     att:number =0;
     speed: number = 0;
     rang:number =0;
    //敌人
     enemy:cc.Node = null;

    //加速倍速
     mutiple:number = 1;
    //原速
    self_speed:number = 0;

    //塔信息
    tower_messege:LocalTowerMessege[] = [];

    battel_message:LoadingBattel = null;

    //是否可以升级
    isUpgrade:boolean = false;

    //是否升过级
    is_Upgraded:boolean = false;

    //升级价格
    upgrade_price:number = 0;

    //建塔音效
    create_sound:cc.AudioClip = null;

    //拆塔音效
    delete_sound:cc.AudioClip = null;

    //攻击音效
    att_sound:cc.AudioClip = null;

    //范围
    circle_rang:number = 900;

    onLoad() {
        this.tower_messege = JSON.parse(localStorage.getItem("tower_messege"));

        this.battel_message = this.node.parent.getComponent("loadingBattel");

        this.toggleContainer = this.node.getChildByName('toggleContainer');
      
        this.menu1 = this.toggleContainer.getChildByName('menu1');
        this.menu2 = this.toggleContainer.getChildByName('menu2');
        this.menu3 = this.toggleContainer.getChildByName('menu3');
        this.menu4 = this.toggleContainer.getChildByName('menu4');
        this.menu5 = this.toggleContainer.getChildByName('menu5');
        this.menu6 = this.toggleContainer.getChildByName('menu6');

        this.land = this.node.getChildByName('land');
        this.hint = this.node.getChildByName('hint_panel');
        this.choice_tower = this.node.getChildByName('tower');
        this.show = this.node.getChildByName('show');
        this.circle = this.node.getChildByName('circle');

        this.anim = this.choice_tower.getComponent(cc.Animation);
       
    
    }
    start() {
        //加载建塔音效
        cc.resources.load("audio/sound_ogg/Building",cc.AudioClip,(err:Error,audioClip:cc.AudioClip)=>
        {
            this.create_sound = audioClip;

             //加载完成
             this.node.dispatchEvent(new cc.Event.EventCustom("loading_finished",true));
        });
        //加载拆塔音效
        cc.resources.load("audio/sound_ogg/Clearing",cc.AudioClip,(err:Error,audioClip:cc.AudioClip)=>
        {
            this.delete_sound = audioClip;

             //加载完成
             this.node.dispatchEvent(new cc.Event.EventCustom("loading_finished",true));
        });

        //加载塔配置
        cc.resources.load("config/towerConfig", cc.JsonAsset, (err, jsonAsset: cc.JsonAsset) => {

            this.towerConfig = jsonAsset.json;
        
            let menu1_price: cc.Label = this.menu1.getComponentInChildren(cc.Label);
            menu1_price.string = "" + this.towerConfig[0].config[0].upgrand_price;
    
           let menu2_price: cc.Label = this.menu2.getComponentInChildren(cc.Label);
           menu2_price.string = "" + this.towerConfig[1].config[0].upgrand_price;
    
           let menu3_price: cc.Label = this.menu3.getComponentInChildren(cc.Label);
           menu3_price.string = "" + this.towerConfig[2].config[0].upgrand_price;
    
           let menu4_price: cc.Label = this.menu4.getComponentInChildren(cc.Label);
           menu4_price.string = "" + this.towerConfig[3].config[0].upgrand_price;
    
           let menu5_price: cc.Label = this.menu5.getComponentInChildren(cc.Label);
           menu5_price.string = "" + this.towerConfig[4].config[0].upgrand_price;
    
           let menu6_price: cc.Label = this.menu6.getComponentInChildren(cc.Label);
           menu6_price.string = "" + this.towerConfig[5].config[0].upgrand_price;

            //加载完成
            this.node.dispatchEvent(new cc.Event.EventCustom("loading_finished",true));
        });

        //加载地图配置
        cc.resources.load("config/mapConfig",cc.JsonAsset,(err:Error,jsonAsset:cc.JsonAsset)=>{
            let map = jsonAsset.json;
            //this.lifes_count = map[]
            
             //加载完成
             this.node.dispatchEvent(new cc.Event.EventCustom("loading_finished",true));
        });
    }

    loadShow()
    {
        this.show.active = true;
        this.show.getChildByName('upgrand').getComponentInChildren(cc.Label).string = String(this.upgrade_price);
        this.show.getChildByName('delete').getComponentInChildren(cc.Label).string = String(Math.floor(this.upgrade_price*0.8));
    }

    //是否解锁塔
    unlockTower()
    {
        let gear = this.battel_message.present_gear;
        
        if(!this.tower_messege[0].unlock)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu1.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu1.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[0].config[0].upgrand_price > gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_minigun2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu1.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu1.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[0].config[0].upgrand_price <= gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_minigun1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu1.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu1.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

        if(!this.tower_messege[1].unlock)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu2.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu2.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[1].config[0].upgrand_price > gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_icegun2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu2.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu2.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[1].config[0].upgrand_price <= gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_icegun1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu2.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu2.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

        if(!this.tower_messege[2].unlock)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu3.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu3.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[2].config[0].upgrand_price > gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_teslagun2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu3.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu3.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[2].config[0].upgrand_price <= gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_teslagun1-0ld",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu3.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu3.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

        if(!this.tower_messege[3].unlock)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu4.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu4.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[3].config[0].upgrand_price > gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_roketgun2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu4.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu4.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[3].config[0].upgrand_price <= gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_roketgun1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu4.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu4.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

        if(!this.tower_messege[4].unlock)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu5.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu5.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[4].config[0].upgrand_price > gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_firegun2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu5.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu5.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[4].config[0].upgrand_price <= gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_firegun1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu5.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu5.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

        if(!this.tower_messege[5].unlock)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu6.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu6.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[5].config[0].upgrand_price > gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_laser2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu6.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu6.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(this.towerConfig[5].config[0].upgrand_price <= gear)
        {
            cc.resources.load("images/gamescene/menucreatetower/menu_laser1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu6.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.menu6.getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

    }
    //点击基地
    onClickLand() {
        this.unlockTower();
        let count = Number(localStorage.getItem("tower_count"));
        this.node.zIndex = 20;
        for(let i=0; i < count; i++)
        {
            let tower_other =  this.node.parent.getChildByName(String(i))
           let t = tower_other.name;
           if(t != this.node.name)
           {
            tower_other.zIndex = 18;
            tower_other.getChildByName("toggleContainer").active = false;

            let tower = tower_other.getChildByName("toggleContainer").children;
            for(let i=0;i<tower.length;i++)
            {
                tower[i].getComponent(cc.Toggle).isChecked = false;
            }

            tower_other.getChildByName("hint_panel").active = false;
            tower_other.getChildByName("show").active = false;
            tower_other.getChildByName("circle").active = false;
           }
        }
      
        if (!this.toggleContainer.active) {
            localStorage.setItem("isChoice_base",String(1));

            localStorage.setItem("isChoice_base",String(0));
            this.toggleContainer.active = !this.toggleContainer.active;
            this.toggleContainer.getComponent(cc.Animation).play('showWeaponAnim')
        }
        else {
            this.toggleContainer.getComponent(cc.Animation).play('showWeaponAnimRe')
            let act = cc.delayTime(0.05);
            let callfunc = cc.callFunc(() => {
                this.toggleContainer.active = false;
                this.hint.active = false;

            }, this);

            this.toggleContainer.runAction(cc.sequence(act, callfunc));

            
            let tower =   this.toggleContainer.children;
            for(let i=0;i<tower.length;i++)
            {
                tower[i].getComponent(cc.Toggle).isChecked = false;
            }
            this.circle.active = false;
        }

    }

    //加载攻击音效
    loadAttSound()
    {
        let name:string = "";
        switch (this.choice_tower_id) {
            case 1:
                name = "arrow_lvl_1";
                break;
            case 2:
                name = "kitty_litter_lvl_1"
                break;
            case 3:
                name = "Teslagun"
                break;
            case 4:
                name = "magic_tower_lvl1"
                break;
            case 5:
                name = "Firegun";
                break;
            case 6:
                name = "Sniper";
                break;
            default:
                break;
        }

        cc.resources.load(`audio/sound_ogg/${name}`,cc.AudioClip,(err:Error,audioClip:cc.AudioClip)=>{
            this.att_sound = audioClip;
            this.node.getComponent(cc.AudioSource).clip = this.att_sound;
        });
    }
    //生成塔
    loadTower(id: number) {
    this.unlockTower()
    if(!this.tower_messege[id - 1].unlock)
    {
        return;
    }
    if (this.battel_message.present_gear < this.towerConfig[id - 1].config[0].upgrand_price) {
        return;
    }
        this.node.getComponent(cc.AudioSource).clip = this.create_sound;
        this.node.getComponent(cc.AudioSource).play();
        
        cc.resources.load(this.towerConfig[id - 1].config[0].atlas, cc.SpriteAtlas, (err, atlas: cc.SpriteAtlas) => {
           
                this.battel_message.present_gear -= this.towerConfig[id - 1].config[0].upgrand_price;
               
                this.node.dispatchEvent(new cc.Event.EventCustom("updateMesseg",true));

                let fram = atlas.getSpriteFrame(this.towerConfig[id - 1].config[0].sprite_frame);
                this.choice_tower.getComponent(cc.Sprite)
                this.choice_tower.getComponent(cc.Sprite).spriteFrame = fram;

                this.att = this.towerConfig[id - 1].config[0].att;
                this.speed = this.towerConfig[id - 1].config[0].speed;
                this.rang = this.towerConfig[id - 1].config[0].rang;
                this.upgrade_price = this.towerConfig[id - 1].config[0].upgrand_price;

                this.tower_lv++;
                this.hint.active = false;
                this.land.active = false;
                this.circle.active = false;
                this.choice_tower.active = true;
                this.choice_tower_id = id;

                this.updateAnim();
                this.loadAttSound();
        });
    }

    loadBaseAnimRe() {
        this.toggleContainer.getComponent(cc.Animation).play('showWeaponAnimRe')
        let act = cc.delayTime(0.1);
        let callfunc = cc.callFunc(function () {
            this.toggleContainer.active = !this.toggleContainer.active;
        }, this);
        this.toggleContainer.runAction(cc.sequence(act, callfunc));
    }

    loadHintPanel(id: number,lv:number) {
        this.hint.active = true;
        this.hint.getChildByName("name").getComponent(cc.Label).string = this.towerConfig[id - 1].name;
        this.hint.getChildByName("detail").getComponent(cc.Label).string = this.towerConfig[id - 1].describe;
 //       console.log(this.tower_lv);
        this.hint.getChildByName("atk").getComponent(cc.Label).string = "" + this.towerConfig[id - 1].config[lv].att;
        this.hint.getChildByName("speed").getComponent(cc.Label).string = "" + this.towerConfig[id - 1].config[lv].speed;
        this.hint.getChildByName("rang").getComponent(cc.Label).string = "" + this.towerConfig[id - 1].config[lv].rang;
    }

    //Archer-tower
    onClickMenu1() {
        if (!this.menu1.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(1);


            this.menu1.getComponent(cc.Toggle).isChecked = false;

            //this.arrowAnimation();
        }
        else {
            let rang = this.towerConfig[0].config[0].rang;
            
            this.circle.width = this.circle_rang / 4 * rang;
            this.circle.height = this.circle_rang / 4 * rang;
            this.circle.active = true;

            this.loadHintPanel(1,0);
        }
    }

    //Kitty-litter-tower
    onClickMenu2() {
        if (!this.menu2.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(2);

            this.menu2.getComponent(cc.Toggle).isChecked = false;
         //   this.kittyAnimation();
        }
        else {
            let rang = this.towerConfig[1].config[0].rang;
            
            this.circle.width = this.circle_rang / 4 * rang;
            this.circle.height = this.circle_rang / 4 * rang;
            this.circle.active = true;

            this.loadHintPanel(2,0);
        }
    }

    //Ball-of-yarn-tower 
    onClickMenu3() {
        if (!this.menu3.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(3);

            this.menu3.getComponent(cc.Toggle).isChecked = false;

   //         this.ballAnimation();
        }
        else {
            let rang = this.towerConfig[2].config[0].rang;
            
            this.circle.width = this.circle_rang / 4 * rang;
            this.circle.height = this.circle_rang / 4 * rang;
            this.circle.active = true;

            this.loadHintPanel(3,0);
        }
    }

    //Magic-wizard-tower
    onClickMenu4() {
        if (!this.menu4.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(4);

            this.menu4.getComponent(cc.Toggle).isChecked = false;

   //         this.magicAnimation();
        }
        else {
            let rang = this.towerConfig[3].config[0].rang;
            
            this.circle.width = this.circle_rang / 4 * rang;
            this.circle.height = this.circle_rang / 4 * rang;
            this.circle.active = true;

            this.loadHintPanel(4,0);
        }
    }

    //Fire-tower
    onClickMenu5() {
        if (!this.menu5.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(5);

            this.menu5.getComponent(cc.Toggle).isChecked = false;

    //        this.fireAnimation();
        }
        else {
            let rang = this.towerConfig[4].config[0].rang;
            
            this.circle.width = this.circle_rang / 4 * rang;
            this.circle.height = this.circle_rang / 4 * rang;
            this.circle.active = true;

            this.loadHintPanel(5,0);
        }
    }

    //Sniper-tower
    onClickMenu6() {
        if (!this.menu6.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(6);

            this.menu6.getComponent(cc.Toggle).isChecked = false;

 //           this.sniperAnimation();
        }
        else {
            let rang = this.towerConfig[5].config[0].rang;
            
            this.circle.width = this.circle_rang / 4 * rang;
            this.circle.height = this.circle_rang / 4 * rang;

            this.circle.active = true;

            this.loadHintPanel(6,0);
        }
    }

    //点击塔
    onClickTower() {
        this.enabledUpgrade();

        let count = Number(localStorage.getItem("tower_count"));
        this.node.zIndex = 20;
        for(let i=0; i < count; i++)
        {
            let tower_other =  this.node.parent.getChildByName(String(i))
           let t = tower_other.name;
           if(t != this.node.name)
           {
            tower_other.zIndex = 18;
            tower_other.getChildByName("toggleContainer").active = false;
            tower_other.getChildByName("hint_panel").active = false;
            tower_other.getChildByName("show").active = false;
            tower_other.getChildByName("circle").active = false;
           }
        }
      

        if (!this.show.active) {
            this.loadShow();
            this.show.getComponent(cc.Animation).play('clickTowerAnim')
            this.loadHintPanel(this.choice_tower_id,this.tower_lv - 1);

            
            this.circle.width = this.circle_rang / 4 * this.rang;
            this.circle.height = this.circle_rang / 4 * this.rang;
            this.circle.active = true;
        }
        else {

            this.show.getComponent(cc.Animation).play('clickTowerAnimRe')
            let act = cc.delayTime(0.05);
            let callfunc = cc.callFunc(() => {
                this.hint.active = false;
                this.show.active = false;
                this.circle.active = false;
                this.show.getChildByName('upgrand').getComponent(cc.Toggle).isChecked = false;
                this.show.getChildByName('delete').getComponent(cc.Toggle).isChecked = false;
            }, this);
            this.show.runAction(cc.sequence(act, callfunc));
        }
    }


    //是否可以升级
    enabledUpgrade()
    { 
        let gear =  this.upgrade_price;
       
        let tower:LocalTowerMessege[] = JSON.parse(localStorage.getItem("tower_messege"));

        if(this.tower_lv == tower[this.choice_tower_id -1].max_lv)
        {
           
           
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.isUpgrade = false;
                this.show.getChildByName('upgrand').getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_lock2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.show.getChildByName('upgrand').getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(gear > this.battel_message.present_gear)
        {
           
            cc.resources.load("images/gamescene/menucreatetower/menu_upgrade2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.isUpgrade = false;
                this.show.getChildByName('upgrand').getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
               
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.show.getChildByName('upgrand').getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if(gear <= this.battel_message.present_gear){
           
            cc.resources.load("images/gamescene/menucreatetower/menu_upgrade1",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.isUpgrade = true;
                this.show.getChildByName('upgrand').getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
               
            });
            cc.resources.load("images/gamescene/menucreatetower/menu_ok2",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>
            {
                this.show.getChildByName('upgrand').getChildByName('checkmark').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    }

    //升级后动画
    updateAnim()
    {
        switch(this.choice_tower_id)
        {
            case 1:
                this.arrowAnimation();
                break;
            case 2:
                this.kittyAnimation();
                break;
            case 3:
                this.ballAnimation();
                break;
            case 4:
                this.magicAnimation();
                break;
            case 5:
                this.fireAnimation();
                break;
            case 6:
                this.sniperAnimation();
                break;
            default:
                break;
        }

        switch(this.tower_dir)
        {
            case towerDir.left_down:
                this.anim.play(this.anim_LD).speed = this.speed * this.mutiple; 
                break;
            case towerDir.left_up:
                this.anim.play(this.anim_LU).speed = this.speed * this.mutiple;
                break;
            case towerDir.right_down:
                this.anim.play(this.anim_RD).speed = this.speed * this.mutiple;
                break;
            case towerDir.right_up:
                this.anim.play(this.anim_RU).speed = this.speed * this.mutiple;
                break;
            default:
                break;
        }
    }
    //升级
    onClickUpgrand() {


        if (!this.show.getChildByName('upgrand').getComponent(cc.Toggle).isChecked && this.isUpgrade) {

            //if (this.gold_count >= this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv - 1].upgrand_price) {
            //   this.gold_count -= this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv - 1].upgrand_price;
            this.node.getComponent(cc.AudioSource).clip = this.create_sound;
            this.node.getComponent(cc.AudioSource).play();

            cc.resources.load(this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv].atlas, cc.SpriteAtlas, (err, atlas: cc.SpriteAtlas) => {
                this.isUpgrade = false;

                let fram = atlas.getSpriteFrame(this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv].sprite_frame);
                this.choice_tower.getComponent(cc.Sprite).spriteFrame = fram;

                this.att = this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv].att;
                this.speed = this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv].speed;
                this.rang = this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv].rang;
                this.upgrade_price = this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv].upgrand_price;

                this.battel_message.present_gear -= this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv].upgrand_price;
                this.node.dispatchEvent(new cc.Event.EventCustom("updateMesseg", true));

                this.tower_lv++;
            
     
                // this.circle.width = this.circle_rang / 4 * this.rang;
                // this.circle.height = this.circle_rang / 4 * this.rang;
                this.circle.active = false;
                this.enabledUpgrade();

                this.show.getComponent(cc.Animation).play('clickTowerAnimRe')
                let act = cc.delayTime(0.1);
                let callfunc = cc.callFunc(() => {
                    this.show.active = false;
                });
                this.show.runAction(cc.sequence(act, callfunc));

                this.hint.active = false;

                this.updateAnim();
            });
            //  }

        }
        // else
        // {
        //     if(this.isUpgrade)
        //     {
        //         this.loadHintPanel(this.choice_tower_id);
        //     }
        // }
    }
    onClickDelet() {

        if (!this.show.getChildByName('delete').getComponent(cc.Toggle).isChecked) {

            this.node.getComponent(cc.AudioSource).clip = this.delete_sound;
            this.node.getComponent(cc.AudioSource).play();

            this.show.getComponent(cc.Animation).play('clickTowerAnimRe')
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(() => {
                this.show.active = !this.show.active;

                this.land.active = true;
                this.choice_tower.active = false;
                this.hint.active = false;
                this.battel_message.present_gear += Math.floor(this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv - 1].upgrand_price * 0.8);
                this.node.dispatchEvent(new cc.Event.EventCustom("updateMesseg", true));

                this.tower_lv = 0;
                this.choice_tower_id = 0;
                this.speed = 0;
                this.upgrade_price = 0;

                this.node.getChildByName("circle").active = false;
            });
            this.show.runAction(cc.sequence(act, callfunc));



        }
        else {
            this.hint.active = false;
        }
    }


    arrowAnimation(){
       this.anim_LD = `archerAnim_${this.tower_lv}_LD`;
       this.anim_RD = `archerAnim_${this.tower_lv}_RD`;
       this.anim_LU = `archerAnim_${this.tower_lv}_LU`;
       this.anim_RU = `archerAnim_${this.tower_lv}_RU`;
    }


    kittyAnimation(){
        this.anim_LD = `kittyAnim_${this.tower_lv}_LD`;
        this.anim_RD = `kittyAnim_${this.tower_lv}_RD`;
        this.anim_LU = `kittyAnim_${this.tower_lv}_LU`;
        this.anim_RU = `kittyAnim_${this.tower_lv}_RU`;
    }

    ballAnimation(){
        this.anim_LD = `ballAnim_${this.tower_lv}`;
        this.anim_RD = `ballAnim_${this.tower_lv}`;
        this.anim_LU = `ballAnim_${this.tower_lv}`;
        this.anim_RU = `ballAnim_${this.tower_lv}`;
    }

    magicAnimation(){
        this.anim_LD = `magicAnim_${this.tower_lv}_LD`;
        this.anim_RD = `magicAnim_${this.tower_lv}_RD`;
        this.anim_LU = `magicAnim_${this.tower_lv}_LU`;
        this.anim_RU = `magicAnim_${this.tower_lv}_RU`;
    }

    fireAnimation(){
        this.anim_LD = `fireAnim_${this.tower_lv}_LD`;
        this.anim_RD = `fireAnim_${this.tower_lv}_RD`;
        this.anim_LU = `fireAnim_${this.tower_lv}_LU`;
        this.anim_RU = `fireAnim_${this.tower_lv}_RU`;
    }

    sniperAnimation(){
        this.anim_LD = `sniperAnim_${this.tower_lv}_LD`;
        this.anim_RD = `sniperAnim_${this.tower_lv}_RD`;
        this.anim_LU = `sniperAnim_${this.tower_lv}_LU`;
        this.anim_RU = `sniperAnim_${this.tower_lv}_RU`;
    }


    

    stopAttack()
    {
      
           // this.anim.stop();
        this.anim.currentClip.wrapMode = cc.WrapMode.Normal;
       
    }
    
    
    towerAttackDir(enemyPoint:cc.Vec2,towerPoint:cc.Vec2)
    {

        this.is_attack = true;
       
        let dir:towerDir = towerDir.none;

        //右上
        if(enemyPoint.x >= 0 && enemyPoint.y >= 0)
        {
           dir = towerDir.right_up;
        }
        //右下
        else if(enemyPoint.x >= 0 && enemyPoint.y < 0)
        {
            dir = towerDir.right_down;
        }
        //左上
        else if(enemyPoint.x < 0 && enemyPoint.y >= 0)
        {
            dir = towerDir.left_up
        }
        //左下
        else if(enemyPoint.x < 0 && enemyPoint.y < 0)
        {
            dir = towerDir.left_down;
        }

        let tmp:LoadingBattel = this.battel_message;

        if(tmp.present_hp <= 0)
        {
            this.unscheduleAllCallbacks();
            this.anim.stop();
            return;
        }
        if (dir != this.tower_dir || this.mutiple != tmp.speed ||
             !this.anim.getAnimationState( this.anim_name).isPlaying ) {
           
            this.tower_dir = dir;
            this.mutiple = tmp.speed;
           
            switch (this.tower_dir) {
                case towerDir.left_down:
                    this.anim.play(this.anim_LD).speed = this.speed * this.mutiple; 

                    this.anim_name = this.anim_LD;
                    break;
                case towerDir.left_up:
                    this.anim.play(this.anim_LU).speed = this.speed * this.mutiple;
                    this.anim_name =this.anim_LU;
                    break;
                case towerDir.right_down:
                    this.anim.play(this.anim_RD).speed = this.speed * this.mutiple;
                    this.anim_name =this.anim_RD;
                    break;
                case towerDir.right_up:
                    this.anim.play(this.anim_RU).speed = this.speed * this.mutiple;
                    this.anim_name =this.anim_RU;
                    break;
                default:
                    break;
            }
        }
    }

   setEnemy(enemy:cc.Node)
   {

   }

    update(){
        
       
    }
}

