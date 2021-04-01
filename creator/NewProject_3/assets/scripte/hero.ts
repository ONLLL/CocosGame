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

    speed: number = 1;

    att:number = 4;

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

    hero_road:cc.Vec2[] = []

    is_move:boolean = false;

    //是否移动过
    moved:boolean = false;

    is_att:boolean = false;

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

        this.node.parent.setPosition(this.road[0].x,this.road[0].y + 10);
    }

    startMove() {
        this.schedule(this.move, 0.02, cc.macro.REPEAT_FOREVER, 0);

    }

    test(target:cc.Vec2)
    {
        for(let i = 0 ; i < this.road.length - 1; i++)
        {
            let pre_point:cc.Vec2 = new cc.Vec2(this.road[i].x,this.road[i].y);
            let next_point:cc.Vec2 = new cc.Vec2(this.road[i + 1].x,this.road[i + 1].y);

            let dir:cc.Vec2 = next_point.sub(pre_point)
            dir.normalizeSelf();

            if(Math.abs(pre_point.x - target.x) < 150 || Math.abs(pre_point.y - target.y) < 150)
            {
                return i;
            }
            while(true)
            {
                let x = Math.abs(target.x - pre_point.x);
                let y = Math.abs(target.y - pre_point.y);

                if(cc.Vec2.distance(pre_point,next_point) <= 10 )
                {
                    break;
                }
                else if(x <= 150 && y <= 150)
                {
                    return i;
                }
                else
                {
                    pre_point.x += dir.x * 2;
                    pre_point.y += dir.y * 2;
                }
            }
        }
    }

    
    targetMove(targrt:cc.Vec2)
    {

       // this.is_move = true;

        if(targrt.y > this.node.parent.y)
        {
            this.hero_road.push(new cc.Vec2(this.node.parent.x,this.node.parent.y));

            let i = 0;
            for( i = 0; i < this.road.length - 1; i++)
            {
                if (this.road[i].y <= this.node.parent.y &&
                    this.road[i + 1].y >= this.node.parent.y &&
                    Math.abs(this.node.parent.x - this.road[i].x) < 130)
                {
                    i++;
                   break;
                }
                else if(this.road[i].y > this.node.parent.y &&
                    this.road[i + 1].y > this.node.parent.y &&
                    Math.abs(this.node.parent.y - this.road[i].y) < 130)
                {
                   i++;
                   break;
                }
                else if(this.road[i].y < this.node.parent.y &&
                    this.road[i + 1].y < this.node.parent.y &&
                    Math.abs(this.node.parent.y - this.road[i].y) < 130)
                {
                   i++;
                   break;
                }
            }

            let j =0;
            for( j = 0; j < this.road.length - 1; j++)
            {
                if (this.road[j].y <=targrt.y &&
                    this.road[j + 1].y >= targrt.y &&
                    Math.abs(targrt.x - this.road[j].x) < 130)
                {
                   break;
                }
                else if(this.road[j].y >targrt.y &&
                    this.road[j + 1].y > targrt.y &&
                    Math.abs(targrt.y - this.road[j].y) < 130)
                {
                   break;
                }
                else if(this.road[j].y <targrt.y &&
                    this.road[j + 1].y < targrt.y &&
                    Math.abs(targrt.y - this.road[j].y) < 130)
                {
                   break;
                }
            }

          //   console.log("up i:",i,"  j:",j);

            for(; i <= j; i++)
            {
                this.hero_road.push(new cc.Vec2(this.road[i].x,this.road[i].y));
            }
            this.hero_road.push(new cc.Vec2(targrt.x,targrt.y));

            let test:cc.Vec2[] = [];
            for(let t of this.hero_road)
            {
                test.push(new cc.Vec2(t.x,t.y));
            }
        //    console.log(test);
        }
        else if(targrt.y <= this.node.parent.y)
        {
            this.hero_road.push(new cc.Vec2(this.node.parent.x,this.node.parent.y));

            let i = 0;
            for( i = 0; i < this.road.length - 1; i++)
            {
                if (this.road[i].y < this.node.parent.y &&
                    this.road[i + 1].y > this.node.parent.y &&
                    Math.abs(this.node.parent.x - this.road[i].x) < 130)
                {
                    i;
                   break;
                }
                else if(this.road[i].y > this.node.parent.y &&
                    this.road[i + 1].y > this.node.parent.y &&
                    Math.abs(this.node.parent.y - this.road[i].y) < 130)
                {
                    i;
                   break;
                }
                else if(this.road[i].y < this.node.parent.y &&
                    this.road[i + 1].y < this.node.parent.y &&
                    Math.abs(this.node.parent.y - this.road[i].y) < 130)
                {
                    i;
                   break;
                }
            }

            let j =0;
            for( j = 0; j < this.road.length - 1; j++)
            {
                if (this.road[j].y <targrt.y &&
                    this.road[j + 1].y > targrt.y &&
                    Math.abs(targrt.x - this.road[j].x) < 130)
                {
                    j++;
                   break;
                }
                else if(
                    this.road[j].y >targrt.y &&
                    this.road[j + 1].y > targrt.y &&
                    Math.abs(targrt.y - this.road[j].y) < 130)
                {
                    j++;
                   break;
                }
                else if(
                    this.road[j].y < targrt.y &&
                    this.road[j + 1].y < targrt.y &&
                    Math.abs(targrt.y - this.road[j].y) < 130)
                {
                    j++;
                   break;
                }
            }

            for(; i >= j; i--)
            {
                this.hero_road.push(new cc.Vec2(this.road[i].x,this.road[i].y));
            }
            this.hero_road.push(new cc.Vec2(targrt.x,targrt.y));

            let test:cc.Vec2[] = [];
            for(let t of this.hero_road)
            {
                test.push(new cc.Vec2(t.x,t.y));
            }
        //    console.log(test);
        }
        this.nextindex = 0;
    }


    move(dt: number) {
        this.moved = true;

        if(!this.moved)
        {
          
        }
        else
        {
        //    console.log(`pre:${this.prepoint_num}, ${this.findPos()}`)
            this.moveToTarget();
            return;
        }
        let point = new cc.Vec2(this.node.parent.position.x, this.node.parent.position.y);
        let distance = cc.Vec2.distance(this.target_point,point);
        if( distance <= 150)
        {
            if(distance <= 10)
            {
                this.unschedule(this.move);
         //       console.log("pre:",this.prepoint_num)
                this.target_point = cc.Vec2.ZERO;
                this.prepoint_num = this.nextindex - 1;
                this.nextindex = 0;
                this.is_move = false;
                this.moved = true;
                this.anim.play("samurai_stand");
                return;
            }

            let v:cc.Vec2 =  cc.Vec2.ZERO
             v.x = this.target_point.x  - point.x
             v.y = this.target_point.y - point.y
            
            v.normalizeSelf();

   ////         console.log( `target:${this.target_point.x},  ${this.target_point.y}`)
      //      console.log( `point:${point.x},  ${point.y}`)
      //      console.log( `v:${v.x}  ${v.y}`)
             let next_x = point.x + v.x * this.speed * this.addspeed;
            let next_y = point.y + v.y * this.speed * this.addspeed;
            this.node.parent.setPosition(next_x, next_y);
            return;
        }
            // if(this.nextindex >= this.road.length)
            // {
            //     let n = this.road.length;
            //     for(let i=0; i<n; i++)
            //     {
            //         this.road.pop();
            //     }
            //     this.target_point = cc.Vec2.ZERO;
            //     this.nextindex = 0;
            //     this.is_move = false;
            //     this.anim.play("samurai_stand");
            //     this.unschedule(this.startMove);
            //     return;
            // }

            let v: cc.Vec2 = cc.Vec2.ZERO;

              let   offset_y = this.road[this.nextindex].y - point.y;
              let   offset_x = this.road[this.nextindex].x - point.x
    
           
            if ((Math.abs(offset_x) <= 10) && (Math.abs(offset_y) <= 10)) {
    
                let clip: cc.AnimationClip[] = this.node.getComponent(cc.Animation).getClips();
        

                let x: number = 0;
                let y: number = 0;
    
                this.nextindex++;
                if(this.nextindex == this.road.length)
                {
                    return;
                }
                x = this.road[this.nextindex].x - this.road[this.nextindex - 1].x
                y = this.road[this.nextindex].y - this.road[this.nextindex - 1].y
    
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
            return;
    
    }

    moveToTarget()
    {
        let point = new cc.Vec2(this.node.parent.position.x, this.node.parent.position.y);
        let distance = cc.Vec2.distance(this.target_point,point);
        if( distance <= 110)
        {
            if(distance <= 10)
            {
                this.unschedule(this.move);
    //            console.log("pre:",this.prepoint_num)
                this.target_point = cc.Vec2.ZERO;
                this.nextindex = 0;
                this.is_move = false;
                this.anim.play("samurai_stand");
                return;
            }

            let v:cc.Vec2 =  cc.Vec2.ZERO
             v.x = this.target_point.x  - point.x
             v.y = this.target_point.y - point.y
            
            v.normalizeSelf();

           // console.log( `target:${this.target_point.x},  ${this.target_point.y}`)
          //  console.log( `point:${point.x},  ${point.y}`)
        //    console.log( `v:${v.x}  ${v.y}`)
             let next_x = point.x + v.x * this.speed * this.addspeed;
            let next_y = point.y + v.y * this.speed * this.addspeed;
            this.node.parent.setPosition(next_x, next_y);
            return;
        }

            let v: cc.Vec2 = cc.Vec2.ZERO;

              let   offset_y = this.hero_road[this.nextindex].y - point.y;
              let   offset_x = this.hero_road[this.nextindex].x - point.x
    
           
            if ((Math.abs(offset_x) <= 10) && (Math.abs(offset_y) <= 10)) {
    
                let clip: cc.AnimationClip[] = this.node.getComponent(cc.Animation).getClips();
        

                let x: number = 0;
                let y: number = 0;
    
                this.nextindex++;
                if(this.nextindex == this.hero_road.length)
                {
                    return;
                }
                x = this.hero_road[this.nextindex].x - this.hero_road[this.nextindex - 1].x
                y = this.hero_road[this.nextindex].y - this.hero_road[this.nextindex - 1].y
    
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
    
                x = this.hero_road[this.nextindex].x - point.x;
                y = this.hero_road[this.nextindex].y - point.y;
    
                v = new cc.Vec2(x, y);
            }
    
            v.normalizeSelf();
            let next_x = this.node.parent.position.x + v.x * this.speed * this.addspeed;
            let next_y = this.node.parent.position.y + v.y * this.speed * this.addspeed;
            this.node.parent.setPosition(next_x, next_y);
            return;
    }

    targetRoad()
    {
        let n = this.hero_road.length;
        for(let i = 0; i < n; i++)
        {
            this.hero_road.pop();
        }
        let i = this.findPos();

        if(i == this.prepoint_num)
        {
            this.hero_road.push(new cc.Vec2(this.node.parent.position.x,this.node.parent.position.y));
            this.hero_road.push(new cc.Vec2(this.target_point.x,this.target_point.y));
            this.nextindex = 0;
            return;
        }

        if(i > this.prepoint_num)
        {
            this.hero_road.push(new cc.Vec2(this.node.parent.position.x,this.node.parent.position.y));

            for(let j = this.prepoint_num; j <= i; j++)
            {
                this.hero_road.push(new cc.Vec2(this.road[j].x,this.road[j].y));
            }

            this.hero_road.push(new cc.Vec2(this.target_point.x,this.target_point.y));

            this.prepoint_num = i;
            this.nextindex = 0;
            return;
        }

        if(i < this.prepoint_num)
        {
            this.hero_road.push(new cc.Vec2(this.node.parent.position.x,this.node.parent.position.y));

            for(let j = this.prepoint_num; j > i; j--)
            {
                this.hero_road.push(new cc.Vec2(this.road[j].x,this.road[j].y));
            }

            this.hero_road.push(new cc.Vec2(this.target_point.x,this.target_point.y));

            this.prepoint_num = i + 1;
            this.nextindex = 0;
            return;
        }
    }
    //目标点
    findPos() {

        for (let i = 0; i < this.road.length - 1; i++) {
            let x = this.road[i + 1].x - this.road[i].x;
            let y = this.road[i + 1].y - this.road[i].y;

            let v = new cc.Vec2(x,y);
            v.normalizeSelf();

            let tag = new cc.Vec2(this.road[i].x,this.road[i].y);

            while(true)
            {
                tag.x += v.x * 10;
                tag.y += v.y * 10;

                let distance_target = cc.Vec2.distance(tag,this.target_point);

               // console.log(`x:${tag.x}, y:${tag.y},dis: ${distance_target}`)

                if(distance_target <= 110)
                {
                    return i;
                }

                let distance_next = cc.Vec2.distance(tag,this.road[i+1]);

                if(distance_next <= 10)
                {
                    break;
                }
            }
        }
    }

    attack(enemy:cc.Node)
    {
         if(!this.is_att && this.is_live)
         {
             this.node.getComponent(cc.AudioSource).play();
            this.is_att = true;
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
                this.hpBar.getComponent(cc.ProgressBar).progress = 0 ;
                this.anim.play("samurai_die");
                return;
            }

            this.hpBar.getComponent(cc.ProgressBar).progress = this.hp * 1.0 / this.max_hp;
            this.hpBar.active =true;
        }
    }

    die()
    {

        this.anim.stop();
        this.unschedule(this.move);
        this.node.parent.zIndex = 1;
        this.is_live = false;
        this.hpBar.parent.getComponent(cc.Toggle).interactable = false;
        this.target_point = cc.Vec2.ZERO;

        this.schedule(this.revie,1,cc.macro.REPEAT_FOREVER,1)
    }

    //回血
    revie(dt:number)
    {
        this.hp+=1;
        this.hpBar.getComponent(cc.ProgressBar).progress = this.hp * 1.0 / this.max_hp;
        if(this.hp == this.max_hp)
        {
            this.anim.play("samurai_stand")
            this.hpBar.parent.getComponent(cc.Toggle).interactable = true;
            this.is_live = true;
            this.is_att  = false;
            this.enemy = null;
            this.node.parent.zIndex = 15;

            this.unschedule(this.revie);
        }
    }
    onatt()
    {
        this.is_att = false;
        if(this.enemy)
        {
            let enemy:Enemy = this.enemy.getComponentInChildren("enemy-action");
            if(enemy.islive)
            {
                enemy.hurt(this.att)
                this.enemy = null;
                this.anim.play("samurai_stand")
            }
        }
    }

    update() {
        let tmp: LoadingBattel = this.node.parent.parent.getComponent("loadingBattel");
        if(tmp.present_hp <= 0)
        {
            this.unscheduleAllCallbacks();
            this.anim.stop();
        }
        if (tmp.speed != this.addspeed) {
            this.addspeed = tmp.speed;
            let clip: cc.AnimationClip[] = this.anim.getClips();
          
            for(let c of clip)
            {
                c.speed = this.speed + this.addspeed ;
            }
        }


    }
}
