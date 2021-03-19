// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

interface Map{
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
export default class Flag extends cc.Component {


    private mask: cc.Node = null;

    private anim: cc.Animation = null;

    private show: cc.Node = null;

    private lv:number;

    onLoad() {
        this.show = cc.find("Canvas/Friendly_Map/choose/show");
     
        this.anim = this.show.getComponent(cc.Animation);

        this.mask =  cc.find("Canvas/Friendly_Map/mask");

        
    }

    onClickFlag() {
        let s:string = this.name;
        let n:string = '';

        for(let i = 0; i < s.length ;i++)
        {
            if(s[i] != '<')
            {
                n+=s[i];
            }
            else
            {
                break;
            }
        }
        localStorage.setItem("choice_lv",n);
        this.lv = Number(n);
        this.loadMessege();

        this.mask.active = true;
        this.show.parent.active = true;
        this.anim.play('toBattelAnim');
    }

    loadMessege(){
        cc.resources.load("config/mapConfig",cc.JsonAsset,(err:Error,jsonAsset:cc.JsonAsset)=>{
            let map:Map[] = jsonAsset.json;
            let mapdata:Map = map[this.lv-1];

            localStorage.setItem("choice_lv",String(this.lv));

            let normal = this.show.getChildByName("win_normal_diff");
            
            normal.getChildByName("coin_diff").getComponentInChildren(cc.Label).string = "x " + mapdata.nomal.money;
            normal.getChildByName("gear_for_diff").getComponentInChildren(cc.Label).string = "x " +mapdata.nomal.gear;
            normal.getChildByName("wave_for_diff").getComponentInChildren(cc.Label).string = "x " +mapdata.nomal.wave;
            normal.getChildByName("heals_for_diff").getComponentInChildren(cc.Label).string = "x " +mapdata.nomal.lifes;

            this.show.getChildByName("win_for_level2").getComponentInChildren(cc.Label).string = "LEVEL "+ mapdata.lv;
         
            cc.resources.load(mapdata.sprite_frame,cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>{
                this.show.getChildByName("lv_map").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        });
    }
}
