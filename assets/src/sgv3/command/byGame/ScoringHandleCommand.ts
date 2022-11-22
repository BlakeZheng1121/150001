import { _decorator } from 'cc';
import { AudioClipsEnum, QuickScoringDuration, ScoringClipsEnum } from '../../../game/vo/enum/SoundMap';
import { AudioManager } from '../../../ta/tool/AudioManager';
import { GameDataProxy } from '../../proxy/GameDataProxy';
import { ReelDataProxy } from '../../proxy/ReelDataProxy';
import { WinEvent } from '../../util/Constant';
import { GlobalTimer } from '../../util/GlobalTimer';
import { GameScene } from '../../vo/data/GameScene';
import { WinBoardState } from '../../vo/enum/WinBoardState';
import { WinType } from '../../vo/enum/WinType';
import { FreeGameOneRoundResult } from '../../vo/result/FreeGameOneRoundResult';
const { ccclass } = _decorator;

@ccclass('ScoringHandleCommand')
export class ScoringHandleCommand extends puremvc.SimpleCommand {
    public static NAME: string = 'ScoringHandleCommand';
    protected timerKey: string = 'scoringTimer';

    // 記錄該把總贏分
    protected finalWinAmount: number = 0;
    protected finalWinBoardAmount: number = 0;
    protected finalWinType: WinType = WinType.none;
    protected finalScoringTime: number = 0;

    public execute(notification: puremvc.INotification): void {
        if (this.gameDataProxy.scrollingWinLabel == false) {
            this.gameDataProxy.scrollingWinLabel = true;
            this.gameDataProxy.runWinComplete = false;
            this.gameDataProxy.scrollingEndPlayed = false;
            this.handleScoring();
        }
    }

    private handleScoring() {
        let startAmount: number = 0;
        let targetAmount: number;
        let winBoardTargetAmount: number;
        let winType: WinType = WinType.none;
        let scoringTime: number;

        if (this.gameDataProxy.curScene == GameScene.Game_2) {
            let freeGameResult = this.gameDataProxy.curRoundResult as FreeGameOneRoundResult;
            if (!!freeGameResult.displayLogicInfo) {
                startAmount = this.gameDataProxy.convertCredit2Cash(
                    freeGameResult.displayLogicInfo.beforeAccumulateWinWithBaseGameWin
                );
                targetAmount = this.gameDataProxy.convertCredit2Cash(
                    freeGameResult.displayLogicInfo.afterAccumulateWinWithBaseGameWin
                );
                winType = this.gameDataProxy.curRoundResult.displayInfo.winType;
                scoringTime = this.gameDataProxy.curRoundResult.displayInfo.scoringTime;
                winBoardTargetAmount = this.gameDataProxy.convertCredit2Cash(
                    (this.gameDataProxy.curRoundResult as FreeGameOneRoundResult).playerWin
                );
            }
        } else if (this.gameDataProxy.afterGame2) {
            targetAmount = this.gameDataProxy.totalWinAmount;
            winType = this.gameDataProxy.totalWinType;
            scoringTime = this.gameDataProxy.totalScoringTime;
            winBoardTargetAmount = targetAmount;
        } else {
            targetAmount = this.gameDataProxy.convertCredit2Cash(
                this.gameDataProxy.curRoundResult.waysGameResult.playerWin
            );
            winType = this.gameDataProxy.curRoundResult.displayInfo.winType;
            scoringTime = this.gameDataProxy.curRoundResult.displayInfo.scoringTime;
            winBoardTargetAmount = targetAmount;
        }
        this.finalWinAmount = targetAmount;
        this.finalWinBoardAmount = winBoardTargetAmount;
        this.finalWinType = winType;
        this.finalScoringTime = scoringTime;
        // 得分音樂
        this.playScoring(this.finalWinType);
        this.setScoringData(startAmount, targetAmount, winBoardTargetAmount);
    }

    protected setScoringData(startAmount: number, targetAmount: number, winBoardTargetAmount: number) {
        if (this.needQuickScoringTime()) {
            this.finalScoringTime = this.getQuickScoringTime(this.finalWinType);
        }
        this.scoringNormal(startAmount, targetAmount, winBoardTargetAmount, this.finalScoringTime);
    }

    /**
     * 大獎沒有升階表演
     * @param startAmount BBW 滾分初使值
     * @param targetAmount BBW 滾分目標值
     * @param winBoardTargetAmount Win Board 滾分目標值
     * @param scoringTime 滾分時間
     */
    protected scoringNormal(
        startAmount: number,
        targetAmount: number,
        winBoardTargetAmount: number,
        scoringTime: number
    ) {
        this.sendNotification(WinEvent.RUN_WIN_LABEL_START, {
            startAmount: startAmount,
            targetAmount: targetAmount,
            winBoardStartAmount: 0,
            winBoardTargetAmount: winBoardTargetAmount,
            scoringTime: scoringTime,
            winType: this.finalWinType,
            runCompleteCallback: this.runComplete.bind(this)
        });
    }

