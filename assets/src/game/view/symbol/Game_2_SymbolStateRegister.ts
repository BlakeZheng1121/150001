import { _decorator } from 'cc';
import { UIViewStateBase } from '../../../core/uiview/UIViewStateRegister';
import {
    SymbolHideState,
    SymbolRollCycledState,
    SymbolShowState,
    SymbolStateRegisterBase
} from '../../../sgv3/view/reel/symbol/SymbolStateRegisterBase';
import { SymbolId, SymbolPerformType } from '../../../sgv3/vo/enum/Reel';
import { Game_2_SymbolContent } from './Game_2_SymbolContent';
const { ccclass } = _decorator;

@ccclass('Game2SymbolStateRegister')
export class Game2SymbolStateRegister extends SymbolStateRegisterBase {
    private _content: Game_2_SymbolContent | null = null;

    private get content() {
        if (this._content == null) {
            this._content = this.getComponent(Game_2_SymbolContent);
        }
        return this._content;
    }

    onRegister() {
        super.onRegister();
        this.registerState(new Game_2_SymbolHideState(this.content));
        this.registerState(new Game_2_RollCycledState(this.content));
        this.registerState(new Game_2_SymbolShowState(this.content));
        this.registerState(new Game_2_SymbolDampingState(this.content));
    }
}

export class Game_2_SymbolDampingState extends UIViewStateBase {
    //// Internal Member
    private content: Game_2_SymbolContent | null = null;
    ////

    //// Hook
    public effectId: number = SymbolPerformType.DAMPING;

    constructor(content: Game_2_SymbolContent) {
        super();
        this.content = content;
    }
    ////

    onPlay() {
        this.content.createParticlePrefab();
        this.onEffectFinished();
    }
    ////
}

export class Game_2_SymbolHideState extends SymbolHideState {
    //// Internal Member
    private content: Game_2_SymbolContent | null = null;
    ////

    //// Hook
    constructor(content: Game_2_SymbolContent) {
        super(content);
        this.content = content;
    }

    onPlay() {
        super.onPlay();
        this.content.labelText.enabled = false;
    }
    ////
}

export class Game_2_RollCycledState extends SymbolRollCycledState {
    //// Internal Member
    private content: Game_2_SymbolContent | null = null;
    ////

    //// Hook
    constructor(content: Game_2_SymbolContent) {
        super();
        this.content = content;
    }

    onPlay() {
        this.content.labelText.enabled = this.content.symbolData.id == SymbolId.C1;

        if (this.content.labelText.enabled) {
            this.content.labelText.font = this.content.isSpecialFont ? this.content.specialFont : this.content.baseFont;
            this.content.labelText.string = this.content.creditDisplay;
        } else {
            this.content.labelText.string = String();
        }

        this.onEffectFinished();
    }
}

export class Game_2_SymbolShowState extends SymbolShowState {
    //// Internal Member
    private content: Game_2_SymbolContent | null = null;
    ////

    //// Hook
    constructor(content: Game_2_SymbolContent) {
        super(content);
        this.content = content;
    }

    onPlay() {
        super.onPlay();
        this.content.labelText.enabled = this.content.symbolData.id == SymbolId.C1;

        if (this.content.labelText.enabled) {
            this.content.forceRecycleParticlePrefab();
            this.content.labelText.font = this.content.isSpecialFont ? this.content.specialFont : this.content.baseFont;
            this.content.labelText.string = this.content.creditDisplay;
        }
    }
}
