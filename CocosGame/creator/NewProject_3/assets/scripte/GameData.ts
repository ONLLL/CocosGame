

export class MapMessege{
    constructor(lv:number,is_finish:boolean,normal_star:number,hard_star:number)
    {
        this.lv = lv;
        this.is_finish = is_finish;
        this.normal_star = normal_star;
        this.hard_star = hard_star;
    }
    lv:number;
    is_finish:boolean;
    normal_star:number;
    hard_star:number;
}

export class LocalTowerMessege
{
    constructor(id:number,name:string,unlock:boolean,lv:number,maxlv:number)
    {
        this.id = id;
        this.name = name;
        this.unlock = unlock;
        this.lv = lv;
        this.max_lv = maxlv;
    }
    id:number;
    name:string;
    unlock:boolean;
    lv:number;
    max_lv:number;
}

export class HeroMessege
{
    constructor(id:number,name:string,unlock:boolean,lv:number,skill:number[])
    {
        this.id = id;
        this.name = name;
        this.unlock = unlock;
        this.lv = lv;
        this.skill = skill;
    }
    id:number;
    name:string;
    unlock:boolean;
    lv:number;
    skill:number[];
}

export const HeroState =  cc.Enum({
    Stand:0,
    Down: 1,
    Up:2,
    Left:3,
    Attack:4,
    Die:5,
    Right:6,
});