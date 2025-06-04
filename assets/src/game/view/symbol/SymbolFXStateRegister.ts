import { Tween, tween, _decorator, Node, Vec3 } from 'cc';
import { UIViewStateBase, UIViewStateRegister } from '../../../core/uiview/UIViewStateRegister';
import { BalanceUtil } from '../../../sgv3/util/BalanceUtil';
import { LockType, SymbolId, SymbolPerformType } from '../../../sgv3/vo/enum/Reel';
import { SymbolFXContent } from './SymbolFXContent';
const { ccclass } = _decorator;

@ccclass('SymbolFXStateRegister')
export class SymbolFXStateRegister extends UIViewStateRegister {
    private _content: SymbolFXContent | null = null;

    private get content() {
        if (this._content == null) {
            this._content = this.getComponent(SymbolFXContent);
        }
        return this._content;
    }

    onRegister() {
        switch (this.content.symbolType) {
            case SymbolId.WILD:
            case SymbolId.M1:
            case SymbolId.M2:
            case SymbolId.M3:
            case SymbolId.M4:
                this.registerState(new SymbolFXShowState(this.content));
                this.registerState(new SymbolFXStackShowState(this.content));
                break;
            case SymbolId.SUB:
                this.registerState(new SymbolFXReSpinState(this.content));
                break;
            case SymbolId.C1:
                this.registerState(new SymbolFXShowState(this.content));
                this.registerState(new SymbolFXBaseCreditUpdateState(this.content));
                break;
            case SymbolId.C2:
                this.registerState(new SymbolFXShowState(this.content));
                this.registerState(new SymbolFXGetTargertCreditResultState(this.content));
                this.registerState(new SymbolFXTargertCreditUpdateState(this.content));
                break;
        }
    }
}

export class SymbolFXShowState extends UIViewStateBase {
    //// Internal Member
    private content: SymbolFXContent | null = null;

    private tempTween: Tween<Node> | null = null;
    ////

    //// Hook
    public effectId: number = SymbolPerformType.SHOW;

    constructor(content: SymbolFXContent) {
        super();
        this.content = content;
    }

    onPlay() {
        if (this.content.animation == null) {
            this.onEffectFinished();
            return;
        }
        let animationIndex = 0;
        if (this.content.labelText) {
            switch (this.content.symbolId) {
                case SymbolId.C1:
                    this.content.labelText.font = this.content.isSpecialFont
                        ? this.content.specialFont
                        : this.content.baseFont;
                    this.content.labelText.string = String(
                        BalanceUtil.formatBalanceWithExpressingUnits(this.content.credit)
                    );
                    break;
                case SymbolId.C2:
                    this.content.labelText.string = String();
                    this.content.labelText.font =
                        this.content.lockType == LockType.OLD_LOCK ? this.content.goldFont : this.content.multipleFont;

                    this.content.subSprite.spriteFrame = this.content.respinNumFrames[this.content.reSpinNum - 1];
                    this.content.subSprite.enabled =
                        this.content.lockType == LockType.NEW_LOCK && this.content.reSpinNum > 0;

                    if (this.content.lockType == LockType.NEW_LOCK) {
                        this.content.labelText.string =
                            this.content.multiple > 0 ? String(this.content.multiple + '%') : String();
                        this.content.labelText.node.position =
                            this.content.reSpinNum > 0 ? this.content.hasReSpinPos : this.content.multiPos;
                    } else {
                        this.content.labelText.string = String(BalanceUtil.formatBalance(this.content.credit));
                        this.content.labelText.node.position = this.content.normalPos;
                    }
                    break;
            }
        }
        if (this.content.symbolId === SymbolId.WILD) {
            if (this.content.wildFlag > 0) {
                this.content.animation.play(`PlayStackWin_${this.content.wildFlag}`);
            } else if (this.content.wildFlag === -1) {
                this.onEffectFinished();
                return;
            } else {
                this.content.animation.play('PlayWin');
            }
        } else {
            this.content.animation.play('PlayWin');
        }
        //TO DO: Perform Time CallBack;
        this.tempTween = tween(this.content.node)
            .delay(2)
            .call(() => {
                this.onEffectFinished();
            })
            .start();
    }

    onSkip() {
        this.tempTween.stop();
        this.onEffectFinished();
    }
}

export class SymbolFXStackShowState extends UIViewStateBase {
    private content: SymbolFXContent | null = null;

    public effectId: number = SymbolPerformType.SHOW_STACK_WILD;

    constructor(content: SymbolFXContent) {
        super();
        this.content = content;
    }

    onPlay() {
        if (this.content.animation == null || this.content.wildFlag <= 0) {
            this.onEffectFinished();
            return;
        }
        this.content.animation.play(`ShowStack_${this.content.wildFlag}`, () => this.onEffectFinished());
    }
}

export class SymbolFXReSpinState extends UIViewStateBase {
    //// Internal Member
    private content: SymbolFXContent | null = null;
    ////

    //// Hook
    public effectId: number = SymbolPerformType.SHOW_RESPIN;

    constructor(content: SymbolFXContent) {
        super();
        this.content = content;
    }

    onPlay() {
        if (this.content.animation == null) {
            this.onEffectFinished();
            return;
        }
        let animString = this.content.credit > 0 ? ('PercentAndAddSpin' + this.content.reSpinNum) : ('AddSpin' + this.content.reSpinNum);
        this.content.animation.play(animString, () => this.onEffectFinished());
    }
}

export class SymbolFXBaseCreditUpdateState extends UIViewStateBase {
    //// Internal Member
    private content: SymbolFXContent | null = null;
    ////

    //// API
    public effectId: number = SymbolPerformType.SHOW_BASE_CREDIT_COLLECT;

    constructor(content: SymbolFXContent) {
        super();
        this.content = content;
    }
    ////

    //// Hook
    onPlay() {
        if (this.content.animation) {
            this.content.animation.play('BeginEffect', () => this.playWin());
        }
    }

    playWin() {
        this.content.animation.play('PlayWin');
        this.onEffectFinished();
    }
}

export class SymbolFXTargertCreditUpdateState extends UIViewStateBase {
    //// Internal Member
    private content: SymbolFXContent | null = null;
    ////

    //// API
    public effectId: number = SymbolPerformType.SHOW_TARGERT_CREDIT_COLLECT;

    constructor(content: SymbolFXContent) {
        super();
        this.content = content;
    }
    ////

    //// Hook
    onPlay() {
        if (this.content.animation) {
            this.content.animation.play('PlayCollect');
        }
        this.content.labelText.string = String();
        this.content.labelText.enabled = this.content.credit > 0;
        this.content.labelText.node.setPosition(new Vec3());

        switch (this.content.symbolId) {
            case SymbolId.C1:
                this.content.labelText.font = this.content.isSpecialFont
                    ? this.content.specialFont
                    : this.content.baseFont;
                break;
            case SymbolId.C2:
                this.content.labelText.font = this.content.goldFont;
                this.content.labelText.node.setPosition(this.content.normalPos);
                break;
        }
        this.onEffectFinished();
    }
    ////
}

export class SymbolFXGetTargertCreditResultState extends UIViewStateBase {
    //// Internal Member
    private content: SymbolFXContent | null = null;
    ////

    //// API
    public effectId: number = SymbolPerformType.SHOW_TARGERT_CREDIT_RESULT;

    constructor(content: SymbolFXContent) {
        super();
        this.content = content;
    }
    ////

    //// Hook
    onPlay() {
        this.content.labelText.string = String();
        if (this.content.animation) {
            this.content.animation.play('PlayLastCollect');
        }
        this.onEffectFinished();
    }
}
