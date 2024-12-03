import { MathUtil } from '../../core/utils/MathUtil';
import { CoreDefaultSettingCommand } from '../../sgv3/command/CoreDefaultSettingCommand';
import { WAY_GameDataProxy } from '../proxy/WAY_GameDataProxy';

/**
 * 初始設定 line、bet、denom 等等
 */
export class WAY_DefaultSettingCommand extends CoreDefaultSettingCommand {
    /** 設定totalbetList*/
    protected setTotalBetList() {
        // 基礎押注
        const baseBet = this.gameDataProxy.initEventData.executeSetting.baseGameSetting.betSpec.baseBet;
        // 幣別 denom
        const denom = this.gameDataProxy.initEventData.denoms[0];
        this.gameDataProxy.totalBetList = [];
        for (let i = 0; i < this.gameDataProxy.initEventData.betMultiplier.length; i++) {
            let totalBet = MathUtil.mul(
                baseBet,
                this.gameDataProxy.initEventData.betMultiplier[i],
                MathUtil.div(denom, 1000)
            );
            this.gameDataProxy.totalBetList.push(totalBet);
        }
    }

    protected setBetAndLine(_defaultIdx: number): number {
        this.gameDataProxy.curTotalBet = +this.gameDataProxy.userSetting.totalBet;
        this.gameDataProxy.curLine = +this.gameDataProxy.userSetting.line;
        this.gameDataProxy.curExtraBet = this.gameDataProxy.userSetting.extraBet;
        this.gameDataProxy.curBet = +this.gameDataProxy.userSetting.betMultiplier;
        this.gameDataProxy.curDenomMultiplier = +this.gameDataProxy.userSetting.denomMultiplier;

        let predicate: (bet: any, index: any) => boolean;
        if (this.gameDataProxy.isOmniChannel()) {
            predicate = (bet, index) =>
                bet == this.gameDataProxy.curTotalBet &&
                this.gameDataProxy.initEventData.denomMultiplier[index] == this.gameDataProxy.curDenomMultiplier;
        } else {
            predicate = (bet, index) => bet == this.gameDataProxy.curTotalBet;
        }
        _defaultIdx = this.gameDataProxy.totalBetList.findIndex(predicate);

        return _defaultIdx;
    }
    // ======================== Get Set ========================
    protected _gameDataProxy: WAY_GameDataProxy;
    protected get gameDataProxy(): WAY_GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(WAY_GameDataProxy.NAME) as WAY_GameDataProxy;
        }
        return this._gameDataProxy;
    }
}
