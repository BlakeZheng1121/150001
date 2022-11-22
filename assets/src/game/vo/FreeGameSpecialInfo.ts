import { Vec3, _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('FreeGameSpecialInfo')
export class FreeGameSpecialInfo {
    public retrigger: Retrigger = new Retrigger();
    public hitBall: HitBall = new HitBall();
    public freeWild: FreeWild = new FreeWild();
    public isHitGrand: boolean = false;
}

export class Retrigger {
    public isRetrigger: Boolean = false;
    public addRound: number = 1;
    public timeKey_name = 'showTrigger';
    public timeOut = 3;
}

export class HitBall {
    public isShowHitBall: boolean = false;
    public sideCreditBall: Array<Array<number>> = new Array();
    public sideCreditBallPos: Array<Array<Vec3>> = new Array();
}

export class FreeWild {
    public isShowFreeWild: boolean = false;
    public multiplier: number = 2;
    public wildPos: Vec3;
    public timeKey_name = 'showWild';
    public timeOut = 3.5;
}
