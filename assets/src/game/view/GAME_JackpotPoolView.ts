import { _decorator, Label, Tween, tween, Node } from 'cc';
import { Logger } from '../../core/utils/Logger';
import { SceneManager } from '../../core/utils/SceneManager';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { JackpotPool } from '../../sgv3/util/Constant';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { Raise_JackpotFX } from '../../ta/raise-jackpot/Raise_JackpotFX';
import { GameUIOrientationSetting } from '../vo/GameUIOrientationSetting';
import BaseView from 'src/base/BaseView';

const { ccclass, property } = _decorator;

@ccclass('GAME_JackpotPoolView')
export class GAME_JackpotPoolView extends BaseView {
    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';
    private language: string;
    private orientationState: string;

    @property({ type: Node })
    public jackpotPoolGrand: Node;
    @property({ type: Node })
    public jackpotPoolMajor: Node;
    @property({ type: Node })
    public jackpotPoolMinor: Node;
    @property({ type: Node })
    public jackpotPoolMini: Node;

    // 彩金池 Label
    @property({ type: Label })
    public grandAmount: Label;
    @property({ type: Label })
    public majorAmount: Label;
    @property({ type: Label })
    public minorAmount: Label;
    @property({ type: Label })
    public miniAmount: Label;

    // 加押特效
    @property({ type: Raise_JackpotFX })
    public raiseJackpotFX: Raise_JackpotFX;

    // 滾分 - 動畫用暫時分數
    public tempGrandAmount: number = 0;
    public tempMajorAmount: number = 0;
    public tempMinorAmount: number = 0;
    public tempMiniAmount: number = 0;

    public totalGrandAmount: number = 0;
    public totalMajorAmount: number = 0;
    public totalMinorAmount: number = 0;
    public totalMiniAmount: number = 0;

    private betRangeMapIndex: number = 0;

    private textTweens: Map<number, Tween<GAME_JackpotPoolView>> = new Map<number, Tween<GAME_JackpotPoolView>>();

    public init(lang: string) {
        this.language = lang;
    }

    // 直橫式轉換
    private _gameUIOrientation: Array<GameUIOrientationSetting> | null = null;

    private get gameUIOrientation() {
        if (this._gameUIOrientation == null) {
            this._gameUIOrientation = this.getComponentsInChildren(GameUIOrientationSetting);
        }
        return this._gameUIOrientation;
    }

    public changeOrientation(orientation: string, scene: string) {
        let ishorizontal = orientation == SceneManager.EV_ORIENTATION_HORIZONTAL;
        for (let i = 0; i < this.gameUIOrientation.length; i++) {
            this.gameUIOrientation[i].changeOrientation(ishorizontal, scene);
        }
    }

    /**更改語系 */
    public changeLocale(locale: string) {}

    public initBonusPool(poolResetValue: number[]) {
        // 給 pool 初始倍率
        for (let i = 0; i < poolResetValue.length; i++) {
            //let tempValue = poolResetValue[i] / 100;
            let tempValue = poolResetValue[i];
            switch (i + 1) {
                case JackpotPool.GRAND:
                    this.tempGrandAmount = tempValue;
                    this.totalGrandAmount = tempValue;
                    this.textTweens.set(JackpotPool.GRAND, null);
                    break;
                case JackpotPool.MAJOR:
                    this.tempMajorAmount = tempValue;
                    this.totalMajorAmount = tempValue;
                    this.textTweens.set(JackpotPool.MAJOR, null);
                    break;
                case JackpotPool.MINOR:
                    this.tempMinorAmount = tempValue;
                    this.totalMinorAmount = tempValue;
                    this.textTweens.set(JackpotPool.MINOR, null);
                    break;
                case JackpotPool.MINI:
                    this.tempMiniAmount = tempValue;
                    this.totalMiniAmount = tempValue;
                    this.textTweens.set(JackpotPool.MINI, null);
                    break;
            }
        }
        this.updateAllPoolAmount();
    }

