import { _decorator, Prefab, instantiate } from 'cc';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';
import { AudioManager } from '../../../audio/AudioManager';
import { AudioClipsEnum } from '../../vo/enum/SoundMap';
import { FreeGameSpecialInfo } from '../../vo/FreeGameSpecialInfo';
import { FreeC1SubOnPerform } from './free_c1sub_on_perform/FreeC1SubOnPerform';
import { Free_RetriggerBoard } from './Free_RetriggerBoard';
import BaseView from 'src/base/BaseView';
const { ccclass, property } = _decorator;

@ccclass('Game_2_SpecialView')
export class Game_2_SpecialView extends BaseView {
    @property(FreeC1SubOnPerform)
    private freeC1SubOnPerform: FreeC1SubOnPerform | null = null;

    @property(Prefab)
    private free_RetriggerBoard: Prefab | null = null;

    private onSpecialEndCallBack: Function = null;

    private onCollectCredit: Function = null;

    private freeGameSpecialInfo: FreeGameSpecialInfo;

    private language: string;

    public init(lang: string) {
        const self = this;

        self.language = lang;
    }

    private _freeRetriggerBoard: Free_RetriggerBoard | null = null;

    private get freeRetriggerBoard() {
        return this._freeRetriggerBoard.retriggerBoard;
    }

    public onLoad() {
        super.onLoad();
        let self = this;
        let retriggerBoard = instantiate(self.free_RetriggerBoard);

        retriggerBoard.parent = this.node;
        self._freeRetriggerBoard = retriggerBoard.getComponent(Free_RetriggerBoard);
    }

    //** 出現角落球 */
    public showSideBall(freeGameSpecialInfo: FreeGameSpecialInfo, isFormatBalance: boolean) {
        let self = this;
        self.freeGameSpecialInfo = freeGameSpecialInfo;
        if (freeGameSpecialInfo.hitBall.isShowHitBall) {
            self.freeC1SubOnPerform.showSideBall(
                self.freeGameSpecialInfo.hitBall.sideCreditBall,
                self.freeGameSpecialInfo.hitBall.sideCreditBallPos,
                isFormatBalance
            );
        }
    }

    //** show retriger board */
    public retriggerShow(addRound: number) {
        let self = this;
        self.freeRetriggerBoard?.play('Show');

        AudioManager.Instance.play(AudioClipsEnum[`FreeRetrigger_${self.language}`]);
    }

    //** 角落球特色打擊 */
    public showSideBallScore(onCollectCredit: Function, onSpecialEnd: Function) {
        let self = this;
        self.onSpecialEndCallBack = onSpecialEnd;
        self.onCollectCredit = onCollectCredit;
        if (self.freeGameSpecialInfo.hitBall.isShowHitBall) {
            self.freeC1SubOnPerform.showSideBallScore(
                self.onCollectCredit.bind(self),
                self.showHitSideBallEnd.bind(self)
            );
        } else {
            self.showHitSideBallEnd();
        }
    }

    private showHitSideBallEnd() {
        this.onSpecialEndCallBack();
        this.clearCallback();
    }

    private clearCallback() {
        this.onSpecialEndCallBack = null;
        this.onCollectCredit = null;
        this.freeGameSpecialInfo = new FreeGameSpecialInfo();
    }
}
