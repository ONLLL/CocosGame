// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyAction extends cc.Component {

    private road: cc.Vec2[] = [];

    private nextpoint: number = 0;

    speed: number = 3;

    hp:number = 20;

    setRoad(road: cc.Vec2[]) {

        let num = Math.floor(Math.random() * 10 * 2);

        if (Math.ceil(Math.random() * 10) > 5) {
            num = -num;
        }

        let x = road[0].x - road[1].x;
        let y = road[0].y - road[1].y;

        if (Math.abs(x) > 30) {
            for (let i = 0; i < road.length; i++) {
                this.road.push(new cc.Vec2(road[i].x,road[i].y + num));
            }
        } else if (Math.abs(y) > 30) {
            for (let i = 0; i < road.length; i++) {
                this.road.push(new cc.Vec2(road[i].x + num,road[i].y));
            }
        }

        this.node.setPosition(this.road[0]);
    }



    startMove() {
        this.schedule(() => {
            this.move();
        }, 0.1);
    }

    move() {
        let point = new cc.Vec2(this.node.position.x, this.node.position.y);

        let v: cc.Vec2 = cc.Vec2.ZERO;

        let offset_y = this.road[this.nextpoint].y - point.y;
        let offset_x = this.road[this.nextpoint].x - point.x
        if ((offset_x <= 10 && offset_x >= -10) && (offset_y <= 10 && offset_y >= -10)) {
            let anim = this.node.getComponent(cc.Animation);
            let clip: cc.AnimationClip[] = this.node.getComponent(cc.Animation).getClips();

            this.nextpoint++;

            let x = this.road[this.nextpoint].x - this.road[this.nextpoint - 1].x
            let y = this.road[this.nextpoint].y - this.road[this.nextpoint - 1].y

            if (x > 30) {
                anim.play(clip[2].name);
                this.node.scaleX = -1;
            }
            else if (x < -30) {
                anim.play(clip[2].name);
                this.node.scaleX = 1;
            }
            else if (y > 30) {
                anim.play(clip[1].name);
                this.node.scaleX = 1;
            }
            else if (y < -30) {
                anim.play(clip[0].name);
                this.node.scaleX = 1;
            }


        }
        else {
            let x = this.road[this.nextpoint].x - this.road[this.nextpoint - 1].x;
            let y = this.road[this.nextpoint].y - this.road[this.nextpoint - 1].y;
            v = new cc.Vec2(x, y);
        }

        v.normalizeSelf();
        let next_x = this.node.position.x + v.x * this.speed;
        let next_y = this.node.position.y + v.y * this.speed;
        this.node.setPosition(next_x, next_y);
    }

}
