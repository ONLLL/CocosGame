
import BaseCreate from "./base-create"
import Enemy from "./enemy-action";
import Bullet from  "./bullet"

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    arrow_prefab:cc.Prefab = null;

    @property(cc.Prefab)
    fire_prefab:cc.Prefab = null;

    @property(cc.Node)
    bullet_point:cc.Node = null;

    bullet:cc.Node = null;

    anim:cc.Animation = null;

    tower:BaseCreate = null;

    enemy:cc.Node =null;

    private m_speed:number = 1;

    iceArr:cc.Node[] = [];
    onLoad()
    {
        this.tower = this.node.parent.getComponent("base-create");

        this.anim = this.node.getComponent(cc.Animation);

      
    }

    //创建子弹 箭
    arrowBullet()
    {
        switch(this.tower.tower_lv)
        {
            case 1:
                cc.resources.load("prefab/arrow",cc.Prefab,(err:Error,prefab:cc.Prefab)=>{
                    let arrow = cc.instantiate(prefab);
                    this.node.parent.parent.addChild(arrow,0)
                
                    //let point = this.node.parent.getPosition();
        
                    // switch(this.tower.tower_dir)
                    // {
                    //     case 0:
        
                    //         break;
                    //     case 1: //left_down
                    //         point.x += -25;
                    //         point.y += 97;
                    //         break;
                    //     case 2: //right_down
                    //         point.x += 50;
                    //         point.y += 92;
                    //         break;
                    //     case 3: //left_up
                    //         point.x += -28;
                    //         point.y += 129;
                    //         break;
                    //     case 4: //right_up
                    //         point.x += 35;
                    //         point.y += 129;
                    //         break;
                    //     default:
                    //         break;
                    // }
        
                    let point = this.bullet_point.getPosition();
                    point = this.node.convertToWorldSpaceAR(point);
                    point = this.node.parent.parent.convertToNodeSpaceAR(point);

                    arrow.setPosition(point);
        
                    arrow.zIndex = this.node.parent.zIndex + 2;
        
                    let enemy_point = this.tower.enemy.getPosition();
        
                    let p = enemy_point.sub(point);
        
                    let angle = p.signAngle( new cc.Vec2(0,1));
        
                    arrow.setRotation(-90 + angle * 180 / 3.1415926);
        
                    this.enemy = this.tower.enemy;
                    let enemy:Enemy = this.tower.enemy.getComponentInChildren("enemy-action");
                    //    enemy.startFire();
                     let callfunc_2 = cc.callFunc(()=>{
                            enemy.hurt(this.tower.att);
                            arrow.destroy();
                     });
        
                    let seq = cc.sequence(cc.moveBy(0.1 ,enemy_point.sub(point)),callfunc_2);
                    
                    arrow.runAction(seq);
                });
            break;
            case 2:
                cc.resources.load("prefab/arrow",cc.Prefab,(err:Error,prefab:cc.Prefab)=>{
                    let arrow = cc.instantiate(prefab);
                    this.node.parent.parent.addChild(arrow,0)
                
                    let point = this.bullet_point.getPosition();
                    point = this.node.convertToWorldSpaceAR(point);
                    point = this.node.parent.parent.convertToNodeSpaceAR(point);
                    point.x -= 20;
                    arrow.setPosition(point);
        
                    arrow.zIndex = this.node.parent.zIndex + 2;
        
                    let enemy_point = this.tower.enemy.getPosition();
        
                    let p = enemy_point.sub(point);
        
                    let angle = p.signAngle( new cc.Vec2(0,1));
        
                    arrow.setRotation(-90 + angle * 180 / 3.1415926);
        
                    this.enemy = this.tower.enemy;
                    let enemy:Enemy = this.tower.enemy.getComponentInChildren("enemy-action");
                    //    enemy.startFire();
                     let callfunc_2 = cc.callFunc(()=>{
                            enemy.hurt(this.tower.att);
                            arrow.destroy();
                     });
        
                    let seq = cc.sequence(cc.moveBy(0.1 ,enemy_point.sub(point)),callfunc_2);
                    
                    arrow.runAction(seq);
                })

                cc.resources.load("prefab/arrow",cc.Prefab,(err:Error,prefab:cc.Prefab)=>{
                    let arrow = cc.instantiate(prefab);
                    this.node.parent.parent.addChild(arrow,0)
                
                    let point = this.bullet_point.getPosition();
                    point = this.node.convertToWorldSpaceAR(point);
                    point = this.node.parent.parent.convertToNodeSpaceAR(point);
                    point.x += 20;

                    arrow.setPosition(point);
        
                    arrow.zIndex = this.node.parent.zIndex + 2;
        
                    let enemy_point = this.tower.enemy.getPosition();
        
                    let p = enemy_point.sub(point);
        
                    let angle = p.signAngle( new cc.Vec2(0,1));
        
                    arrow.setRotation(-90 + angle * 180 / 3.1415926);
        
                    this.enemy = this.tower.enemy;
                    let enemy:Enemy = this.tower.enemy.getComponentInChildren("enemy-action");
                    //    enemy.startFire();
                     let callfunc_2 = cc.callFunc(()=>{
                            enemy.hurt(this.tower.att);
                            arrow.destroy();
                     });
        
                    let seq = cc.sequence(cc.moveBy(0.1 ,enemy_point.sub(point)),callfunc_2);
                    
                    arrow.runAction(seq);
                })
            break;
            case 3:

            break;
            case 4:

            break;
            case 5:

            break;
        }
      
    }

    //创建子弹  kitt
    kittBullet(){
        cc.resources.load("prefab/bullet_ice",cc.Prefab,(err:Error,prefab:cc.Prefab)=>{
            let ice = cc.instantiate(prefab);
            ice.parent = this.node.parent.parent;
            ice.getComponent(cc.PolygonCollider).enabled = true;
            let bullet:Bullet = ice.getComponent("bullet");
            bullet.harm = this.tower.att;

            let point = this.node.parent.getPosition();
            point.y += 95;
            ice.setPosition(point);
            ice.zIndex = this.node.parent.zIndex + 2;
    
            let enemy_point = this.tower.enemy.getPosition();
    
            let p = enemy_point.sub(point);
    
            let angle = p.signAngle( new cc.Vec2(0,1));
    
            ice.setRotation(-90 + angle * 180 / 3.1415926);
    
            this.enemy = this.tower.enemy;
            let enemy:Enemy = this.tower.enemy.getComponentInChildren("enemy-action");
            //    enemy.startFire();
            let act1 = cc.delayTime(1);
            let callfunc_2 = cc.callFunc(()=>{
                ice.destroy();
            });
            let seq = cc.sequence(cc.moveBy(0.05 ,enemy_point.sub(point)),act1,callfunc_2)
            ice.runAction(seq);
            });
    }

    //创建子弹  ball
    ballBullte()
    {
        cc.resources.load("prefab/bullet_ball",cc.Prefab,(err:Error,prefab:cc.Prefab)=>{
            let ball = cc.instantiate(prefab);
            ball.parent = this.node.parent.parent;
           
            let point = this.node.parent.getPosition();
            point.y += 95;
            ball.setPosition(point);
    
            let enemy_point = this.tower.enemy.getPosition();
    
            let p = enemy_point.sub(point);
    
            let w = cc.Vec2.distance(enemy_point,point);
            ball.width = w;
            ball.getComponent(cc.Animation).play();

            let angle = p.signAngle( new cc.Vec2(0,1));
    
            ball.setRotation(-90 + angle * 180 / 3.1415926);
    
            this.enemy = this.tower.enemy;
            let enemy:Enemy = this.tower.enemy.getComponentInChildren("enemy-action");
            //    enemy.startFire();
            let act1 = cc.delayTime(0.5);
            let callfunc_2 = cc.callFunc(()=>{
                enemy.hurt(this.tower.att);
                ball.destroy();
            });
            let seq = cc.sequence(act1,callfunc_2)
            ball.runAction(seq);
            });
    }

    //创建子弹  magic
    magicBullet()
    {
        cc.resources.load("prefab/bullet_magic",cc.Prefab,(err:Error,prefab:cc.Prefab)=>{
            let magic = cc.instantiate(prefab);
            magic.parent = this.node.parent.parent;
           
            let point = this.bullet_point.getPosition();
            point = this.node.convertToWorldSpaceAR(point);
            point = this.node.parent.parent.convertToNodeSpaceAR(point);

            magic.setPosition(point);
            magic.zIndex = 21;
    
            let enemy_point = this.tower.enemy.getPosition();
    
            let p = enemy_point.sub(point);
    
            let w = cc.Vec2.distance(enemy_point,point);
            magic.width = w;
            magic.getComponent(cc.Animation).play();

            let angle = p.signAngle( new cc.Vec2(0,1));
    
            magic.setRotation(-90 + angle * 180 / 3.1415926);
    
            this.enemy = this.tower.enemy;
            let enemy:Enemy = this.tower.enemy.getComponentInChildren("enemy-action");
            //    enemy.startFire();
            let act1 = cc.delayTime(0.5);
            let callfunc_2 = cc.callFunc(()=>{
                enemy.hurt(this.tower.att);
                magic.destroy();
            });
            let seq = cc.sequence(act1,callfunc_2)
            magic.runAction(seq);
            });
    }

    //创建子弹  fire
    fireBullet()
    {
        cc.resources.load("prefab/bullet_fire",cc.Prefab,(err:Error,prefab:cc.Prefab)=>{
        let fire = cc.instantiate(prefab);
        fire.parent = this.node.parent.parent;
        fire.getComponent(cc.PolygonCollider).enabled = true;
        let point = this.node.parent.getPosition();
        point.y += 95;
        fire.setPosition(point);
        fire.zIndex = this.node.parent.zIndex + 2;

        let enemy_point = this.tower.enemy.getPosition();

        let p = enemy_point.sub(point);
        
        let angle = p.signAngle( new cc.Vec2(0,1));

        fire.setRotation(-90 + angle * 180 / 3.1415926);

        this.enemy = this.tower.enemy;
        let enemy:Enemy = this.tower.enemy.getComponentInChildren("enemy-action");
        //    enemy.startFire();
        let act1 = cc.delayTime(1);
        let callfunc_2 = cc.callFunc(()=>{
            fire.destroy();
        });
        let seq = cc.sequence(cc.moveBy(0.05 ,enemy_point.sub(point)),act1,callfunc_2)
        fire.runAction(seq);
        });
    }

    //创建子弹  laser
    laserButtel()
    {
        cc.resources.load("prefab/bullet_laser",cc.Prefab,(err:Error,prefab:cc.Prefab)=>{
            let laser = cc.instantiate(prefab);
            laser.parent = this.node.parent.parent;
           
            let point = this.node.parent.getPosition();
            point.y += 95;
            laser.setPosition(point);
    
            let enemy_point = this.tower.enemy.getPosition();
    
            let p = enemy_point.sub(point);
    
            let w = cc.Vec2.distance(enemy_point,point);
            laser.width = w;

            let angle = p.signAngle( new cc.Vec2(0,1));
    
            laser.setRotation(-90 + angle * 180 / 3.1415926);
    
            this.enemy = this.tower.enemy;
            let enemy:Enemy = this.tower.enemy.getComponentInChildren("enemy-action");
            //    enemy.startFire();
            let act1 = cc.delayTime(0.3);
            let callfunc_2 = cc.callFunc(()=>{
                enemy.hurt(this.tower.att);
                laser.destroy();
            });
            let seq = cc.sequence(act1,callfunc_2)
            laser.runAction(seq);
            });
    }
    
    //动画回调
    onAnimationFinished()
    {
    //    console.log("动画事件");
        this.tower.node.getComponent(cc.AudioSource).clip = this.tower.att_sound;
        this.tower.node.getComponent(cc.AudioSource).play();
        
        let enemy:Enemy = this.tower.enemy.getComponentInChildren("enemy-action");
        if(enemy.islive)
        {
  //          console.log(this.tower.choice_tower_id)
           switch(this.tower.choice_tower_id)
           {
               case 1:
                   this.arrowBullet();
                   break;
               case 2:
                   this.kittBullet();
                   break;
               case 3:
                   this.ballBullte();
                   break;
               case 4:
                   this.magicBullet();
                   break;
               case 5:
                   this.fireBullet();
                   break;
               case 6:
                   this.laserButtel();
                   break;
           }
        }
        else
        {
            this.tower.is_attack =false;
        }

    }

    animCallFunc(event:cc.Event.EventCustom)
    {
        this.anim.stop();

        this.anim.off(cc.Animation.EventType.FINISHED,this.animCallFunc)
    }
    

    //销毁子弹
    stopAnim()
    {
        this.anim.stop();
    }

}
