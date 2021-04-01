// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import Enemy from "./enemy-action"
import Battel from "./loadingBattel"

@ccclass
export default class SkillRole extends cc.Component {

    enemy:cc.Node = null;

    max_hp = 30;
    hp:number = 30;

    att:number = 5;

    is_live:boolean = true;

    @property(cc.Node)
    hpBar:cc.Node = null;

    att_speed:number = 1;

    add_speed:number = 1;

    anim:cc.Animation = null;
    onLoad()
    {
        this.anim = this.node.getComponent(cc.Animation);
    }
    initRole()
    {
        this.hp = this.max_hp;
        this.is_live = true;
    }
    attackEnemy(enemy:cc.Node)
    {
       
        if(this.enemy != enemy)
        {
            this.enemy = enemy;
            this.node.getComponent(cc.Animation).play("skill_kitty_fire");
            let temp:Enemy = enemy.getComponentInChildren("enemy-action");

            if(temp.islive)
            {
    
                if(enemy.x > this.node.parent.x)
                {
                    this.node.scaleX = -1;
                }
                else
                {
                    this.node.scaleX = 1;
                }
            }
        }
            
    }


    enemyHurt()
    {
        console.log("enemyHurt");
        let temp:Enemy = this.enemy.getComponentInChildren("enemy-action");
        if( temp.islive  && this.is_live)
        {
            temp.hurt(this.att);
        }
    }

    Hurt(harm:number)
    {
        if(this.is_live)
        {
            this.hp -= harm;
            if(this.hp <= 0)
            {
                this.hp = 0;
                this.is_live = false;
               this.anim.play("skill_kitty_die");
                return;
            }

            this.hpBar.getComponent(cc.ProgressBar).progress = this.hp * 1.0 / this.max_hp;
            this.hpBar.active =true;
        }
    }

    DeleteRole()
    {
       // this.node.parent.destroy();
       this.node.parent.active = false;

    }

    stopAtt()
    {

        if(this.enemy)
        {
            let enemy:Enemy = this.enemy.getComponent("enemy-action");
            if(enemy.islive == false)
            {
                this.anim.stop();
            }
        }
    }

    update()
    {
        let battle:Battel = this.node.parent.parent.getComponent("loadingBattel");

        if(battle.speed != this.add_speed)
        {
            this.add_speed = battle.speed;

            let clips = this.node.getComponent(cc.Animation).getClips();

            for(let i = 0; i < clips.length; i++)
            {
                clips[i].speed = this.add_speed * this.att_speed;
            }
        }

    }

}
