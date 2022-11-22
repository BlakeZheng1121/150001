import { _decorator } from 'cc';
import { ReelDataProxy } from '../../../sgv3/proxy/ReelDataProxy';
import { GameScene } from '../../../sgv3/vo/data/GameScene';
import { LockType } from '../../../sgv3/vo/enum/Reel';
import { GAME_GameDataProxy } from '../../proxy/GAME_GameDataProxy';
import { AudioClipsEnum } from '../../vo/enum/SoundMap';

export class ReelEffect_SpinStopSoundCommand extends puremvc.SimpleCommand {
    private spinStopSequenceLength: number = 0;

    public execute(notification: puremvc.INotification) {
        this.spinStopSequenceLength = this.gameDataProxy.getSceneDataByName(
            this.gameDataProxy.curScene
        ).reelSpinStopSequence.length;

        for (let i = 0; i < this.spinStopSequenceLength; i++) {
            switch (i) {
                case 0:
                    this.reelDataProxy.reelStopSoundSequence[i] = [AudioClipsEnum.SpinStop01];
                    break;
                case 1:
                    this.reelDataProxy.reelStopSoundSequence[i] = [AudioClipsEnum.SpinStop02];
                    break;
                case 2:
                    this.reelDataProxy.reelStopSoundSequence[i] = [AudioClipsEnum.SpinStop03];
                    break;
                case 3:
                    this.reelDataProxy.reelStopSoundSequence[i] = [AudioClipsEnum.SpinStop04];
                    break;
                case 4:
                    this.reelDataProxy.reelStopSoundSequence[i] = [AudioClipsEnum.SpinStop05];
                    break;
            }
        }
    }

    protected _reelDataProxy: ReelDataProxy;
    protected get reelDataProxy(): ReelDataProxy {
        if (!this._reelDataProxy) {
            this._reelDataProxy = this.facade.retrieveProxy(ReelDataProxy.NAME) as ReelDataProxy;
        }
        return this._reelDataProxy;
    }

    protected _gameDataProxy: GAME_GameDataProxy;
    protected get gameDataProxy(): GAME_GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GAME_GameDataProxy.NAME) as GAME_GameDataProxy;
        }
        return this._gameDataProxy;
    }
}
