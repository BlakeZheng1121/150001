import { _decorator, Layout, UITransform } from 'cc';
import BaseMediator from 'src/base/BaseMediator';
import { BonusUpgradeView } from '../view/BonusUpgradeView';
import { GameDataProxy } from 'src/sgv3/proxy/GameDataProxy';
import { CtrlPanelBtnState, ScreenEvent } from 'src/sgv3/util/Constant';
import { UIEvent } from 'common-ui/proxy/UIEvent';
import { ControlView } from 'common-ui/view/ControlView';
const { ccclass } = _decorator;

@ccclass('BonusUpgradeViewMediator')
export class BonusUpgradeViewMediator extends BaseMediator<BonusUpgradeView> {
    private isSetPosition: boolean = false;
    protected lazyEventListener(): void {}

    public listNotificationInterests(): Array<any> {
        return [
            ScreenEvent.ON_BET_CHANGE,
            CtrlPanelBtnState.CREATE_BONUS_UPGRADE_BET_RANGE_INFO,
            UIEvent.UPDATE_TOTAL_BET,
            ScreenEvent.ON_SPIN_DOWN
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        let name = notification.getName();
        switch (name) {
            case ScreenEvent.ON_BET_CHANGE:
                this.changeBonusUpgradeInfo();
                break;
            case CtrlPanelBtnState.CREATE_BONUS_UPGRADE_BET_RANGE_INFO:
                this.createBonusUpgradeBetRangeInfo();
                break;
            case UIEvent.UPDATE_TOTAL_BET:
                this.checkBetMenuStatus();
                break;
            case ScreenEvent.ON_SPIN_DOWN:
                this.hideBonusUpgradeHint();
                break;
        }
    }

    private changeBonusUpgradeInfo() {
        const betRangeMapIndex = this.gameDataProxy.getJackpotPoolRangeIndexWithBet();
        this.view.onBetLevelChange(betRangeMapIndex);
    }

    private createBonusUpgradeBetRangeInfo() {
        const jpPoolData = this.gameDataProxy.initEventData.executeSetting.jackpotSetting.jackpotPoolData[0];
        const wayBetList = this.gameDataProxy.initEventData.executeSetting.baseGameSetting.betSpec.waysBetList;
        const betRangeMap = jpPoolData.jackpotExtendSetting.betRangeMap;

        // 須將 JackpotBet 結合顯示出來
        let betRangeMapGroup: Map<number, number[]> = new Map<number, number[]>();
        for (let i = 0; i < betRangeMap.length; i++) {
            if (betRangeMapGroup.has(betRangeMap[i])) {
                betRangeMapGroup.get(betRangeMap[i]).push(wayBetList[i]);
            } else {
                let bet: number[] = [];
                bet.push(wayBetList[i]);
                betRangeMapGroup.set(betRangeMap[i], bet);
            }
        }

        // For totalBetList Index
        let tempMinBetIndex: number = NaN;
        let tempMaxBetIndex: number = NaN;
        let minBets: number[] = [];
        let maxBets: number[] = [];
        const self = this;
        betRangeMapGroup.forEach((value) => {
            for (let i = 0; i < self.gameDataProxy.jackpotAllBetList.length; i++) {
                if (self.gameDataProxy.jackpotAllBetList[i] >= value[0]) {
                    tempMinBetIndex = i;
                    break;
                }
            }
            for (let i = self.gameDataProxy.jackpotAllBetList.length - 1; i >= 0; i--) {
                if (self.gameDataProxy.jackpotAllBetList[i] <= value[value.length - 1]) {
                    tempMaxBetIndex = i;
                    break;
                }
            }

            minBets.push(self.gameDataProxy.totalBetList[tempMinBetIndex]);
            maxBets.push(self.gameDataProxy.totalBetList[tempMaxBetIndex]);
        });

        this.view.setBonusUpgradeInfo(minBets, maxBets);
    }

    private setUpgradeMessagePosition() {
        // 強制更新押注選單的 layout，取得即時的節點尺寸
        this.controlView.betMenu.content.getComponent(Layout).updateLayout(true);
        this.controlView.betMenu.getComponent(Layout).updateLayout(true);
        let betMenuTopPos =
            this.controlView.betMenu.node.position.y + this.controlView.betMenu.getComponent(UITransform).height;
        this.view.bonusUpgradeMessage.setPosition(
            this.view.bonusUpgradeMessage.position.x,
            betMenuTopPos - 8, // 押注選單的 padding
            this.view.bonusUpgradeMessage.position.z
        );
    }

    public hideBonusUpgradeHint() {
        this.view.bonusUpgradeHint.active = false;
    }

    public checkBetMenuStatus() {
        if (this.controlView.betMenu.node.active) {
            this.showBonusUpgradeMessage();
            this.hideBonusUpgradeHint();
        } else {
            this.hideBonusUpgradeMessage();
        }
    }

    public showBonusUpgradeMessage() {
        if (this.isSetPosition == false) {
            this.isSetPosition = true;
            this.setUpgradeMessagePosition();
        }
        this.view.bonusUpgradeMessage.active = true;
    }

    public hideBonusUpgradeMessage() {
        this.view.bonusUpgradeMessage.active = false;
    }

    // ======================== Get Set ========================
    private _gameDataProxy: GameDataProxy;
    public get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }

        return this._gameDataProxy;
    }

    private _controlView: ControlView;
    public get controlView(): ControlView {
        if (!this._controlView) {
            this._controlView = this.facade
                .retrieveMediator('ControlViewMediator')
                .getViewComponent() as ControlView;
        }
        return this._controlView;
    }
}
