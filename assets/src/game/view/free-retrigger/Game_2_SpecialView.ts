import { _decorator, SpriteFrame, Sprite, Prefab, instantiate, VerticalTextAlignment, Vec3 } from 'cc';
import { BaseScene } from '../../../base/BaseScene';
import { ControlView } from '../../../control-panel/view/ControlView';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';
import { FreeWild } from '../../../ta/free_ww/FreeWild';
import { AudioManager } from '../../../ta/tool/AudioManager';
import { CocosAnimationMultiTool } from '../../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
import { AudioClipsEnum } from '../../vo/enum/SoundMap';
import { FreeGameSpecialInfo } from '../../vo/FreeGameSpecialInfo';
import { FreeC1SubOnPerform } from './free_c1sub_on_perform/FreeC1SubOnPerform';
import { Free_RetriggerBoard } from './Free_RetriggerBoard';
const { ccclass, property } = _decorator;

@ccclass('Game_2_SpecialView')
export class Game_2_SpecialView extends BaseScene {
    @property(FreeC1SubOnPerform)
    private freeC1SubOnPerform: FreeC1SubOnPerform | null = null;

    @property(Prefab)
    private free_RetriggerBoard: Prefab | null = null;

    private onSpecialEndCallBack: Function = null;

    private onCollectCredit: Function = null;

    private freeGameSpecialInfo: FreeGameSpecialInfo;

    private language: string;

    public init(lang: string) {
        const self = this;

        self.language = lang;
    }

    private _freeRetriggerBoard: Free_RetriggerBoard | null = null;

    private get freeRetriggerBoard() {
        return this._freeRetriggerBoard.retriggerBoard;
    }

    public onLoad() {
        super.onLoad();
        let self = this;
        let retriggerBoard = instantiate(self.free_RetriggerBoard);

        retriggerBoard.parent = this.node;
        self._freeRetriggerBoard = retriggerBoard.getComponent(Free_RetriggerBoard);

        let animTools = this.node.getComponentsInChildren(CocosAnimationMultiTool);

        for (let i in animTools) {
            animTools[i].onLoad();
        }
    }

    //** 出現角落球 */
    public showSideBall(freeGameSpecialInfo: FreeGameSpecialInfo) {
        let self = this;
        self.freeGameSpecialInfo = freeGameSpecialInfo;
        if (freeGameSpecialInfo.hitBall.isShowHitBall) {
            self.freeC1SubOnPerform.showSideBall(
                self.freeGameSpecialInfo.hitBall.sideCreditBall,
                self.freeGameSpecialInfo.hitBall.sideCreditBallPos
            );
        }
    }

    //** show retriger board */
    public retriggerShow(addRound: number) {
        let self = this;
        self.freeRetriggerBoard?.OnPlay(0);

        AudioManager.Instance.play(AudioClipsEnum.Free_Retrigger);
    }

    //** 角落球特色打擊 */
    public showSideBallScore(onCollectCredit: Function, onSpecialEnd: Function) {
        let self = this;
        self.onSpecialEndCallBack = onSpecialEnd;
        self.onCollectCredit = onCollectCredit;
        if (self.freeGameSpecialInfo.hitBall.isShowHitBall) {
            self.freeC1SubOnPerform.showSideBallScore(
                self.onCollectCredit.bind(self),
                self.showHitSideBallEnd.bind(self)
            );
        } else {
            self.showHitSideBallEnd();
        }
    }

    private showHitSideBallEnd() {
        let self = this;
        if (self.freeGameSpecialInfo.freeWild.isShowFreeWild) {
            self.showFreeWild();
        } else {
            this.onSpecialEndCallBack();
            this.clearCallback();
        }
    }

    //** show wild 倍數 特色 */
    private showFreeWild() {
        let self = this;
        // if (!self.freeWild.node.active) self.freeWild.node.active = true;
        // self.freeWild.node.setWorldPosition(self.freeGameSpecialInfo.freeWild.wildPos);
        // self.freeWild.OnFreeWildPerform('x' + self.freeGameSpecialInfo.freeWild.multiplier.toString());
        self.playVocal(self.freeGameSpecialInfo.freeWild.multiplier);
        GlobalTimer.getInstance()
            .registerTimer(
                self.freeGameSpecialInfo.freeWild.timeKey_name,
                self.freeGameSpecialInfo.freeWild.timeOut,
                self.showWildSpecialEnd,
                self
            )
            .start();
    }

    private playVocal(multiplier: number) {
        let self = this;
        AudioManager.Instance.play(AudioClipsEnum[`FreeWild${multiplier}_${self.language}`]);
    }

    private showWildSpecialEnd() {
        GlobalTimer.getInstance().removeTimer(this.freeGameSpecialInfo.freeWild.timeKey_name);
        this.onSpecialEndCallBack();
        this.clearCallback();
    }

    private clearCallback() {
        this.onSpecialEndCallBack = null;
        this.onCollectCredit = null;
        this.freeGameSpecialInfo = new FreeGameSpecialInfo();
    }

    public stopFreeWild() {
        // this.freeWild.OnFreeWildHide();
    }

    public changeOrientation(orientation: string) {
        let self = this;
        let isHorizontal: boolean = false;

        if (orientation == ControlView.HORIZONTAL) isHorizontal = true;

        // for (let i = 0; i < self.node.children.length; i++) {
        //     self.node.children[i].getComponent(UIOrientation).changeOrientation(isHorizontal);
        // }
    }
}
