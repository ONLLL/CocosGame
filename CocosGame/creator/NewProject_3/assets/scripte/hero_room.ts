// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import {MapMessege,LocalTowerMessege,HeroMessege} from "./GameData";

interface HeroConfig
{
    atlas: string;
    hero: Hero[];
}
interface Hero
{
    id: number;
    name: string;
    background: string;
    checkmark: string;
    skin: string;
    upgrade_price:number[];
    skill: Skill[]
}
interface Skill
{

    id: number;
    name: string;
    background: string;
    checkmark: string;
    detail:  string;
}

const { ccclass, property } = cc._decorator;

@ccclass
export  class HEEROROOM extends cc.Component {


    @property(cc.Node)
    hero_1:cc.Node = null;

    @property(cc.Node)
    hero_2:cc.Node = null;

    @property(cc.Node)
    hero_3:cc.Node = null;

    @property(cc.Node)
    hero_skin:cc.Node = null;

    @property(cc.Node)
    lv:cc.Node = null;

    @property(cc.Node)
    but_lvlup:cc.Node = null;

    @property(cc.Node)
    icon_gold:cc.Node = null;

    @property(cc.Node)
    unlock:cc.Node = null;

    // @property(cc.Node)
    // skill_1:cc.Node = null;

    // @property(cc.Node)
    // skill_2:cc.Node = null;

    // @property(cc.Node)
    // skill_3:cc.Node = null;

    // @property(cc.Node)
    // skill_4:cc.Node = null;

    // @property(cc.Node)
    // skill_5:cc.Node = null;

    @property([cc.Node])
    skill:cc.Node[] = [];

    @property(cc.Node)
    skill_messege:cc.Node = null;

    @property(cc.Node)
    skill_name:cc.Node = null;

    @property(cc.Node)
    skill_detail:cc.Node = null;

    @property(cc.Node)
    but_train:cc.Node = null;

    @property(cc.Node)
    but_reset:cc.Node = null;

    @property(cc.Node)
    pskill_icon:cc.Node = null;


    @property(cc.Node)
    gold:cc.Node = null;


    heroConfig:HeroConfig = null;

    atlas:cc.SpriteAtlas = null;

    hero_id:number  = 0;

    skill_id:number = 0;

    start()
    {
        cc.resources.load("config/heroConfig",cc.JsonAsset,(err:Error,jsonAsset:cc.JsonAsset)=>{
            this.heroConfig = jsonAsset.json;
            cc.resources.load(this.heroConfig.atlas,cc.SpriteAtlas,(err:Error,atlas:cc.SpriteAtlas)=>{
                console.log(this.heroConfig.atlas);

               this.atlas = atlas;

               this.setMessege();

            })
        });

     
    }

    setMessege()
    {
        let hero:HeroMessege[] = [];
        hero = JSON.parse(localStorage.getItem("hero_messege"));
      
        this.hero_skin.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(this.heroConfig.hero[this.hero_id].skin);

        
        for(let i = 0 ; i < this.skill.length ; i++)
        {
            this.skill[i].getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(this.heroConfig.hero[this.hero_id].skill[i].background);
        
            this.skill[i].getChildByName("checkmark").getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(this.heroConfig.hero[this.hero_id].skill[i].checkmark);

            console.log("skill:",hero[this.hero_id].skill[i])
           
            this.setSkillLv(i,hero[this.hero_id].skill[i]);
            
       }

       this.setSkillMessege();

       this.icon_gold.getComponentInChildren(cc.Label).string = "" + this.heroConfig.hero[this.hero_id].upgrade_price[hero[this.hero_id].lv];

       if(hero[this.hero_id].unlock)
       {
           this.but_reset.active = true;
           this.but_train.active = true;

           this.unlock.active = false;

           this.but_lvlup.active = true;
       }
       else
       {
        this.but_reset.active = false;
        this.but_train.active = false;

        this.unlock.active = true;

        this.but_lvlup.active = false;
       }

       let use:number = 0;
       for(let i = 0; i < hero[this.hero_id].skill.length; i++)
       {
            use += hero[this.hero_id].skill[i];
       }
       this.pskill_icon.getComponentInChildren(cc.Label).string = "x " + (hero[this.hero_id].lv - use);
    }

