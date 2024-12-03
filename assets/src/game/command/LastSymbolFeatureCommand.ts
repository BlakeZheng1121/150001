import { _decorator } from 'cc';
import { MathUtil } from 'src/core/utils/MathUtil';
import { GameDataProxy } from 'src/sgv3/proxy/GameDataProxy';
import { ReelDataProxy, SymbolPosData } from 'src/sgv3/proxy/ReelDataProxy';
import { ReelEvent } from 'src/sgv3/util/Constant';
import { LockType } from 'src/sgv3/vo/enum/Reel';
// 最後一把 by game 的 symbol 特色資料
export class LastSymbolFeatureCommand extends puremvc.SimpleCommand {
    public static readonly NAME = 'LastSymbolFeatureCommand';

    public execute(notification: puremvc.INotification) {
        if (this.ballScreenLabel != null) {
            if (this.reelDataProxy.symbolFeature == null) {
                this.reelDataProxy.symbolFeature = [];
                for (let i = 0; i < this.ballScreenLabel.length; i++) {
                    let tempArray = Array<SymbolPosData>();
                    for (let j = 0; j < this.ballScreenLabel[i].length; j++) {
                        let posData = new SymbolPosData();
                        tempArray.push(posData);
                    }
                    this.reelDataProxy.symbolFeature.push(tempArray);
                }
            }
            //Game_1資料處理
            for (let i = 0; i < this.ballScreenLabel.length; i++) {
                for (let j = 0; j < this.ballScreenLabel[i].length; j++) {
                    let posData = this.reelDataProxy.symbolFeature[i][j];
                    posData.creditCent = this.gameDataProxy.convertCredit2Cash(this.ballScreenLabel[i][j]);
                    posData.isSpecial = posData.creditCent > 0 ? this.isSpecialBall(posData.creditCent) : false;
                    posData.lockType = posData.creditCent > 0 ? LockType.BASE_LOCK : LockType.NONE;
                    posData.language = this.gameDataProxy.language;
                }
            }
        }
        let seatInfo = this.gameDataProxy.initEventData.initialData.seatStatusCache.seatInfo;
        if (seatInfo.screenRngInfo) {
            let mysterySymbol = this.gameDataProxy.initEventData.initialData.seatStatusCache.mysterySymbol;
            this.sendNotification(ReelEvent.SHOW_LAST_SYMBOL_OF_REELS, {
                seatInfo: seatInfo,
                mysterySymbol: mysterySymbol
            });
        }
    }

    // ======================== Get Set ========================
    protected _gameDataProxy: GameDataProxy;
    protected get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }
        return this._gameDataProxy;
    }

    protected _reelDataProxy: ReelDataProxy;
    protected get reelDataProxy(): ReelDataProxy {
        if (!this._reelDataProxy) {
            this._reelDataProxy = this.facade.retrieveProxy(ReelDataProxy.NAME) as ReelDataProxy;
        }
        return this._reelDataProxy;
    }

    protected _ballScreenLabel: Array<Array<number>> | null = null;
    protected get ballScreenLabel() {
        if (this._ballScreenLabel == null) {
            this._ballScreenLabel = this.gameDataProxy.initEventData.initialData.seatStatusCache.ballScreenLabel;
        }
        return this._ballScreenLabel;
    }
    // 依 Cash 比對
    protected isSpecialBall(value: number): boolean {
        const creditBall =
            this.gameDataProxy.initEventData.executeSetting.baseGameSetting.baseGameExtendSetting.creditBall;
        let credit = this.gameDataProxy.isOmniChannel()
            ? MathUtil.mul(creditBall[creditBall.length - 1], this.gameDataProxy.curBet)
            : MathUtil.div(
                  MathUtil.mul(creditBall[creditBall.length - 1], this.gameDataProxy.curTotalBet, 10),
                  this.gameDataProxy.curDenom
              );
        let cash = this.gameDataProxy.convertCredit2Cash(credit);
        return cash == value;
    }
}
