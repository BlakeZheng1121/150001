import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { AnimationTimeLineTool } from '../tool/animation-timeline-tool/AnimationTimeLineTool';

const { ccclass, property } = _decorator;

@ccclass('FreeWild')
export class FreeWild extends Component {
    @property(AnimationTimeLineTool) public FreeWW: AnimationTimeLineTool | null = null;

    @property(Sprite) private MultiSprite: Sprite | null = null;

    @property(SpriteFrame) private SpriteMultiFrame: SpriteFrame[] = [];

    private num: number = 0;

    public OnFreeWildPerform(MultiNum: string = 'x2') {
        this.FreeWW.OnPlay(0);

        if (MultiNum == 'x2') {
            this.num = 0;
        } else if (MultiNum == 'x3') {
            this.num = 1;
        } else if (MultiNum == 'x5') {
            this.num = 2;
        } else if (MultiNum == 'x8') {
            this.num = 3;
        } else if (MultiNum == 'x10') {
            this.num = 4;
        } else {
            this.MultiSprite.spriteFrame = null;
            return;
        }

        this.MultiSprite.spriteFrame = this.SpriteMultiFrame[this.num];
    }

    public OnFreeWildHide() {
        this.FreeWW.OnPlay(1);
    }
}
