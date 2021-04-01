// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Hero from "./hero"
import SkillRole from "./skill_role"
import Enemy from "./enemy-action"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(Enemy)
    enemy:Enemy = null;

    onCollisionEnter(other)
    {
        if(other.node.group == "kitty")
        {
            this.enemy.hero == null
            this.enemy.att_role = other.node.parent;

            this.enemy.unscheduleAllCallbacks();
            let clip: cc.AnimationClip[] = this.enemy.anim.getClips();
            this.enemy.anim.play(clip[3].name)

            if(other.node.parent.x>this.node.parent.parent.x)
            {
                this.node.parent.scaleX = -1;
            }
            else
            {
                this.node.parent.scaleX = 1;
            }
        }

        if(other.node.group == "hero")
        {
            this.enemy.att_role == null
            this.enemy.hero = other.node.parent;

            this.enemy.unscheduleAllCallbacks();
            let clip: cc.AnimationClip[] = this.enemy.anim.getClips();
            this.enemy.anim.play(clip[3].name)

            if(other.node.parent.x>this.node.parent.parent.x)
            {
                this.node.parent.scaleX = -1;
            }
            else
            {
                this.node.parent.scaleX = 1;
            }
        }

    }


}
