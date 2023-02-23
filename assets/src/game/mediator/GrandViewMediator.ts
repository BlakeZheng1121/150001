import { _decorator } from 'cc';
import BaseMediator from '../../base/BaseMediator';
import { GameDataProxy } from '../../sgv3/proxy/GameDataProxy';
import { JackpotPool, ScreenEvent, ViewMediatorEvent, WinEvent } from '../../sgv3/util/Constant';
import { MiniGameSymbol } from '../../sgv3/vo/enum/MiniGameSymbolType';
import { SpecialHitInfo } from '../../sgv3/vo/enum/SpecialHitInfo';
import { BonusGameOneRoundResult } from '../../sgv3/vo/result/BonusGameOneRoundResult';
import { AudioManager } from '../../ta/tool/AudioManager';
import { GrandView } from '../view/GrandView';
import { AudioClipsEnum, BGMClipsEnum, ScoringClipsEnum } from '../vo/enum/SoundMap';
const { ccclass } = _decorator;

@ccclass('GrandViewMediator')
export class GrandViewMediator extends BaseMediator<GrandView> {
    protected lazyEventListener(): void {}

    protected hitGrandComplete: Function = null;

    private grandCash: number = 0;

    public listNotificationInterests(): Array<any> {
        return [WinEvent.ON_HIT_GRAND, ScreenEvent.ON_SPIN_DOWN];
    }

    public handleNotification(notification: puremvc.INotification): void {
        if (!this.view.node.activeInHierarchy) return;
        let name = notification.getName();
        switch (name) {
            case WinEvent.ON_HIT_GRAND:
                this.hitGrand(notification.getBody());
                break;
            case ScreenEvent.ON_SPIN_DOWN: // 按下Spin
                this.onSpinDown();
                break;
        }
    }

    hitGrand(callBack: Function) {
        this.sendNotification(JackpotPool.HIGHLIGHT_HIT_POOL, MiniGameSymbol.Grand);
        this.view.showUp(this.gameDataProxy.language, () => this.onShowUpComplete());
        this.hitGrandComplete = callBack;

        switch (this.gameDataProxy.curScene) {
            case 'Game_1':
                AudioManager.Instance.fade(BGMClipsEnum.BGM_Base, 0, 0.7);
                break;
            case 'Game_2':
                AudioManager.Instance.fade(BGMClipsEnum.BGM_FreeGame, 0, 0.7);
                break;
            case 'Game_4':
                AudioManager.Instance.fade(BGMClipsEnum.BGM_DragonUp, 0, 0.7);
                break;
        }
    }

    onShowUpComplete() {
        const getGrand = (oneRoundResult: BonusGameOneRoundResult) =>
            oneRoundResult.specialHitInfo == SpecialHitInfo[SpecialHitInfo.bonusGame_02];
        // only Hit Grand in one game cycle
        this.grandCash =
            this.gameDataProxy.spinEventData.bonusGameResult.bonusGameOneRoundResult.find(
                getGrand
            ).oneRoundJPTotalWin;
        this.gameDataProxy.hitJackpotPoolType = JackpotPool.GRAND;
        this.view.scoringGrand(this.grandCash / 100, () => this.onScrollEnd());
    }

    onScrollEnd() {
        this.view.closeBoard(() => {
            this.sendNotification(JackpotPool.HIDE_HIGHLIGHT);
            this.sendNotification(JackpotPool.HIT_JACKPOT_TO_POOL_VALUE_INIT);
            this.sendNotification(ViewMediatorEvent.JACKPOT_WON_SHOW, this.grandCash);
            this.hitGrandComplete?.();
        });
        switch (this.gameDataProxy.curScene) {
            case 'Game_1':
                AudioManager.Instance.fade(BGMClipsEnum.BGM_Base, 1, 0.7);
                break;
            case 'Game_2':
                AudioManager.Instance.fade(BGMClipsEnum.BGM_FreeGame, 1, 0.7);
                break;
            case 'Game_4':
                AudioManager.Instance.fade(BGMClipsEnum.BGM_DragonUp, 1, 0.7);
                break;
        }
    }

    onSpinDown() {
        this.view.skipScoring();
    }

    protected _gameDataProxy: GameDataProxy;
    protected get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }
        return this._gameDataProxy;
    }
}
