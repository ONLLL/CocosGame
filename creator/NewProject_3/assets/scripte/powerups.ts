// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    gold:cc.Node = null;

    @property(cc.Node)
    ui_panel1:cc.Node = null;

    @property(cc.Node)
    ui_panel2:cc.Node = null;

    @property(cc.Node)
    ui_panel3:cc.Node = null;

   onClickPotion()
   {
        let gold = Number(localStorage.getItem("gold"));

        if(gold >= 50)
        {
            
            localStorage.setItem("prop_potion",(String(Number(localStorage.getItem("prop_potion")) + 1)));

            gold -= 50;

            localStorage.setItem("gold",String(gold));

            this.gold.getComponent(cc.Label).string = String(gold);
            this.node.getComponent(cc.AudioSource).play();
        }
   }

   onClickIce()
   {
        let gold = Number(localStorage.getItem("gold"));

        if(gold >= 100)
        {
            
            localStorage.setItem("prop_ice",(String(Number(localStorage.getItem("prop_ice")) + 1)));

            gold -= 100;

            localStorage.setItem("gold",String(gold));

            this.gold.getComponent(cc.Label).string = String(gold);
            this.node.getComponent(cc.AudioSource).play();
        }
   }

   onClickHoly()
   {
        let gold = Number(localStorage.getItem("gold"));

        if(gold >= 200)
        {
       
            localStorage.setItem("prop_holy",(String(Number(localStorage.getItem("prop_holy")) + 1)));

            gold -= 200;

            localStorage.setItem("gold",String(gold));

            this.gold.getComponent(cc.Label).string = String(gold);
            this.node.getComponent(cc.AudioSource).play();
        }
   }

   onClickPotionIconI()
   {
       this.ui_panel1.getChildByName("potion").active = !this.ui_panel1.getChildByName("potion").active;

       this.ui_panel1.getChildByName("detail").active =  !this.ui_panel1.getChildByName("detail").active;
   }

   onClickIceIconI()
   {
       this.ui_panel2.getChildByName("ice").active = !this.ui_panel2.getChildByName("ice").active;

       this.ui_panel2.getChildByName("detail").active =  !this.ui_panel2.getChildByName("detail").active;
   }

   onClickHolyIconI()
   {
       this.ui_panel3.getChildByName("holy").active = !this.ui_panel3.getChildByName("holy").active;

       this.ui_panel3.getChildByName("detail").active =  !this.ui_panel3.getChildByName("detail").active;
   }

}
