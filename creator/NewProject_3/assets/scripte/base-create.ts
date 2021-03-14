

const { ccclass, property } = cc._decorator;

interface TowerConfig {
    id: number;
    name: string;
    icon: string;
    menu_selectable: string;
    menu_noselectable: string;
    describe: string;
    config: tower[];
}
interface tower {
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

    private toggleContainer: cc.Node = null;

    private menu1: cc.Node = null;
    private menu2: cc.Node = null;
    private menu3: cc.Node = null;
    private menu4: cc.Node = null;
    private menu5: cc.Node = null;
    private menu6: cc.Node = null;
    private choice_tower: cc.Node = null;
    private land: cc.Node = null;
    private hint: cc.Node = null;

    private show: cc.Node = null;

    private towerConfig: TowerConfig[] = [];
    private tower_lv: number = 1;

    choice_tower_id: number = 0;


    private gold_count: number = 3740;
    private lifes_count:number;
    private wave_count:number ;

    private anim:cc.Animation = null;

    //是否攻击
     is_attack:Boolean = false;

    //当前基地
    private base_now:number;

    //左下攻击
    private anim_LD:string = null;
    //右下攻击
    private anim_RD:string = null;
    //左上攻击
    private anim_LU:string = null;
    //右上攻击
    private anim_RU:string = null;

    private tower_dir:towerDir = towerDir.none;

    onLoad() {
       
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

        this.anim = this.choice_tower.getComponent(cc.Animation);
    }
    start() {
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

        });

        cc.resources.load("config/mapConfig",cc.JsonAsset,(err:Error,jsonAsset:cc.JsonAsset)=>{
            let map = jsonAsset.json;
            //this.lifes_count = map[]
        });
    }

    //点击基地
    onClickLand() {
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
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(() => {
                this.toggleContainer.active = !this.toggleContainer.active;
                this.hint.active = false;
            }, this);
            this.toggleContainer.runAction(cc.sequence(act, callfunc));
        }

    }

