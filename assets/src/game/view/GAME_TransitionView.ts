import { _decorator, Component, Node, game } from 'cc';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { BaseScene } from '../../base/BaseScene';
import { CocosAnimationMultiTool } from '../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';

const { ccclass, property } = _decorator;

@ccclass('GAME_TransitionView')
export class GAME_TransitionView extends BaseScene {
    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';

    public currentState = '';

    @property(ParticleContentTool)
    private coinFall: ParticleContentTool;

    @property(CocosAnimationMultiTool)
    private DragonFlyUp: CocosAnimationMultiTool | null = null;

    protected isTransitionBG: boolean = false; //判斷是否進行轉場.

    protected onLoad() {
        super.onLoad('TransitionViewMediator');
        game.addPersistRootNode(this.node);
    }

    /** 更改orientation mode */
    public changeOrientation(mode: string) {
        this.currentState = mode;
    }

    /** 轉場動畫*/
    public showDragonFlyUp(): void {
        const self = this;
        this.setNodeActivity(true);
        this.DragonFlyUp?.OnPlay(1);
    }

    public showCoinFall(delay: number) {
        const self = this;
        this.setNodeActivity(true);
        self.coinFall.ParticlePlay(true, delay);
    }

    public setNodeActivity(active: boolean) {
        this.node.active = active;
    }
}
