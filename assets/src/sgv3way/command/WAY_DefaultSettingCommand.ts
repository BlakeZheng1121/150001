import { MathUtil } from '../../core/utils/MathUtil';
import { CoreDefaultSettingCommand } from '../../sgv3/command/CoreDefaultSettingCommand';
import { WAY_GameDataProxy } from '../proxy/WAY_GameDataProxy';

/**
 * 初始設定 line、bet、denom 等等
 */
export class WAY_DefaultSettingCommand extends CoreDefaultSettingCommand {
    /** 設定totalbetList*/
    protected setTotalBetList() {
        // 整理 singleBetCombinations 的投注組合依大到小排列
        let _tempKey: string = '';
        let _denom: number = NaN;

        // 加入初始化重設totalBetList
        this.gameDataProxy.totalBetList = [];
        for (_tempKey in this.gameDataProxy.initEventData.singleBetCombinations) {
            _denom = +_tempKey.split('_')[0];
            this.gameDataProxy.totalBetList.push(
                MathUtil.mul(
                    +this.gameDataProxy.initEventData.singleBetCombinations[_tempKey],
                    MathUtil.div(_denom, 1000)
                )
            );
        }

        this.gameDataProxy.totalBetList.sort(function (a, b) {
            return a - b;
        });
        this.gameDataProxy.totalBetList.reverse();
    }

    protected setBetAndLine(_defaultIdx: number): number {
        this.gameDataProxy.curBet = +this.gameDataProxy.userSetting.bet;
        this.gameDataProxy.curLine = +this.gameDataProxy.userSetting.line;

        this.gameDataProxy.curExtraBet = this.gameDataProxy.userSetting.extrabet;
        let _useKey: string = '';
        let _userBet: number = NaN;
        // 取得對應 key 值
        _useKey =
            this.gameDataProxy.betCombinationKeys[0] +
            '_' +
            this.gameDataProxy.betCombinationKeys[1] +
            '_' +
            this.gameDataProxy.betCombinationKeys[2] +
            '_' +
            this.gameDataProxy.betCombinationKeys[3];

        if (this.gameDataProxy.initEventData.singleBetCombinations[_useKey]) {
            _userBet = this.getUserBet(
                this.gameDataProxy.initEventData.singleBetCombinations[_useKey],
                +this.gameDataProxy.curDenom
            );
            _defaultIdx = this.gameDataProxy.totalBetList.indexOf(_userBet);
        }

        return _defaultIdx;
    }

    /** 初始化 Html 線或輪數設定 */
    protected setWebLine() {
        this.webBridgeProxy.initLine(
            '' + this.gameDataProxy.initEventData.executeSetting.baseGameSetting.betSpec.waysBetColumnList[0]
        );
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