    // 表演結束
    protected runComplete(isForceComplete: boolean) {
        this.playScoringEnd(isForceComplete);
        this.sendNotification(WinEvent.RUN_WIN_LABEL_COMPLETE, {
            targetAmount: this.finalWinAmount,
            winBoardTargetAmount: this.finalWinBoardAmount,
            winType: this.finalWinType
        });
    }

    public playScoring(winType: WinType) {
        if (winType >= WinType.bigWin) {
            switch (winType) {
                case WinType.bigWin:
                    AudioManager.Instance.play(ScoringClipsEnum.Scoring_Win01);
                    break;
                case WinType.megaWin:
                    AudioManager.Instance.play(ScoringClipsEnum.Scoring_Win02);
                    break;
                case WinType.superWin:
                    AudioManager.Instance.play(ScoringClipsEnum.Scoring_Win03);
                    break;
                case WinType.jumboWin:
                    AudioManager.Instance.play(ScoringClipsEnum.Scoring_Win04);
                    break;
            }
        } else {
            if (winType != WinType.none) {
                if (this.gameDataProxy.curScene == GameScene.Game_2) {
                    AudioManager.Instance.play(ScoringClipsEnum.Scoring_Free).loop(true);
                } else {
                    if (winType <= WinType.section_2) {
                        AudioManager.Instance.play(ScoringClipsEnum.Scoring_BaseEnd);
                    } else {
                        AudioManager.Instance.play(ScoringClipsEnum.Scoring_Base).loop(true);
                    }
                }
            }
        }
    }

    private playScoringEnd(isForceComplete: boolean) {
        let winType = this.finalWinType;
        GlobalTimer.getInstance().stop(this.timerKey);
        GlobalTimer.getInstance().removeTimer(this.timerKey);
        if (this.gameDataProxy.winBoardState == WinBoardState.SHOW) {
            if (isForceComplete || this.needQuickScoringTime()) {
                switch (winType) {
                    case WinType.bigWin:
                        AudioManager.Instance.stop(ScoringClipsEnum.Scoring_Win01).fade(0, 0.5);
                        break;
                    case WinType.megaWin:
                        AudioManager.Instance.stop(ScoringClipsEnum.Scoring_Win02).fade(0, 0.5);
                        break;
                    case WinType.superWin:
                        AudioManager.Instance.stop(ScoringClipsEnum.Scoring_Win03).fade(0, 0.5);
                        break;
                    case WinType.jumboWin:
                        AudioManager.Instance.stop(ScoringClipsEnum.Scoring_Win04).fade(0, 0.5);
                        break;
                }
            }
        } else {
            if (this.gameDataProxy.curScene == GameScene.Game_2) {
                AudioManager.Instance.stop(ScoringClipsEnum.Scoring_Free);
            } else {
                AudioManager.Instance.stop(ScoringClipsEnum.Scoring_Base);
            }
            if (this.gameDataProxy.winBoardState == WinBoardState.HIDE) {
                if (this.gameDataProxy.scrollingEndPlayed == false) {
                    this.gameDataProxy.scrollingEndPlayed = true;
                    if (this.gameDataProxy.curScene == GameScene.Game_2) {
                        AudioManager.Instance.play(ScoringClipsEnum.Scoring_FreeEnd);
                    } else {
                        if (winType > WinType.section_2) {
                            AudioManager.Instance.play(ScoringClipsEnum.Scoring_BaseEnd);
                        }
                    }
                }
            }
        }
    }

    private needQuickScoringTime(): boolean {
        return this.reelDataProxy.isTurboMode && this.gameDataProxy.onAutoPlay;
    }

    private getQuickScoringTime(winType: WinType): number {
        let scoringTime = 0;
        switch (true) {
            case winType >= WinType.section_1 && winType <= WinType.section_15:
                scoringTime = QuickScoringDuration.Scoring_normal;
                break;
            case winType == WinType.bigWin:
                scoringTime = QuickScoringDuration.Scoring_BigWin;
                break;
            case winType == WinType.megaWin:
                scoringTime = QuickScoringDuration.Scoring_MegaWin;
                break;
            case winType == WinType.superWin:
                scoringTime = QuickScoringDuration.Scoring_SuperWin;
                break;
            case winType == WinType.jumboWin:
                scoringTime = QuickScoringDuration.Scoring_JumboWin;
                break;
        }
        return scoringTime;
    }

    // ======================== Get Set ========================
    protected _reelDataProxy: ReelDataProxy;
    protected get reelDataProxy(): ReelDataProxy {
        if (!this._reelDataProxy) {
            this._reelDataProxy = this.facade.retrieveProxy(ReelDataProxy.NAME) as ReelDataProxy;
        }
        return this._reelDataProxy;
    }
    protected _gameDataProxy: GameDataProxy;
    public get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }
        return this._gameDataProxy;
    }
}