loadTower(id: number) {
    
        cc.resources.load(this.towerConfig[id - 1].config[0].atlas, cc.SpriteAtlas, (err, atlas: cc.SpriteAtlas) => {
            if (this.gold_count >= this.towerConfig[id - 1].config[0].upgrand_price) {
                this.gold_count -= this.towerConfig[id - 1].config[0].upgrand_price;
                let fram = atlas.getSpriteFrame(this.towerConfig[id - 1].config[0].sprite_frame);
                this.choice_tower.getComponent(cc.Sprite)
                this.choice_tower.getComponent(cc.Sprite).spriteFrame = fram;

                this.tower_lv++;
                this.hint.active = false;
                this.land.active = false;
                this.choice_tower.active = true;
                this.choice_tower_id = id;
            }
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

    loadHintPanel(id: number) {
        this.hint.active = true;
        this.hint.getChildByName("name").getComponent(cc.Label).string = this.towerConfig[id - 1].name;
        this.hint.getChildByName("detail").getComponent(cc.Label).string = this.towerConfig[id - 1].describe;
        this.hint.getChildByName("atk").getComponent(cc.Label).string = "" + this.towerConfig[id - 1].config[this.tower_lv - 1].att;
        this.hint.getChildByName("speed").getComponent(cc.Label).string = "" + this.towerConfig[id - 1].config[this.tower_lv - 1].speed;
        this.hint.getChildByName("rang").getComponent(cc.Label).string = "" + this.towerConfig[id - 1].config[this.tower_lv - 1].rang;
    }

    //Archer-tower
    onClickMenu1() {
        if (!this.menu1.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(1);

            this.menu1.getComponent(cc.Toggle).isChecked = false;

            this.arrowAnimation();
        }
        else {
            this.loadHintPanel(1);
        }
    }

    //Kitty-litter-tower
    onClickMenu2() {
        if (!this.menu2.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(2);

            this.menu2.getComponent(cc.Toggle).isChecked = false;
            this.kittyAnimation();
        }
        else {
            this.loadHintPanel(2);
        }
    }

    //Ball-of-yarn-tower 
    onClickMenu3() {
        if (!this.menu3.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(3);

            this.menu3.getComponent(cc.Toggle).isChecked = false;

            this.ballAnimation();
        }
        else {
            this.loadHintPanel(3);
        }
    }

    //Magic-wizard-tower
    onClickMenu4() {
        if (!this.menu4.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(4);

            this.menu4.getComponent(cc.Toggle).isChecked = false;

            this.magicAnimation();
        }
        else {
            this.loadHintPanel(4);
        }
    }

    //Fire-tower
    onClickMenu5() {
        if (!this.menu5.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(5);

            this.menu5.getComponent(cc.Toggle).isChecked = false;

            this.fireAnimation();
        }
        else {
            this.loadHintPanel(5);
        }
    }

    //Sniper-tower
    onClickMenu6() {
        if (!this.menu6.getComponent(cc.Toggle).isChecked) {
            this.loadBaseAnimRe();

            this.loadTower(6);

            this.menu6.getComponent(cc.Toggle).isChecked = false;

            this.sniperAnimation();
        }
        else {
            this.loadHintPanel(6);
        }
    }

    //点击塔
    onClickTower() {
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
           }
        }
      

        if (!this.show.active) {
            this.show.active = true;
            this.show.getComponent(cc.Animation).play('clickTowerAnim')
        }
        else {

            this.show.getComponent(cc.Animation).play('clickTowerAnimRe')
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(() => {
                this.hint.active = false;
                this.show.active = false;
                this.show.getChildByName('upgrand').getComponent(cc.Toggle).isChecked = false;
                this.show.getChildByName('delete').getComponent(cc.Toggle).isChecked = false;
            }, this);
            this.show.runAction(cc.sequence(act, callfunc));
        }
    }



    //升级
    onClickUpgrand() {
        if (!this.show.getChildByName('upgrand').getComponent(cc.Toggle).isChecked) {
            if (this.gold_count >= this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv - 1].upgrand_price) {
                this.gold_count -= this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv - 1].upgrand_price;
                cc.resources.load(this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv - 1].atlas, cc.SpriteAtlas, (err, atlas: cc.SpriteAtlas) => {
                    let fram = atlas.getSpriteFrame(this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv - 1].sprite_frame);
                    this.choice_tower.getComponent(cc.Sprite).spriteFrame = fram;

                    this.tower_lv++;

                    
                });
            }
            this.show.getComponent(cc.Animation).play('clickTowerAnimRe')
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(() => {
                this.show.active = false;
            });
            this.show.runAction(cc.sequence(act, callfunc));

            this.hint.active = false;
           
        }
        else
        {
            this.loadHintPanel(this.choice_tower_id);
        }
    }
    onClickDelet() {

        if (!this.show.getChildByName('delete').getComponent(cc.Toggle).isChecked) {

            this.show.getComponent(cc.Animation).play('clickTowerAnimRe')
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(() => {
                this.show.active = !this.show.active;
                this.tower_lv = 1;
                this.choice_tower_id = 0;
            });
            this.show.runAction(cc.sequence(act, callfunc));


            this.land.active = true;
            this.choice_tower.active = false;
            this.hint.active = false;
            this.gold_count += this.towerConfig[this.choice_tower_id - 1].config[this.tower_lv - 1].upgrand_price * 0.8;
            
        }
        else{
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
        this.anim.stop();
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

        if (dir != this.tower_dir) {
            this.tower_dir = dir;

            switch (this.tower_dir) {
                case towerDir.left_down:
                    this.anim.play(this.anim_LD);
                    break;
                case towerDir.left_up:
                    this.anim.play(this.anim_LU);
                    break;
                case towerDir.right_down:
                    this.anim.play(this.anim_RD);
                    break;
                case towerDir.right_up:
                    this.anim.play(this.anim_RU);
                    break;
                default:
                    break;
            }
        }
    }

    update(){
        
       
    }
}