    public updateBonusPoolByBetRange(poolId:number, poolValue: number) {
        // 給 pool 更新倍率，Grand 與 Major 連結 Jackpot，不做更新
            switch (poolId + 1) {
                case JackpotPool.GRAND:
                    this.tempGrandAmount = poolValue;
                    this.updateGrandAmount();
                    break;
                case JackpotPool.MAJOR:
                    this.tempMajorAmount = poolValue;
                    this.updateMajorAmount();
                    break;
                case JackpotPool.MINOR:
                    this.tempMinorAmount = poolValue;
                    this.updateMinorAmount();
                    break;
                case JackpotPool.MINI:
                    this.tempMiniAmount = poolValue;
                    this.updateMiniAmount();
                    break;
            }
    }

    public runAmount(_endAmount: number, _poolId: number, _runningTime: number, isForce: boolean): void {
        Logger.i(
            '[JackpotPoolView] runPoolAmount poolId ' +
                _poolId +
                ': ' +
                ' to ' +
                _endAmount +
                ' ,runningTime:' +
                _runningTime
        );

        //開始實作跑分
        //指定跑表時間採固定時間跑表
        switch (_poolId) {
            case JackpotPool.GRAND:
                // Grand
                this.tempGrandAmount = this.totalGrandAmount;
                this.totalGrandAmount = _endAmount;
                if (this.totalGrandAmount < this.tempGrandAmount || isForce) {
                    this.runGrandAmountComplete();
                } else {
                    let textTween = this.textTweens.get(JackpotPool.GRAND);
                    textTween = tween(<GAME_JackpotPoolView>this)
                        .to(
                            _runningTime,
                            { tempGrandAmount: _endAmount },
                            {
                                onUpdate: (target) => {
                                    (target as GAME_JackpotPoolView).updateGrandAmount();
                                },
                                onComplete: (target) => {
                                    (target as GAME_JackpotPoolView).runGrandAmountComplete();
                                }
                            }
                        )
                        .start();
                }
                break;
            case JackpotPool.MAJOR:
                // Major
                this.tempMajorAmount = this.totalMajorAmount;
                this.totalMajorAmount = _endAmount;
                if (this.totalMajorAmount < this.tempMajorAmount || isForce) {
                    this.runMajorAmountComplete();
                } else {
                    let textTween = this.textTweens.get(JackpotPool.MAJOR);
                    textTween = tween(<GAME_JackpotPoolView>this)
                        .to(
                            _runningTime,
                            { tempMajorAmount: _endAmount },
                            {
                                onUpdate: (target) => {
                                    (target as GAME_JackpotPoolView).updateMajorAmount();
                                },
                                onComplete: (target) => {
                                    (target as GAME_JackpotPoolView).runMajorAmountComplete();
                                }
                            }
                        )
                        .start();
                }
                break;
            case JackpotPool.MINOR:
                // Minor
                this.tempMinorAmount = this.totalMinorAmount;
                this.totalMinorAmount = _endAmount;
                if (this.totalMinorAmount < this.tempMinorAmount || isForce) {
                    this.runMinorAmountComplete();
                } else {
                    let textTween = this.textTweens.get(JackpotPool.MINOR);
                    textTween = tween(<GAME_JackpotPoolView>this)
                        .to(
                            _runningTime,
                            { tempMinorAmount: _endAmount },
                            {
                                onUpdate: (target) => {
                                    (target as GAME_JackpotPoolView).updateMinorAmount();
                                },
                                onComplete: (target) => {
                                    (target as GAME_JackpotPoolView).runMinorAmountComplete();
                                }
                            }
                        )
                        .start();
                }
                break;
            case JackpotPool.MINI:
                // Mini
                this.tempMiniAmount = this.totalMiniAmount;
                this.totalMiniAmount = _endAmount;
                if (this.totalMiniAmount < this.tempMiniAmount || isForce) {
                    this.runMiniAmountComplete();
                } else {
                    let textTween = this.textTweens.get(JackpotPool.MINI);
                    textTween = tween(<GAME_JackpotPoolView>this)
                        .to(
                            _runningTime,
                            { tempMiniAmount: _endAmount },
                            {
                                onUpdate: (target) => {
                                    (target as GAME_JackpotPoolView).updateMiniAmount();
                                },
                                onComplete: (target) => {
                                    (target as GAME_JackpotPoolView).runMiniAmountComplete();
                                }
                            }
                        )
                        .start();
                }
                break;
        }
    }

