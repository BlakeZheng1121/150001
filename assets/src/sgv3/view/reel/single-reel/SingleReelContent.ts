import { SingleReelContentBase } from './SingleReelContentBase';
import { _decorator } from 'cc';
import { SymbolPosData } from '../../../proxy/ReelDataProxy';
const { ccclass } = _decorator;

@ccclass('SingleReelContent')
export class SingleReelContent extends SingleReelContentBase {

    public fovFeature: Array<SymbolPosData> = [];

    public creditWeight: Array<number> | null = null;

    public creditArray: Array<number> | null = null;

    public freeCreditWeight: Array<number> | null = null;

    public multipleWeight: Array<number> | null = null;

    public multipleArray: Array<number> | null = null;

    public addRoundWeight: Array<number> | null = null;

    public addRoundArray: Array<number> | null = null;

    public respinSymbolId: Array<number> = [];

    public isBlackSymbol: boolean = false;

    public isMaxReSpin: boolean = false;

    public isTriggerFeatureReSpin: boolean = false;

    public get creditMaxWeight(): number {
        return this.creditWeight[this.creditWeight.length - 1];
    }

    public get creditMaxFreeWeight(): number {
        return this.freeCreditWeight[this.freeCreditWeight.length - 1];
    }

    public get multipleMaxWeight(): number {
        return this.multipleWeight[this.multipleWeight.length - 1];
    }

    public get addRoundMaxWeight(): number {
        return this.addRoundWeight[this.addRoundWeight.length - 1];
    }

    public getMultiple(fovIndex: number): number {
        return (fovIndex >= 0) ? this.fovFeature[fovIndex].multiple : this.getRandomMultiple();
    }

    public getCredit(fovIndex: number): number {
        if (this.creditArray == null || this.creditWeight == null) {
            return 0;
        }
        return (fovIndex >= 0) ? this.fovFeature[fovIndex].creditCent : this.getRandomCredit();
    }

    public getFreeCredit(fovIndex: number): number {
        if (this.freeCreditWeight == null) {
            return 0;
        }
        return (fovIndex >= 0) ? this.fovFeature[fovIndex].creditCent : this.getRandomFreeCredit();
    }

    public getAddRound(fovIndex: number): number {
        if (this.addRoundArray == null || this.addRoundWeight == null || this.isMaxReSpin) {
            return 0;
        }
        return(fovIndex >= 0) ? this.fovFeature[fovIndex].ReSpinNum : this.getRandomAddRound();
    }

    // 依 Cent 比對
    public isSpecialBall(value: number): boolean {
        if (this.creditArray == null) {
            return false;
        }
        return this.creditArray[this.creditArray.length - 1] == value;
    }

    // 確認是否需要忽略壓暗顯示
    public isRespinBlackId(id: number): boolean {
        if (!this.isBlackSymbol) {
            return false;
        }
        return (this.respinSymbolId.indexOf(id) < 0);
    }

    private getRandomCredit(): number {
        let randomValue = Math.floor(Math.random() * this.creditMaxWeight);
        for (let i = 1; i < this.creditWeight.length; i++) {
            if (randomValue >= this.creditWeight[i - 1] && randomValue < this.creditWeight[i]) {
                return this.creditArray[i - 1];
            }
        }
        return -1; ///ERROR
    }

    private getRandomFreeCredit(): number {
        let randomValue = Math.floor(Math.random() * this.creditMaxFreeWeight);
        for (let i = 1; i < this.freeCreditWeight.length; i++) {
            if (randomValue >= this.freeCreditWeight[i - 1] && randomValue < this.freeCreditWeight[i]) {
                if (i - 1 == 0) return 1;
                else return 0;
            }
        }
        return -1; ///ERROR
    }

    private getRandomMultiple(): number {
        let randomValue = Math.floor(Math.random() * this.multipleMaxWeight);
        for (let i = 1; i < this.multipleWeight.length; i++) {
            if (randomValue >= this.multipleWeight[i - 1] && randomValue < this.multipleWeight[i]) {
                return this.multipleArray[i - 1];
            }
        }
        return -1; ///ERROR
    }

    private getRandomAddRound(): number {
        let randomValue = Math.floor(Math.random() * this.addRoundMaxWeight);
        for (let i = 1; i < this.addRoundWeight.length; i++) {
            if (randomValue >= this.addRoundWeight[i - 1] && randomValue < this.addRoundWeight[i]) {
                return this.addRoundArray[i - 1];
            }
        }
        return -1; ///ERROR
    }
}
