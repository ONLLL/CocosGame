// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { HeroState } from "./GameData"
import LoadingBattel from "./loadingBattel"
import Enemy from "./enemy-action"
const { ccclass, property } = cc._decorator;

@ccclass
export default class Hero extends cc.Component {

    hero_state: number = HeroState.Stand;

    road: cc.Vec2[] = [];

    //下一个点
    nextpoint: cc.Vec2 = cc.Vec2.ZERO;

    //当前点下标
    nextindex: number = 0;

    //当前点
    prepoint_num: number = 0;

    anim: cc.Animation = null;

    animnum: number = 0;

    speed: number = 5;

    att:number = 10;

    hp:number = 100;

    max_hp:number = 100;

    addspeed = 1;

    is_live:boolean = true;

    enemy:cc.Node = null;

    //目标点
    target_point: cc.Vec2 = cc.Vec2.ZERO

    //离目标点最近的点的下标
    target_index: number = -1;

    //方向向上  或向下
    dir: number = -2;

    @property(cc.Node)
    hpBar:cc.Node = null;

    onLoad() {
        this.anim = this.node.getComponent(cc.Animation);
      
    }

    setRoad(road: cc.Vec2[]) {

        let x = road[0].x - road[1].x;
        let y = road[0].y - road[1].y;


        if (Math.abs(x) > 20) {
            for (let i = 0; i < road.length; i++) {
                this.road.push(new cc.Vec2(road[i].x, road[i].y));
            }
        } else if (Math.abs(y) > 20) {
            for (let i = 0; i < road.length; i++) {
                this.road.push(new cc.Vec2(road[i].x, road[i].y));
            }
        }

        this.road = this.road.reverse();

        this.node.parent.setPosition(this.road[0]);
    }

    startMove() {
        this.schedule(this.move, 0.05, cc.macro.REPEAT_FOREVER, 0);

    }


