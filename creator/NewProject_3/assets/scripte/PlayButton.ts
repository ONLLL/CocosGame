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

    @property(cc.AudioClip)
    musiclip:cc.AudioClip = null;

    @property(cc.AudioClip)
    buttonclip:cc.AudioClip = null;

    @property(cc.Toggle)
    music:cc.Toggle = null;

    @property(cc.Toggle)
    soud:cc.Toggle = null;

    @property(Number)
    music_volume:number = 0;

    @property(Number)
    effect_volume:number = 0

    onLoad () {
      cc.debug.setDisplayStats(false)

      let music = localStorage.getItem("music");
      let soud = localStorage.getItem("soud");
      if(music)
      {
          if(music == '1')
          {
              this.music.isChecked = false;
              cc.audioEngine.playMusic(this.musiclip,true);
              cc.audioEngine.setMusicVolume(this.music_volume)
          }
          else if(music == '0')
          {
            this.music.isChecked = true;
          }

          if(soud == '1')
          {
              this.soud.isChecked = false;
          }
          else
          {
              this.soud.isChecked = true;
          }
      }
      else
      {
         localStorage.setItem("music",'1');
        // this.node.getComponent(cc.AudioSource).play();
         cc.audioEngine.playMusic(this.musiclip,true);

         localStorage.setItem("soud",'1');
      }
    }

    start(){
        localStorage.setItem("first",String(0));
  //      console.log("fist");
        let n = Number(localStorage.getItem("first"));

        if(n == 0)
        {
            
            localStorage.setItem("first",String(1));

            let tower:LocalTowerMessege[] = [];

            tower.push(new LocalTowerMessege(1,"ARROW",true,1,2))
            tower.push(new LocalTowerMessege(2,"KITTY LITTER",true,1,1))
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

           
            localStorage.setItem("gold",String(777));

            localStorage.setItem("star",String(0));

            localStorage.setItem("max_maplv",String(1));
           
   //         console.log("first game")
            let map:MapMessege[] = [];
            for(let i=1 ;i <= 15; i++)
            {
               map.push(new MapMessege(i,false,0,0,));
            }
           // map[0].is_finish = true;
           // map[0].normal_star = 2;

           // map[1].is_finish = true;
           // map[1].normal_star = 3;
            
            localStorage.setItem("map_messege",JSON.stringify(map));
        }
    }
   
    onClickPlayButton(){
        if(localStorage.getItem("soud") == '1')
        {
            cc.audioEngine.play(this.buttonclip,false,1);
        }
        cc.director.loadScene('GameScene');
    }

    onClickMusic()
    {
        if(!this.soud.isChecked)
        {
            cc.audioEngine.playEffect(this.buttonclip,false);
        }
        if(!this.music.isChecked)
        {
            localStorage.setItem("music",'1');
            cc.audioEngine.playMusic(this.musiclip,true);
        }
        else
        {
            localStorage.setItem("music",'0');
            cc.audioEngine.stopMusic()
        }
    }

    onClickSound()
    {
        if(!this.soud.isChecked)
        {
            cc.audioEngine.playEffect(this.buttonclip,false);
        }
        if(!this.soud.isChecked)
        {
            localStorage.setItem("soud",'1');
            cc.audioEngine.playEffect(this.buttonclip,false);
        }
        else
        {
            localStorage.setItem("soud",'0');
        }
    }
}
