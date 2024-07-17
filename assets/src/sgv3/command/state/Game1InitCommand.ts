import { NetworkProxy } from '../../../core/proxy/NetworkProxy';
import { BGMClipsEnum } from '../../../game/vo/enum/SoundMap';
import { AudioManager } from '../../../audio/AudioManager';
import { ReelEffect_SymbolFeatureCommand } from '../../../game/command/reelEffect/ReelEffect_SymbolFeatureCommand';
import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { SoundEvent, BaseSoundParms, WinEvent, ReelEvent } from '../../util/Constant';
import { GameScene } from '../../vo/data/GameScene';
import { GameStateId } from '../../vo/data/GameStateId';
import { GameOperation } from '../../vo/enum/GameOperation';
import { StateCommand } from './StateCommand';
import { UIEvent } from 'common-ui/proxy/UIEvent';

export class Game1InitCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME1_EV_INIT;

    protected get preScene() {
        return this.gameDataProxy.preScene;
    }

    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();
        this.gameDataProxy.curGameOperation = GameOperation[GameOperation.baseGame];

        //依照前一個場景，進行Game_1場景的表演處理
        switch (this.preScene) {
            case GameScene.Game_3:
                if (this.gameDataProxy.stateWinData.totalAmount() > 0 || this.gameDataProxy.hasFeatureSelection()) {
                    // 讓他可以重頭開始
                    this.gameDataProxy.rollingMoneyEnd = true;
                    this.sendNotification(SoundEvent.SOUNDCMD, [SoundEvent.RESET_SCENEBG, BaseSoundParms.GAME1]);
                    this.gameDataProxy.curWinData = this.gameDataProxy.stateWinData.concat();
                    this.changeState(StateMachineProxy.GAME1_SHOWWIN);
                } else {
                    // 從game3出來 game1沒分數就不用showWin了 所以直接清除TempWon讓錶底加上miniGame的值
                    this.sendNotification(SoundEvent.SOUNDCMD, [SoundEvent.RESET_SCENEBG, BaseSoundParms.GAME1]);
                    let totalWin = this.gameDataProxy._tempWonCredit;
                    this.gameDataProxy.resetTempWonCredit();
                    this.sendNotification(UIEvent.UPDATE_PLAYER_BALANCE, this.gameDataProxy.cash);
                    this.networkProxy.sendSettlePlay(totalWin);
                    this.changeState(StateMachineProxy.GAME1_IDLE);
                }
                //AudioManager.Instance.stop(BGMClipsEnum.BGM_Mini).fade(0, 1);

                break;
            case GameScene.Game_2:
            //AudioManager.Instance.stop(BGMClipsEnum.BGM_FreeGame).fade(0, 1);
            case GameScene.Game_4:
                //AudioManager.Instance.stop(BGMClipsEnum.BGM_DragonUp).fade(0, 1);
                this.sendNotification(ReelEvent.ON_REELS_INIT); //Reel Init
                this.sendNotification(ReelEffect_SymbolFeatureCommand.name);
                if (this.gameDataProxy.stateWinData.totalAmount() > 0) {
                    // 讓他可以重頭開始
                    this.sendNotification(SoundEvent.SOUNDCMD, [SoundEvent.RESET_SCENEBG, BaseSoundParms.GAME1]);
                    this.gameDataProxy.curWinData = this.gameDataProxy.stateWinData.concat();
                    this.sendNotification(ReelEvent.ON_REELS_RESTORE, this.gameDataProxy.spinEventData.baseGameResult);
                    this.changeState(StateMachineProxy.GAME1_SHOWWIN);
                } else {
                    // 避免在沒分數的情況，沒有 send settle play
                    this.changeState(StateMachineProxy.GAME1_END);
                }
                break;
            default: //Reel Init
                /** 判斷是否有 Recovery紀錄資料，需要進行處理 */
                if (
                    this.gameDataProxy.spinEventData != undefined &&
                    this.gameDataProxy.reStateResult?.gameStateId == GameStateId.WAIT_FOR_CLIENT
                ) {
                    if (this.gameDataProxy.stateWinData.totalAmount() > 0) {
                        this.gameDataProxy.curWinData = this.gameDataProxy.stateWinData.concat();
                        this.sendNotification(ReelEvent.SHOW_REELS_WIN, this.gameDataProxy.curWinData);
                    }
                    this.changeState(StateMachineProxy.GAME1_END);
                    return;
                } else {
                    this.sendNotification(UIEvent.UPDATE_PLAYER_WIN, 0); //清除Win欄位
                    this.changeState(StateMachineProxy.GAME1_IDLE);
                }
                this.sendNotification(ReelEvent.ON_REELS_INIT);
                break;
        }
        AudioManager.Instance.play(BGMClipsEnum.BGM_Base).loop(true).volume(0).fade(1, 1);
        this.sendNotification(WinEvent.FORCE_WIN_DISPOSE);
    }

    protected _networkProxy: NetworkProxy;
    protected get networkProxy(): NetworkProxy {
        if (!this._networkProxy) {
            this._networkProxy = this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        }
        return this._networkProxy;
    }
}
