// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;

import {MapMessege,LocalTowerMessege,HeroMessege} from "./GameData";

@ccclass
export default class PlayButton extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      cc.debug.setDisplayStats(false)
    }

    start(){
        localStorage.setItem("first",String(0));
        console.log("fist");
        let n = Number(localStorage.getItem("first"));

        if(n == 0)
        {
            
            localStorage.setItem("first",String(1));

            let tower:LocalTowerMessege[] = [];

            tower.push(new LocalTowerMessege(1,"ARROW",true,1,2))
            tower.push(new LocalTowerMessege(2,"KITTY LITTER",true,1,2))
            tower.push(new LocalTowerMessege(3,"YARN",true,1,1))
            tower.push(new LocalTowerMessege(4,"MAGIC",true,1,1))
            tower.push(new LocalTowerMessege(5,"FIRE",true,1,1))
            tower.push(new LocalTowerMessege(6,"LASER",true,1,1))

            localStorage.setItem("tower_messege",JSON.stringify(tower));

            let hero:HeroMessege[] = []

            let skill_1:number[] = [0,0,0,0,0]
            hero.push(new HeroMessege(0,"SAMURAL",true,1,skill_1,));
            let skill_2:number[] = [0,0,0,0,0]
            hero.push(new HeroMessege(1,"WIZARD",false,0,skill_2,));
            let skill_3:number[] = [0,0,0,0,0]
            hero.push(new HeroMessege(2,"MONK",false,0,skill_3,));

            localStorage.setItem("hero_messege",JSON.stringify(hero));
            
            localStorage.setItem("prop_potion",String(3));
            localStorage.setItem("prop_ice",String(3));
            localStorage.setItem("prop_holy",String(3));

           
            localStorage.setItem("gold",String(300));

            localStorage.setItem("star",String(0));

            localStorage.setItem("max_maplv",String(3));
           
            console.log("first game")
            let map:MapMessege[] = [];
            for(let i=1 ;i <= 15; i++)
            {
               map.push(new MapMessege(i,false,0,0,));
            }

            localStorage.setItem("map_messege",JSON.stringify(map));
        }
    }
   
    onClickPlayButton(){
        cc.director.loadScene('GameScene');
    }
}
