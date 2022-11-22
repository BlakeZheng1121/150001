import { Label, _decorator } from 'cc';
import { BaseScene } from '../../base/BaseScene';
import { SceneManager } from '../../core/utils/SceneManager';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { JackPotPerformControl } from '../../ta/jackpot-perform-control/JackPotPerformControl';
import { AudioManager } from '../../ta/tool/AudioManager';
import { BallHitViewMediator } from '../mediator/BallHitViewMediator';
import { AudioClipsEnum, BGMClipsEnum } from '../vo/enum/SoundMap';
import { GameUIOrientationSetting } from '../vo/GameUIOrientationSetting';

const { ccclass, property } = _decorator;
@ccclass('BallHitView')
export class BallHitView extends BaseScene {
    public callBack: BallHitViewMediator;
    @property(JackPotPerformControl)
    private jackPotPerformControl: JackPotPerformControl;

    public ballInit() {
        this.jackPotPerformControl.DragonBallInit();
    }

    public ballBaseGameIdle() {
        this.jackPotPerformControl.DragonBallBaseIdle();
    }

    public ballFreeGameIdle() {
        this.jackPotPerformControl.DragonBallFreeIdle();
    }

    public holdSpinIdle() {
        this.jackPotPerformControl.holdSpinIdle();
    }

    /*public dragonInit() {
        this.jackPotPerformControl.DragonCoinInit();
    }*/

    public ballHitShow(hitInfo) {
        AudioManager.Instance.play(AudioClipsEnum.Base_C1Collect);
        let ballCount = 0;
        for (let i = 0; i < hitInfo.ballScreenLabel.length; i++) {
            for (let j = 0; j < hitInfo.ballScreenLabel[i].length; j++) {
                if (hitInfo.ballScreenLabel[i][j] > 0) {
                    ballCount++;
                    this.jackPotPerformControl.BaseTrailPerform(Number(i * 3 + j));
                }
            }
        }
        GlobalTimer.getInstance().removeTimer('ballHitShow');
        GlobalTimer.getInstance()
            .registerTimer(
                'ballHitShow',
                0.7,
                () => {
                    GlobalTimer.getInstance().removeTimer('ballHitShow');
                    AudioManager.Instance.play(AudioClipsEnum.Base_C1CollectHit);
                    if (ballCount >= 6) {
                        AudioManager.Instance.play(AudioClipsEnum.Base_C1CollectHitAlarm);
                    }
                },
                this
            )
            .start();
    }

    //** 結算分數加總 表演*/
    public ballScoreSumShow() {
        this.jackPotPerformControl.dragonBallScoreSumShow();
    }

    /**
     * Free Game / Dragon Up 收集分數球的表演
     * @param index             球在輪帶上的索引
     * @param score             顯示在龍珠的分數
     * @param playType          打擊動畫的編號
     * @param trailDelayTime    發射拖尾的延遲時間
     * @param sequenceId        收集球的順序 (Dragon Up用)
     */
    public performTrailOnBall(
        index: number,
        score: string,
        playType: number,
        trailDelayTime: number,
        gameScene: GameScene,
        sequenceId?: number
    ) {
        GlobalTimer.getInstance()
            .registerTimer(
                'performTrail' + index,
                trailDelayTime,
                () => {
                    GlobalTimer.getInstance().removeTimer('performTrail' + index);
                    this.jackPotPerformControl.FreeTrailPerform(index);
                    if (playType == 1) {
                        AudioManager.Instance.play(AudioClipsEnum.Free_C1Collect);
                    } else {
                        AudioManager.Instance.play(AudioClipsEnum.DragonUp_C2Collect);
                    }
                },
                this
            )
            .start();
        GlobalTimer.getInstance()
            .registerTimer(
                'setBallCredit' + index,
                trailDelayTime + 0.2,
                () => {
                    GlobalTimer.getInstance().removeTimer('setBallCredit' + index);
                    this.setBallCredit(score, playType, gameScene);
                },
                this
            )
            .start();
    }

    public setBallCredit(score: string, playType: number, gameScene: GameScene) {
        this.jackPotPerformControl.OnScoreCollect(score, playType, gameScene);
    }

    public hideBallCredit() {
        this.jackPotPerformControl.OnScoreCollect('', 3);
    }

    public showBallCountInfo(count: string) {
        this.jackPotPerformControl.showBallCountInfo(count);
    }

    public hideBallCountInfo() {
        this.jackPotPerformControl.hideBallCountInfo();
    }

    // Base game 轉 Free game
    public freeGameTransition() {
        //this.jackPotPerformControl.DragonCoinHide();
    }

    // Base game 轉 Mini game
    public miniGameTransition() {
        AudioManager.Instance.stop(BGMClipsEnum.BGM_Base).fade(0, 0.5);
        AudioManager.Instance.play(AudioClipsEnum.Mini_GemFall);
        this.jackPotPerformControl.JackPotHit();
        GlobalTimer.getInstance().removeTimer('ballTransition');
        GlobalTimer.getInstance()
            .registerTimer(
                'ballTransition',
                5.6,
                () => {
                    GlobalTimer.getInstance().removeTimer('ballTransition');
                    this.callBack.finishBallTransition();
                },
                this
            )
            .start();
    }

    public miniGameRecovery() {
        this.jackPotPerformControl.DragonBallFallImmediately();
    }

    // 數字左邊補零
    private prefixInteger(num: number, length: number): any {
        return (Array(length).join('0') + num).slice(-length);
    }

    // 直橫式轉換

    private _uiOrientation: Array<GameUIOrientationSetting> | null = null;

    private get uiOrientation() {
        if (this._uiOrientation == null) {
            this._uiOrientation = this.getComponentsInChildren(GameUIOrientationSetting);
        }
        return this._uiOrientation;
    }

    public changeOrientation(orientation: string, scene: string) {
        let isHorizontal = orientation == SceneManager.EV_ORIENTATION_HORIZONTAL;
        for (let i = 0; i < this.uiOrientation.length; i++) {
            this.uiOrientation[i].changeOrientation(isHorizontal, scene);
        }
    }
}
