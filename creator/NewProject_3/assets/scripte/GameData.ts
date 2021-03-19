

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
    constructor(id:number,name:string,unlock:boolean,lv:number)
    {
        this.id = id;
        this.name = name;
        this.unlock = unlock;
        this.lv = lv;
    }
    id:number;
    name:string;
    unlock:boolean;
    lv:number;
}