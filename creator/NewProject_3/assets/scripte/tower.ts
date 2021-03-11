// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

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

@ccclass
export default class NewClass extends cc.Component {

 private lv:number;

 private type:number;

 private id:number;

    setLv(lv:number)
    {
        this.lv = lv;
        
        if(lv == 0)
        {
            cc.resources.load("images/gamescene/active_solt",cc.SpriteFrame,(err:Error,spriteFrame:cc.SpriteFrame)=>{
                this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
        }
        else{
            cc.resources.load(this.towerConfig[id - 1].config[0].atlas, cc.SpriteAtlas, (err, atlas: cc.SpriteAtlas) => {
                if (this.gold_count >= this.towerConfig[id - 1].config[0].upgrand_price) {
                    this.gold_count -= this.towerConfig[id - 1].config[0].upgrand_price;
                    let fram = atlas.getSpriteFrame(this.towerConfig[id - 1].config[0].sprite_frame);
                    this.choice_tower.getComponent(cc.Sprite).spriteFrame = fram;
    
                    this.tower_lv++;
                    this.hint.active = false;
                    this.land.active = false;
                    this.choice_tower.active = true;
                    this.choice_tower_id = id;
                }
            });
        }
    }
}
