// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import LoadingBattel from "./loadingBattel"

const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    private road: cc.Vec2[] = [];

    private nextpoint: number = 0;

    speed: number = 3;

    mix_hp: number = 20;

    hp:number = 20;

    gear:number = 0;

    enemyArr:cc.Node[] = [];

    @property(cc.Node)
    hpBar:cc.Node = null;

    islive:boolean = true;

    addspeed:number = 1;

    animnum:number = 0;
    
    anim:cc.Animation = null;

    att:number = 0;

    onLoad(){
        this.anim = this.node.getComponent(cc.Animation); 
    }

    start(){
      cc.director.getCollisionManager().enabled = true;
    }

    setValue(hp:number,speed:number,gear:number,att:number)
    {
        this.hp = hp;
        this.mix_hp = hp;
        this.speed = speed;
        this.gear = gear;
        this.att = att;
    }
    setRoad(road: cc.Vec2[]) {

        let num = Math.floor(Math.random() * 10 * 2);

        if (Math.ceil(Math.random() * 10) > 5) {
            num = -num;
        }

        let x = road[0].x - road[1].x;
        let y = road[0].y - road[1].y;

        if (Math.abs(x) > 20) {
            for (let i = 0; i < road.length; i++) {
                this.road.push(new cc.Vec2(road[i].x,road[i].y + num));
            }
        } else if (Math.abs(y) > 20) {
            for (let i = 0; i < road.length; i++) {
                this.road.push(new cc.Vec2(road[i].x + num,road[i].y));
            }
        }

        this.node.setPosition(this.road[0]);
    }



    startMove() {
        this.schedule(() => {
            this.move();
        }, 0.08);
    }

    //到达终点
    inEnd(){
        let tmp:LoadingBattel = this.node.parent.getComponent("loadingBattel");
        tmp.present_hp -= this.att;

        this.islive = false;
        this.node.active = false;
        this.unscheduleAllCallbacks();
        this.node.dispatchEvent(new cc.Event.EventCustom("updateMesseg",true));
    }

    move() {
        let point = new cc.Vec2(this.node.position.x, this.node.position.y);

        let v: cc.Vec2 = cc.Vec2.ZERO;

        let offset_y = this.road[this.nextpoint].y - point.y;
        let offset_x = this.road[this.nextpoint].x - point.x
        if ((Math.abs(offset_x ) <= 10 ) && (Math.abs(offset_y) <= 10)) {
           if(this.nextpoint == this.road.length - 1)
           {
               this.inEnd();
               return;
           }
            let clip: cc.AnimationClip[] = this.node.getComponent(cc.Animation).getClips();

            this.nextpoint++;

            let x = this.road[this.nextpoint].x - this.road[this.nextpoint - 1].x
            let y = this.road[this.nextpoint].y - this.road[this.nextpoint - 1].y

            if (x > 30) {
                this.anim.play(clip[2].name).speed = this.speed * this.addspeed;
                this.node.scaleX = -1;
                this.animnum = 2;
            }
            else if (x < -30) {
                this.anim.play(clip[2].name).speed = this.speed * this.addspeed;
                this.node.scaleX = 1;
                this.animnum = 2;
            }
            else if (y > 30) {
                this.anim.play(clip[1].name).speed = this.speed * this.addspeed;
                this.node.scaleX = 1;
                this.animnum = 1;
            }
            else if (y < -30) {
                this.anim.play(clip[0].name).speed = this.speed * this.addspeed;
                this.node.scaleX = 1;
                this.animnum = 0;
            }
        }
        else {
            let x = this.road[this.nextpoint].x - this.road[this.nextpoint - 1].x;
            let y = this.road[this.nextpoint].y - this.road[this.nextpoint - 1].y;
            v = new cc.Vec2(x, y);
        }

        v.normalizeSelf();
        let next_x = this.node.position.x + v.x * this.speed * this.addspeed;
        let next_y = this.node.position.y + v.y * this.speed * this.addspeed;
        this.node.setPosition(next_x, next_y);
    }

    //受伤
    hurt(harm:number){
        this.hp -= harm;
        if(this.hp <= 0)
        {
            this.islive = false;
            this.hpBar.active = true;
            this.hpBar.getComponent(cc.ProgressBar).progress =0;

            let clip: cc.AnimationClip[] = this.node.getComponent(cc.Animation).getClips();
            clip[4].speed = 4 ;
            this.anim.play(clip[4].name);
        }
        else{
            this.hpBar.active = true;
            this.hpBar.getComponent(cc.ProgressBar).progress = this.hp * 1.0 / this.mix_hp
        }
    }


    die()
    {
        this.unscheduleAllCallbacks();
        this.node.active = false;

        if(this.hp <=0)
        {
            let tmp:LoadingBattel = this.node.parent.getComponent("loadingBattel");
            tmp.present_gear += this.gear;

            this.node.dispatchEvent(new cc.Event.EventCustom("updateMesseg",true));
        }
      
        //this.node.destroy();
    }


    onCollisionEnter(other)
    {
      
        this.islive = false;
            this.hpBar.active = true;
            this.hp = 0;
            this.hpBar.getComponent(cc.ProgressBar).progress =0;

            let clip: cc.AnimationClip[] = this.anim.getClips();
            clip[4].speed = 3;
            this.anim.play(clip[4].name);
    }

    update()
    {
        let tmp:LoadingBattel = this.node.parent.getComponent("loadingBattel");
        if(tmp.speed != this.addspeed)
        {
            this.addspeed = tmp.speed;
            let clip: cc.AnimationClip[] = this.anim.getClips();
            this.anim.play(clip[this.animnum].name).speed = this.speed * this.addspeed;
        }
    }
}
