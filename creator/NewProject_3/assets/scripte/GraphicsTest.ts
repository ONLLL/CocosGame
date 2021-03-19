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
    graph:cc.Node = null;

    @property(cc.Prefab)
    ice:cc.Prefab = null;

    ice_w:number = 40;
    ice_h:number = 20;

    start_point:cc.Vec2 = cc.Vec2.ZERO;

    next_point:cc.Vec2 = cc.Vec2.ZERO;

    isDraw:boolean = false;

    isStart:boolean = false;
    start(){
        

        let temp = this.graph.getComponent(cc.Graphics);
        temp.moveTo(0,0);

        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            let point = event.getLocation();
          
            point = this.graph.convertToNodeSpace(point)

            this.start_point = new cc.Vec2(point.x,point.y);
            this.isStart = true;
       });

       this.node.on(cc.Node.EventType.TOUCH_MOVE,(event:cc.Event.EventTouch)=>{
           let point = event.getLocation();
           
            point = this.graph.convertToNodeSpace(point)

           // let w = Math.abs(point.x - this.start_point.x);
           // let h = Math.abs(point.y - this.start_point.y);

            // if(w >= this.ice_w || h >= this.ice_h)
            // {
            //     this.next_point =  new cc.Vec2(point.x,point.y);
            //     this.isDraw = true;
            // }
            this.next_point =  new cc.Vec2(point.x,point.y);
            this.isDraw = true;
       });

       this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{
            this.isStart = false;
       });
    }

    colorRed()
    {
        let temp = this.graph.getComponent(cc.Graphics);
        temp.strokeColor = cc.Color.RED;
    }
    colorGreen()
    {
        let temp = this.graph.getComponent(cc.Graphics);
        temp.strokeColor = cc.Color.GREEN;
    }
    colorBlue()
    {
        let temp = this.graph.getComponent(cc.Graphics);
        temp.strokeColor = cc.Color.BLUE;
    }


    update(){
        if(this.isDraw && this.isStart)
        {
            let temp = this.graph.getComponent(cc.Graphics);
            temp.moveTo(this.start_point.x,this.start_point.y);

            temp.lineTo(this.next_point.x,this.next_point.y);
            temp.stroke();

            // let image = cc.instantiate(this.ice);
            // this.node.addChild(image);
            // image.setPosition(this.next_point.x,this.next_point.y);

            this.start_point = this.next_point;
            this.isDraw = false;
        }
    }
}
