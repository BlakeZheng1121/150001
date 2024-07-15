import { _decorator } from 'cc';
import { SceneManager } from '../../core/utils/SceneManager';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { JackPotPerformControl } from '../../ta/jackpot-perform-control/JackPotPerformControl';
import { AudioManager } from '../../audio/AudioManager';
import { BallHitViewMediator } from '../mediator/BallHitViewMediator';
import { AudioClipsEnum } from '../vo/enum/SoundMap';
import { GameUIOrientationSetting } from '../vo/GameUIOrientationSetting';
import BaseView from 'src/base/BaseView';

const { ccclass, property } = _decorator;
@ccclass('BallHitView')
export class BallHitView extends BaseView {
    public callBack: BallHitViewMediator;
    @property(JackPotPerformControl)
    private jackPotPerformControl: JackPotPerformControl;

    public baseGameIdle() {
        this.jackPotPerformControl.baseIdle();
    }

    public fadeInBaseGameIdle() {
        this.jackPotPerformControl.fadeInBaseIdle();
    }

    public freeGameIdle() {
        this.jackPotPerformControl.freeIdle();
    }

    public ballHitShow(hitInfo) {
        AudioManager.Instance.stop(AudioClipsEnum.Base_C1Collect);
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
                    if (ballCount < 6) {
                        AudioManager.Instance.stop(AudioClipsEnum.Base_C1CollectHit);
                        AudioManager.Instance.play(AudioClipsEnum.Base_C1CollectHit);
                    } else {
                        AudioManager.Instance.play(AudioClipsEnum.Base_C1CollectHitAlarm);
                    }
                },
                this
            )
            .start();
    }

    //** 清除前一把C1打擊所觸發的魔燈動畫 */
    public ballHitClearShowOnBase() {
        this.jackPotPerformControl.ClearBaseTrailSchedule();
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
                        AudioManager.Instance.stop(AudioClipsEnum.DragonUp_C2Collect);
                        AudioManager.Instance.play(AudioClipsEnum.DragonUp_C2Collect);
                    }
                },
                this
            )
            .start();
        GlobalTimer.getInstance()
            .registerTimer(
                'setBallCredit' + index,
                trailDelayTime + 0.4,
                () => {
                    GlobalTimer.getInstance().removeTimer('setBallCredit' + index);
                    this.setBallCredit(score, playType);
                    if (playType == 1) {
                        AudioManager.Instance.play(AudioClipsEnum.Free_C1CollectHit);
                        this.setFreeGameBallHit();
                    } else {
                        let soundName: string = AudioClipsEnum.DragonUp_C2CollectHit01;
                        soundName = soundName.slice(0, soundName.length - 2);
                        if (sequenceId > 0) {
                            soundName += this.prefixInteger(sequenceId, 2);
                        } else {
                            soundName += 'Last';
                        }
                        AudioManager.Instance.play(soundName);
                        this.setHoldAndWinBallHit();
                    }
                },
                this
            )
            .start();
    }

    public setFreeGameBallHit() {
        this.jackPotPerformControl.OnFreeGameBallHit();
    }

    public setHoldAndWinBallHit() {
        this.jackPotPerformControl.OnHoldAndWinBallHit();
    }

    public setBallCredit(score: string, playType: number) {
        this.jackPotPerformControl.OnScoreCollect(score, playType);
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
        this.freeGameIdle();
    }

    // Base game 轉 Mini game
    public miniGameTransition() {
        AudioManager.Instance.play(AudioClipsEnum.JP_Slogan);
        AudioManager.Instance.play(AudioClipsEnum.Mini_DrangonBallFall);
        this.jackPotPerformControl.JackPotHit();
        GlobalTimer.getInstance().removeTimer('ballTransition');
        GlobalTimer.getInstance()
            .registerTimer(
                'ballTransition',
                7,
                () => {
                    GlobalTimer.getInstance().removeTimer('ballTransition');
                    this.callBack.finishBallTransition();
                },
                this
            )
            .start();
    }

    public miniGameRecovery() {
        this.jackPotPerformControl.fallImmediately();
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
