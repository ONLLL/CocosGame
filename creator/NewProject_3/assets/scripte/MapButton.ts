// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

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

  //Shop界面
  @property(cc.Node)
  shop: cc.Node = null;

  private shopAnim: cc.Animation = null;

  //tower upgrades界面
  @property(cc.Node)
  tower: cc.Node = null;

  private towerAnim: cc.Animation = null;
  start() {
    //this.anim = this.node.getComponent(cc.Animation);
    // this.heroRoom = this.getComponentInChildren('hero_room');

    //this.heroRoomBg = this.heroRoom.getComponentInChildren('bg');

    this.heroRoomAnim = this.heroRoomBg.getComponent(cc.Animation);

    this.powerupsAnim = this.powerups.getComponent(cc.Animation);

     this.shopAnim = this.shop.getComponent(cc.Animation);

     this.towerAnim = this.tower.getComponent(cc.Animation);

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
    this.heroRoomAnim.play('heroHomeAnim');

  }

  //powerups 按钮
  onClickPowerups() {
    this.mask.active = !this.mask.active;
    this.powerupsAnim.play('powerupsAnim');
  }

  //Shop 按钮
  onClickShop() {
    this.mask.active = !this.mask.active;
    this.shopAnim.play('shopAnim');
  }

  //tower upgrades
  onClickTower() {
    this.mask.active = !this.mask.active;
    this.towerAnim.play('towerAnim');
  }
}
