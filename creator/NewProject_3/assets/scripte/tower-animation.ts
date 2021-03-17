
import BaseCreate from "./base-create"
import Enemy from "./enemy-action";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    arrow:cc.Prefab = null;

    anim:cc.Animation = null;

    tower:BaseCreate = null;

    enemy:cc.Node =null;

    private m_speed:number = 1;
    onLoad()
    {
        this.tower = this.node.parent.getComponent("base-create");

        this.anim = this.node.getComponent(cc.Animation);
    }

    //创建子弹 箭
    createArrow()
    {
        cc.resources.load("prefab/arrow",cc.Prefab,(err:Error,prefab:cc.Prefab)=>{
            let arrow = cc.instantiate(prefab);
            arrow.parent = this.node.parent.parent;
            let point = this.node.parent.getPosition();
            point.y += 95;
            arrow.setPosition(point);
            arrow.zIndex = this.node.parent.zIndex + 2;

            let enemy_point = this.tower.enemy.getPosition();

            let p = enemy_point.sub(point);

            let angle = p.signAngle( new cc.Vec2(0,1));

            arrow.setRotation(-90 + angle * 180 / 3.1415926);

            this.enemy = this.tower.enemy;

             let callfunc_2 = cc.callFunc(()=>{
                    let enemy:Enemy = this.tower.enemy.getComponent("enemy-action");
                    enemy.hurt(this.tower.att);
                    arrow.destroy();
             });

            let seq = cc.sequence(cc.moveBy(0.1 ,enemy_point.sub(point)),callfunc_2);
            
            arrow.runAction(seq);
        })
    }


    //创建子弹  kitt
    kittyBullte()
    {

    }
    
    //动画回调
    onAnimationFinished()
    {
        console.log("动画回调");
        let enemy:Enemy = this.tower.enemy.getComponent("enemy-action");
        if(enemy.islive)
        {
            this.createArrow();
        }
        else
        {
            this.tower.is_attack =false;
        }

        if(this.tower.is_attack == false)
        {
            this.anim.stop();
            return;
        }
    }
}
