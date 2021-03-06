// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private toggleContainer:cc.Node = null;

    private menu1:cc.Node = null;
    private menu2:cc.Node = null;
    private menu3:cc.Node = null;
    private menu4:cc.Node = null;
    private menu5:cc.Node = null;
    private menu6:cc.Node = null;

    private land:cc.Node = null;
    private hint:cc.Node = null;    
    private tower:cc.Node = null;
    private show:cc.Node =null;

    onLoad(){
        this.toggleContainer = this.node.getChildByName('toggleContainer');

        this.menu1 = this.toggleContainer.getChildByName('menu1');
        this.menu2 = this.toggleContainer.getChildByName('menu2');
        this.menu3 = this.toggleContainer.getChildByName('menu3');
        this.menu4 = this.toggleContainer.getChildByName('menu4');
        this.menu5 = this.toggleContainer.getChildByName('menu5');
        this.menu6 = this.toggleContainer.getChildByName('menu6');

        this.land = this.node.getChildByName('land');
        this.hint = this.node.getChildByName('hint_panel');
        this.tower = this.node.getChildByName('tower');
        this.show = this.node.getChildByName('show');


    }
    start () {
       
    }

    //点击基地
    onClickLand(){
       
        if(!this.toggleContainer.active)
        {
            this.toggleContainer.active = ! this.toggleContainer.active;
            this.toggleContainer.getComponent(cc.Animation).play('showWeaponAnim')
        }
        else
        {
            this.toggleContainer.getComponent(cc.Animation).play('showWeaponAnimRe')
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(function(){
            this.toggleContainer.active = ! this.toggleContainer.active;
            },this);
            this.toggleContainer.runAction(cc.sequence(act,callfunc));
        }
        
    }

    //建塔选择
    onClickMenu1(){
        if(!this.menu1.getComponent(cc.Toggle).isChecked)
        {
            this.toggleContainer.getComponent(cc.Animation).play('showWeaponAnimRe')
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(function(){
            this.toggleContainer.active = ! this.toggleContainer.active;
            },this);
            this.toggleContainer.runAction(cc.sequence(act,callfunc));


            let self = this;
            cc.resources.load('images/towers/minigun/1',cc.SpriteAtlas,function(err,atlas:cc.SpriteAtlas){
                let fram = atlas.getSpriteFrame('Archer-tower-L1-0001');
                self.tower.getComponent(cc.Sprite).spriteFrame = fram;
            });
            this.land.active =false;
            this.tower.active = true;
        }
    }

    onClickMenu2(){
        if(!this.menu2.getComponent(cc.Toggle).isChecked)
        {
            this.toggleContainer.getComponent(cc.Animation).play('showWeaponAnimRe')
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(function(){
            this.toggleContainer.active = ! this.toggleContainer.active;
            },this);
            this.toggleContainer.runAction(cc.sequence(act,callfunc));


            let self = this;
            cc.resources.load('images/towers/icegun/1',cc.SpriteAtlas,function(err,atlas:cc.SpriteAtlas){
                let fram = atlas.getSpriteFrame('Kitty-litter-tower-L1-0007');
                self.tower.getComponent(cc.Sprite).spriteFrame = fram;
            });
            this.land.active =false;
            this.tower.active = true;
        }
    }

    onClickMenu3(){
        
    }

    onClickMenu4(){
        
    }

    onClickMenu5(){
        
    }

    onClickMenu6(){


    //    let n = this.f(3);
    //    console.log(n);

    //    let arr = [4,50,6,20,1,-9,5];
    //    this.selectSort(arr);
    //    for(const i of arr){
    //        console.log(i);
    //    }

    //    this.nineTable();
    
    }

    /*
    f(n:number):number{
        if(n<=0){
            return 0;
        }
        if(n === 2 || n ===1)
        {
            return 1;
        }
        return this.f(n-1) + this.f(n-2);
    }

    selectSort(arr:number[]):void{
        for(let i:number = 0; i<arr.length -1;i++)
        {
            let min:number = i;
            for(let j:number = i; j<arr.length; j++)
            {
                if(arr[min] > arr[j])
                {
                    min = j;
                }
            }
            let tmp = arr[min];
            arr[min] = arr[i]
            arr[i] = tmp;
        }
    }

    nineTable():void{
        for(let i:number = 9; i>0;i--)
        {
            for(let j = 0; j<=i;j++)
            {
                console.log(i+'*',j+'=',i*j+ " ")
            }
            console.log('\n');
        }
    }

    sum(n:number):number{
        if(n % 2 ===0)
        {
            return this.sum(n-1) - 1.0/n;
        }
        else
        {
            return this.sum(n-1) + n;
        }
    }
    */

    //点击塔
    onClickTower(){
        if(!this.show.active)
        {
            this.show.active = ! this.show.active;
            this.show.getComponent(cc.Animation).play('clickTowerAnim')
        }
        else
        {
            this.show.getComponent(cc.Animation).play('clickTowerAnimRe')
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(function(){
            this.show.active = ! this.show.active;
            },this);
            this.show.runAction(cc.sequence(act,callfunc));
        }
    }

    onClickDelet(){
        
        if(!this.show.getChildByName('delete').getComponent(cc.Toggle).isChecked)
        {
            this.show.getComponent(cc.Animation).play('clickTowerAnimRe')
            let act = cc.delayTime(0.1);
            let callfunc = cc.callFunc(function(){
            this.show.active = ! this.show.active;
            },this);
            this.show.runAction(cc.sequence(act,callfunc));

            this.land.active =true;
            this.tower.active = false;
        }

        let rect  = new Rect(3,4);
       console.log(rect.area());
    }
}


class Rect {
    private _l:number;
    set l(l:number){
        this._l = l;
    }
    get l(){
        return this._l;
    }

    private _w:number;
    set w(l:number){
        this._l = w;
    }
    get w(){
        return this._w;
    }
    constructor(l:number,w:number){
        this._l = l;
        this._w = w;
    }
    area():number{
        return this._l * this._w;
    }
}