    setSkillLv(id:number,lv:number)
    {
        switch(lv)
        {
            case 0:
                this.skill[id].getChildByName("lv").getChildByName("lv_1"). active = false;
                this.skill[id].getChildByName("lv").getChildByName("lv_2"). active = false;
                this.skill[id].getChildByName("lv").getChildByName("lv_3"). active = false;
            break;
            case 1:
                this.skill[id].getChildByName("lv").getChildByName("lv_1"). active = true;
                this.skill[id].getChildByName("lv").getChildByName("lv_2"). active = false;
                this.skill[id].getChildByName("lv").getChildByName("lv_3"). active = false;
            break;
            case 2:
                this.skill[id].getChildByName("lv").getChildByName("lv_1"). active = true;
                this.skill[id].getChildByName("lv").getChildByName("lv_2"). active = true;
                this.skill[id].getChildByName("lv").getChildByName("lv_3"). active = false;
            break;
            case 3:
                this.skill[id].getChildByName("lv").getChildByName("lv_1"). active = true;
                this.skill[id].getChildByName("lv").getChildByName("lv_2"). active = true;
                this.skill[id].getChildByName("lv").getChildByName("lv_3"). active = true;
            break;
            default:
                break;
        }
    }

    setSkillMessege()
    {
        this.skill_messege.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(this.heroConfig.hero[this.hero_id].skill[this.skill_id].background);
        
       this.skill_name.getComponent(cc.Label).string = this.heroConfig.hero[this.hero_id].skill[this.skill_id].name;

       this.skill_detail.getComponent(cc.Label).string = this.heroConfig.hero[this.hero_id].skill[this.skill_id].detail;
    }

    onClickHero1()
    {
        this.hero_id = 0;
        this.skill_id = 0;

        this.setMessege();
    }

    onClickHero2()
    {
        this.hero_id = 1;
        this.skill_id = 0;

        this.setMessege();
    }

    onClickHero3()
    {
        this.hero_id = 2;
        this.skill_id = 0;

        this.setMessege();
    }
    
    onCliCkSkill1()
    {
        this.skill_id = 0;

        this.setSkillMessege()
    }
    onCliCkSkill2()
    {
        this.skill_id = 1;

        this.setSkillMessege()
    }
    onCliCkSkill3()
    {
        this.skill_id = 2;

        this.setSkillMessege()
    }
    onCliCkSkill4()
    {
        this.skill_id = 3;

        this.setSkillMessege()
    }
    onCliCkSkill5()
    {
        this.skill_id = 4;

        this.setSkillMessege()
    }

    onClickUpgrade(){
        let gold = Number(localStorage.getItem("gold"));

        let hero:HeroMessege[] = [];
        hero = JSON.parse(localStorage.getItem("hero_messege"));

        let upgrade_price = this.heroConfig.hero[this.hero_id].upgrade_price[hero[this.hero_id].lv];

        if(gold >= upgrade_price)
        {
            gold -= upgrade_price;
            localStorage.setItem("gold",String(gold));

            hero[this.hero_id].lv += 1;

            upgrade_price = this.heroConfig.hero[this.hero_id].upgrade_price[hero[this.hero_id].lv];

            this.but_lvlup.getChildByName("icon_gold").getComponentInChildren(cc.Label).string = "" + upgrade_price;

            this.lv.getComponent(cc.Label).string = "LEVE: " + hero[this.hero_id].lv

            localStorage.setItem("hero_messege",JSON.stringify(hero));

            let use: number = 0;
            for (let i = 0; i < hero[this.hero_id].skill.length; i++) {
                use += hero[this.hero_id].skill[i];
            }
            this.pskill_icon.getComponentInChildren(cc.Label).string = "x " + (hero[this.hero_id].lv - use);

            this.gold.getComponentInChildren(cc.Label).string = "" + gold
        }
    }

    onClickTrain()
    {
        let hero:HeroMessege[] = [];
        hero = JSON.parse(localStorage.getItem("hero_messege"));

        let use: number = 0;
        for (let i = 0; i < hero[this.hero_id].skill.length; i++) {
            use += hero[this.hero_id].skill[i];
        }

        if(use == hero[this.hero_id].lv || hero[this.hero_id].skill[this.skill_id] == 3 )
        {
            return;
        }

        hero[this.hero_id].skill[this.skill_id]++;

        localStorage.setItem("hero_messege",JSON.stringify(hero));

        this.setSkillLv(this.skill_id, hero[this.hero_id].skill[this.skill_id]);
        
        this.pskill_icon.getComponentInChildren(cc.Label).string = "x " + (hero[this.hero_id].lv - use -1);

    }

    onClickReset()
    {
        let hero:HeroMessege[] = [];
        hero = JSON.parse(localStorage.getItem("hero_messege"));

        for(let i = 0 ; i < this.skill.length ; i++)
        {
            hero[this.hero_id].skill[i] = 0;
            this.setSkillLv(i,0);
        }

        localStorage.setItem("hero_messege",JSON.stringify(hero));

        this.pskill_icon.getComponentInChildren(cc.Label).string = "x " + hero[this.hero_id].lv;
    }
}
