// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export default class MapButton extends cc.Component {

  // LIFE-CYCLE CALLBACKS:
  @property(cc.Node)
  mask:cc.Node = null;

  //HeroRoom 界面
  @property(cc.Node)
  heroRoomBg: cc.Node = null;

  private heroRoomAnim: cc.Animation = null;

  //Powerups界面
  @property(cc.Node)
  powerups: cc.Node = null;

  private powerupsAnim: cc.Animation = null;

  private choice_lv:number = -1;

  //Shop界面
  @property(cc.Node)
  shop: cc.Node = null;

  private shopAnim: cc.Animation = null;

  //tower upgrades界面
  @property(cc.Node)
  tower: cc.Node = null;

  private towerAnim: cc.Animation = null;

  private choiceAnim:cc.Animation =null;

  @property(cc.Prefab)
  flag:cc.Prefab = null;

  private show:cc.Node = null;

  onLoad(){
  

    this.heroRoomAnim = this.heroRoomBg.getComponent(cc.Animation);

    this.powerupsAnim = this.powerups.getComponent(cc.Animation);

    this.shopAnim = this.shop.getComponent(cc.Animation);

    this.towerAnim = this.tower.getComponent(cc.Animation);

    this.choiceAnim = this.node.getChildByName("choose").getChildByName("show").getComponent(cc.Animation);

    this.show = this.node.getChildByName("choose").getChildByName("show")
    this.loadFlag();
  }

  start() {
    //this.anim = this.node.getComponent(cc.Animation);
    // this.heroRoom = this.getComponentInChildren('hero_room');

    //this.heroRoomBg = this.heroRoom.getComponentInChildren('bg');

  }

  loadFlag(){
    let tilemap = this.node.getComponent(cc.TiledMap);
    let group = tilemap.getObjectGroup("flag");
    let flagarr = group.getObjects();
    for(let i=0;i< flagarr.length;i++)
    {
      let value = flagarr[i];
      let f = cc.instantiate(this.flag);
      //f.parent = this.node;
      f.x = value['x'] - this.node.getContentSize().width / 2 ;
      f.y = value['y'] - this.node.getContentSize().height / 2 - 10;
      f.active = true;

      this.node.getChildByName("map").addChild(f);

      // f.setPosition(f.parent.convertToWorldSpace(f.getPosition()));

      f.name = String(value['name']);

    //  let handler = new cc.Component.EventHandler();

    //  handler.target = this.node;

    //  handler.component = "MapButton";

    //  handler.handler = "onClickFlag";

    //  let button:cc.Button = f.getComponent(cc.Button);

    //  button.clickEvents.push(handler);
     
    }
  }


  //返回按钮 返回主界面
  onClickBackButton() {
    
    cc.director.loadScene('StartScene');
  }

  //进入战斗界面
  onClickToBattel(){
  
    cc.director.loadScene('BattelScene');
  }

  //进入加载界面
  inLoadingScene(){
    cc.director.loadScene('LoadingScene');
  }

  //Hero Room 按钮
  onClickHeroRoomButton() {

    this.mask.active = !this.mask.active;
    console.log(this.heroRoomAnim.name);
    this.heroRoomBg.parent.active =true;
    this.heroRoomAnim.play('heroHomeAnim');

  }

  //powerups 按钮
  onClickPowerups() {
    this.mask.active = !this.mask.active;
    this.powerups.parent.active =true;
    this.powerupsAnim.play('powerupsAnim');

  }

  //Shop 按钮
  onClickShop() {
    this.mask.active = !this.mask.active;
    this.shop.parent.active = true;
    this.shopAnim.play('shopAnim');
  }

  //tower upgrades
  onClickTower() {
    this.mask.active = !this.mask.active;
    this.tower.parent.active =true;
    this.towerAnim.play('towerAnim');
  }

  onClickMask(){
    // if(this.show.parent.active){
    //   this.show.parent.active = false;
    // }

  }
}
