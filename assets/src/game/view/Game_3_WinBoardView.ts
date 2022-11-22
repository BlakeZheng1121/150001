import { _decorator, Label, tween, Tween, Prefab, Vec3 } from 'cc';
import { BaseScene } from '../../base/BaseScene';
import { UIOrientation } from '../../core/ui/UIOrientation';
import { PoolManager } from '../../sgv3/PoolManager';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { MiniResultBoard } from '../../ta/mini-result-board/MiniResultBoard';
import { ParticleContentTool } from '../../ta/tool/particle-tool/ParticleContentTool';
const { ccclass, property } = _decorator;

@ccclass('Game_3_WinBoardView')
export class Game_3_WinBoardView extends BaseScene {
    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';

    @property({ type: Prefab })
    public particlePrefab: Prefab | null = null;

    private orientationState: string;

    public callback: IGame_3_WinBoardViewMediator;

    private miniResultBoard: MiniResultBoard;

    private winCoinFall: ParticleContentTool;

    // 結算畫面的總分數字
    @property({ type: Label })
    public wonCreditsLabel: Label;

    private targetCredits: number;

    public targetNum: number = 0;

    private bRunCredits: boolean = false;
    private bCanSkipRunCredits: boolean = false;

    protected onLoad() {
        super.onLoad();
        this.miniResultBoard = this.getComponent(MiniResultBoard);
    }

    /** 更改orientation mode */
    public changeOrientation(mode: string) {
        this.orientationState = mode;
    }

    /**更改語系 */
    public changeLocale(locale: string) {}

    public showWonBoard_byBonusGameOneRoundResult(
        credit: number,
        runTimer: number,
        hitPool: number[],
        canSkipRunCreditsTime: number,
        lang: string
    ) {
        const self = this;

        self.showOneWonBoard(credit, runTimer, hitPool[0] - 1, lang);

        if (runTimer > canSkipRunCreditsTime) {
            self.bCanSkipRunCredits = true;
        }
        self.bRunCredits = true;
    }

    public showOneWonBoard(credit: number, runTimer: number, wonType1: number, _lang: string): void {
        const self = this;
        let lang = _lang == 'en' ? 0 : 1;

        this.winCoinFall = PoolManager.instance
            .getNode(this.particlePrefab, this.node)
            .getComponent(ParticleContentTool);

        self.winCoinFall.node.position = new Vec3(0, 700, 0);
        self.winCoinFall.ParticlePlay(true, 0.5);
        self.miniResultBoard.OnBoardPlay(wonType1, lang);
        self.showWonCreditBoard(credit / 100, runTimer);
    }

    public hideWonBoard() {
        const self = this;
        self.miniResultBoard.OnBoardClose();
    }

    /** 贏分結算面板 */
    public showWonCreditBoard(credit: number, runTimer: number): void {
        const self = this;
        self.runCredits(credit, runTimer);
    }

    public stopWinCoinFall() {
        this.winCoinFall.ParticleStop();
        this.scheduleOnce(() => {
            PoolManager.instance.putNode(this.winCoinFall.node);
        }, this.winCoinFall.PutPoolTimes);
    }

    public runCreditsCompleted() {
        const self = this;
        self.callback.playRunCreditsCompletedSound();
        Tween.stopAllByTarget(self);
        self.targetNum = self.targetCredits;
        self.bRunCredits = false;
        self.bCanSkipRunCredits = false;
    }

    /** won credits 滾分效果 */
    public runCredits(credits: number, _runTime: number): void {
        const self = this;
        self.targetNum = 0;
        self.targetCredits = credits;
        tween(<Game_3_WinBoardView>self)
            .to(
                _runTime,
                { targetNum: credits },
                {
                    onUpdate: (target) => {
                        (target as Game_3_WinBoardView).onChange();
                    },
                    onComplete: (target) => {
                        (target as Game_3_WinBoardView).runCreditsCompleted();
                    }
                }
            )
            .start();
    }

    /** 此處必須先用無條件捨去處理，再轉為字串顯示 */
    private onChange(): void {
        const self = this;
        self.wonCreditsLabel.string = BalanceUtil.formatBalanceWithDollarSign(self.targetNum);
    }

    private checkIsRunCredits(): boolean {
        return this.bRunCredits;
    }

    public checkCanSkipRunCredit(): boolean {
        return this.bCanSkipRunCredits;
    }

    public skipRunCredit(): boolean {
        const self = this;
        if (!self.checkIsRunCredits()) {
            return false;
        }
        if (!self.checkCanSkipRunCredit()) {
            return false;
        }
        self.runCreditsCompleted();
        self.onChange();
        return true;
    }
}

export interface IGame_3_WinBoardViewMediator {
    playRunCreditsCompletedSound(): void;
    playSoundEND01(): void;
    playSoundEND02(): void;
    playSoundEND03(): void;
}
