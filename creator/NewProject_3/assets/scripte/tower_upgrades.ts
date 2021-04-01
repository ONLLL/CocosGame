// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import {MapMessege,LocalTowerMessege} from "./GameData";

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

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.Node])
    panelArr:cc.Node[] = [];

    select_panel: cc.Node = null;
    select_id:number = 0;

    icon_i:cc.Node = null;

    towerConfig:TowerConfig[] = [];

 
    start()
    {
        cc.resources.load("config/towerConfig", cc.JsonAsset, (err, jsonAsset: cc.JsonAsset) => {
            this.towerConfig = jsonAsset.json;
            let local_tower:LocalTowerMessege[] = [];
            local_tower = JSON.parse(localStorage.getItem("tower_messege"));

            for(let i = 0 ; i < this.panelArr.length ; i++)
            {
                let lv = local_tower[i].lv;
                
    //            console.log("unlock",local_tower[i].unlock)
                if(local_tower[i].unlock)
                {
                    this.panelArr[i].getChildByName("mask").active = false;
                }
                else
                {
                    this.panelArr[i].getChildByName("mask").active = true;
                    this.panelArr[i].getChildByName("mask").opacity = 110;
                    this.panelArr[i].getChildByName("upgrade").active = false;
                }

                this.setMessege(i,this.panelArr[i])
            }
        });
    }
      //设置信息
      setMessege(id:number,panel:cc.Node)
      {

        let local_tower:LocalTowerMessege[] = [];
        local_tower = JSON.parse(localStorage.getItem("tower_messege"));
        let lv = local_tower[id].lv;

        cc.resources.load(this.towerConfig[id].config[lv - 1].atlas,cc.SpriteAtlas,(err:Error,atlas:cc.SpriteAtlas)=>{
            panel.getChildByName("imag").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(this.towerConfig[id].config[lv - 1].sprite_frame);

            panel.getChildByName("detail").getComponent(cc.Label).string = this.towerConfig[id].describe;

            let upgrade = panel.getChildByName("upgrade")

            upgrade.getChildByName("button_window_shop").getChildByName("icon_coin").getComponentInChildren(cc.Label).string = String(this.towerConfig[id].config[lv - 1].upgrand_price)
        
            upgrade.getChildByName("messege").getChildByName("icon_atk").getComponentInChildren(cc.Label).string = "DMG:" + this.towerConfig[id].config[lv - 1].att;

            upgrade.getChildByName("messege").getChildByName("icon_rng").getComponentInChildren(cc.Label).string = "RNG:" + this.towerConfig[id].config[lv - 1].rang;

            upgrade.getChildByName("messege").getChildByName("icon_rate").getComponentInChildren(cc.Label).string = "SPEED:" + this.towerConfig[id].config[lv - 1].speed;
       
            upgrade.getChildByName("level").getChildByName("lv").getComponent(cc.Label).string = "LEVEL " + lv;

            if(lv >=  2)
            {
                upgrade.getChildByName("level").getComponentInChildren(cc.ProgressBar).progress = 1.0 * (lv - 1) / 3;
            }

        });
      }

    onClickPinel1() {
        this.selectPanel(1)
    }
    onClickPinel2() {
        this.selectPanel(2)
    }
    onClickPinel3() {
        this.selectPanel(3)
    }
    onClickPinel4() {
        this.selectPanel(4)
    }
    onClickPinel5() {
        this.selectPanel(5)
    }
    onClickPinel6() {
        this.selectPanel(6)
    }

    onClickUpgade()
    {
        let local_tower:LocalTowerMessege[] = [];
        local_tower = JSON.parse(localStorage.getItem("tower_messege"));
        let lv = local_tower[this.select_id - 1].lv;

        let gold = Number(localStorage.getItem("gold"));

        if(this.towerConfig[this.select_id - 1].config[lv - 1].upgrand_price > gold || 
            local_tower[this.select_id - 1].lv == local_tower[this.select_id - 1].max_lv )
        {
   //         console.log("不可升级")
            return;
        }
        else
        {
            this.node.getComponent(cc.AudioSource).play();
            local_tower[this.select_id - 1].lv++;
            localStorage.setItem("tower_messege",JSON.stringify(local_tower));

            gold -= this.towerConfig[this.select_id - 1].config[lv - 1].upgrand_price;
            localStorage.setItem("gold",String(gold));

            this.setMessege(this.select_id - 1,this.select_panel);
        }
    }

    selectPanel(id:number)
    {
        this.select_id = id;
        for(let i=0 ; i < this.panelArr.length; i++)
        {
            if(i + 1 == id)
            {
                this.panelArr[i].opacity = 255;
                this.panelArr[i].getChildByName("icon_i").getComponent(cc.Button).enabled = true;
                this.panelArr[i].getChildByName("upgrade").getComponentInChildren(cc.Button).enabled = true;
                this.select_panel = this.panelArr[i];
            }
            else{
                this.panelArr[i].opacity = 120;
                this.panelArr[i].getChildByName("icon_i").getComponent(cc.Button).enabled = false;
                this.panelArr[i].getChildByName("upgrade").getComponentInChildren(cc.Button).enabled = false;
            }
        }
    }


    onClickIconI()
    {
        if(this.select_panel.getChildByName("upgrade").active)
        {
            this.select_panel.getChildByName("upgrade").active = false;
            this.select_panel.getChildByName("detail").active  = true;
        }
        else
        {
            this.select_panel.getChildByName("upgrade").active = true;
            this.select_panel.getChildByName("detail").active  = false;
        }
      
    }

}