    public updateFortuneMultiplier(mapIndex: number) {
        if (mapIndex > this.betRangeMapIndex) {
            this.raiseJackpotFX.onPlay();
        }
        this.betRangeMapIndex = mapIndex;
    }

    public updateAllPoolAmount() {
        this.updateGrandAmount();
        this.updateMajorAmount();
        this.updateMinorAmount();
        this.updateMiniAmount();
    }

    public updateGrandAmount() {
        if (!this.tempGrandAmount) return;
        this.grandAmount.string = BalanceUtil.formatBalanceWithDollarSign(this.tempGrandAmount);
    }

    public updateMajorAmount() {
        if (!this.tempMajorAmount) return;
        this.majorAmount.string = BalanceUtil.formatBalanceWithDollarSign(this.tempMajorAmount);
    }

    public updateMinorAmount() {
        if (!this.tempMinorAmount) return;
        this.minorAmount.string = BalanceUtil.formatBalanceWithDollarSign(this.tempMinorAmount);
    }

    public updateMiniAmount() {
        if (!this.tempMiniAmount) return;
        this.miniAmount.string = BalanceUtil.formatBalanceWithDollarSign(this.tempMiniAmount);
    }

    private runGrandAmountComplete() {
        this.grandAmount.string = BalanceUtil.formatBalanceWithDollarSign(this.totalGrandAmount);
    }

    private runMajorAmountComplete() {
        this.majorAmount.string = BalanceUtil.formatBalanceWithDollarSign(this.totalMajorAmount);
    }

    private runMinorAmountComplete() {
        this.minorAmount.string = BalanceUtil.formatBalanceWithDollarSign(this.totalMinorAmount);
    }

    private runMiniAmountComplete() {
        this.miniAmount.string = BalanceUtil.formatBalanceWithDollarSign(this.totalMiniAmount);
    }

    public enterGamePos(scene: string) {
        this.setPoolPosByOri(scene, this.orientationState);
    }

    private setPoolPosByOri(gameScene: string, orientation: string) {
        if (orientation === GAME_JackpotPoolView.HORIZONTAL) {
            switch (gameScene) {
                case GameScene.Game_1:
                case GameScene.Game_3:
                    this.jackpotPoolMajor.active = true;
                    this.jackpotPoolMinor.active = true;
                    this.jackpotPoolMini.active = true;
                    break;
                case GameScene.Game_2:
                case GameScene.Game_4:
                    this.jackpotPoolMajor.active = false;
                    this.jackpotPoolMinor.active = false;
                    this.jackpotPoolMini.active = false;
                    break;
            }
        } else {
            switch (gameScene) {
                case GameScene.Game_1:
                    this.jackpotPoolMajor.active = true;
                    this.jackpotPoolMinor.active = true;
                    this.jackpotPoolMini.active = true;
                    break;
                case GameScene.Game_3:
                    this.jackpotPoolMajor.active = true;
                    this.jackpotPoolMinor.active = true;
                    this.jackpotPoolMini.active = true;
                    break;
                case GameScene.Game_2:
                case GameScene.Game_4:
                    this.jackpotPoolMajor.active = false;
                    this.jackpotPoolMinor.active = false;
                    this.jackpotPoolMini.active = false;
                    break;
            }
        }
    }
}