    move(dt: number) {
        let point = new cc.Vec2(this.node.parent.position.x, this.node.parent.position.y);

        // if (this.target_index != -2 && this.nextindex > 0) {
        //     if (this.target_index > this.nextindex) {
        //         this.nextindex++;
        //         this.target_index = -2;
        //     }
        //     else {
        //         this.nextindex--;
        //         this.target_index = -2;
        //     }
        // }

        //是否到目标点附近
        if (Math.abs(this.target_point.y - point.y) <= 100 && Math.abs(this.target_point.x - point.x) <= 100) {
            let y = this.target_point.y - point.y;
            let x = this.target_point.x - point.x;
            let clip: cc.AnimationClip[] = this.node.getComponent(cc.Animation).getClips();
            //向右
            if (x > 5 && y<=100) {
                if (this.anim.currentClip.name != clip[3].name || !this.anim.currentClip.name) {
                    this.anim.play(clip[3].name).speed = this.speed * this.addspeed;
                    this.node.scaleX = -1;
                    this.animnum = HeroState.Right;
                }
            }
            //向左
            else if (x < -5 && y <= 100) {
                if (this.anim.currentClip.name != clip[3].name || !this.anim.currentClip.name) {
                    this.anim.play(clip[3].name).speed = this.speed * this.addspeed;
                    this.node.scaleX = 1;
                    this.animnum = HeroState.Left;
                }
            }
            //向上
            else if (y >= 0) {
                if (this.anim.currentClip.name != clip[2].name || !this.anim.currentClip.name) {
                    this.anim.play(clip[2].name).speed = this.speed * this.addspeed;
                    this.node.scaleX = 1;
                    this.animnum = HeroState.Up;
                }
            }
            //向下
            else if (y < 0) {
                if (this.anim.currentClip.name != clip[1].name || !this.anim.currentClip.name) {
                    this.anim.play(clip[1].name).speed = this.speed * this.addspeed;
                    this.node.scaleX = 1;
                    this.animnum = HeroState.Down;
                }

            }


            if (Math.abs(this.target_point.y - point.y) <= 10 && Math.abs(this.target_point.x - point.x) <= 10) {
                let clip: cc.AnimationClip[] = this.node.getComponent(cc.Animation).getClips();
                this.anim.play(clip[0].name);
                this.unschedule(this.move);

               this.target_index = -2;
                return;
            }
            let v = this.target_point.sub(point);
            v.normalizeSelf()

            let next_x = this.node.parent.position.x + v.x * this.speed * this.addspeed;
            let next_y = this.node.parent.position.y + v.y * this.speed * this.addspeed;
            this.node.parent.setPosition(next_x, next_y);
            return;
        }

        let v: cc.Vec2 = cc.Vec2.ZERO;

        let offset_y = this.road[this.nextindex].y - point.y;
        let offset_x = this.road[this.nextindex].x - point.x

        if ((Math.abs(offset_x) <= 10) && (Math.abs(offset_y) <= 10)) {

            let clip: cc.AnimationClip[] = this.node.getComponent(cc.Animation).getClips();
            //  console.log(clip)

            let x: number = 0;
            let y: number = 0;

            if (this.target_point.y >= point.y) {
                this.dir = HeroState.Up;
                this.nextindex++;
                x = this.road[this.nextindex].x - this.road[this.nextindex - 1].x
                y = this.road[this.nextindex].y - this.road[this.nextindex - 1].y

                this.target_index = this.nextindex + 1;
            }
            else if (this.nextindex >= 1) {
                this.dir = HeroState.Down;
                this.nextindex--;
                x = this.road[this.nextindex - 1].x - this.road[this.nextindex].x
                y = this.road[this.nextindex - 1].y - this.road[this.nextindex].y

                this.target_index = this.nextindex - 1;
            }


            //向右
            if (x > 30) {
                this.anim.play(clip[3].name).speed = this.speed * this.addspeed;
                this.node.scaleX = -1;
                this.animnum = HeroState.Right;
            }
            //向左
            else if (x < -30) {
                this.anim.play(clip[3].name).speed = this.speed * this.addspeed;
                this.node.scaleX = 1;
                this.animnum = HeroState.Left;
            }
            //向上
            else if (y > 30) {
                this.anim.play(clip[2].name).speed = this.speed * this.addspeed;
                this.node.scaleX = 1;
                this.animnum = HeroState.Up;
            }
            //向下
            else if (y < -30) {
                this.anim.play(clip[1].name).speed = this.speed * this.addspeed;
                this.node.scaleX = 1;
                this.animnum = HeroState.Down;
            }
        }
        else {

            let x: number = 0;
            let y: number = 0;

            x = this.road[this.nextindex].x - point.x;
            y = this.road[this.nextindex].y - point.y;

            v = new cc.Vec2(x, y);
        }

        v.normalizeSelf();
        let next_x = this.node.parent.position.x + v.x * this.speed * this.addspeed;
        let next_y = this.node.parent.position.y + v.y * this.speed * this.addspeed;
        this.node.parent.setPosition(next_x, next_y);
    }

    //寻找目标点的前一个地点
    findPos() {
        let target_x = this.target_point.x;
        let target_y = this.target_point.y;



        for (let i = 0; i < this.road.length; i++) {
            let x = this.road[i].x;
            let y = this.road[i].y;

            let sub_x = x - target_x;
            let sub_y = y - target_y;


            if (sub_x >= 0 && Math.abs(sub_y) <= 100 && (this.animnum == HeroState.Left || this.animnum == HeroState.Up)) {
                this.target_index = i;
                return;
            }

            if (sub_x < 0 && Math.abs(sub_y) <= 100 && (this.animnum == HeroState.Right || this.animnum == HeroState.Down)) {
                this.target_index = i;
                return;
            }
        }
    }

    attack(enemy:cc.Node)
    {
        if(!this.anim.getAnimationState("samurai_attack").isPlaying)
        {
            this.enemy = enemy;
            if(enemy.x >this.node.parent.x)
            {
                this.anim.play("samurai_attack");
                this.node.scaleX = -1;
            }
            else
            {
                this.anim.play("samurai_attack");
                this.node.scaleX = 1;
            }
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

    die()
    {
        this.anim.stop();
        this.hpBar.active = true;
    }

    onatt()
    {
        if(this.enemy)
        {
            let enemy:Enemy = this.enemy.getComponentInChildren("enemy-action");
            if(enemy.islive)
            {
                enemy.hurt(this.att)
            }
        }
    }
    update() {
        let tmp: LoadingBattel = this.node.parent.parent.getComponent("loadingBattel");
        if (tmp.speed != this.addspeed) {
            this.addspeed = tmp.speed;
            let clip: cc.AnimationClip[] = this.anim.getClips();
            this.anim.play(clip[this.animnum].name).speed = this.speed * this.addspeed;
        }


    }
}
