import { _decorator, Component } from 'cc';
import { SymbolData } from '../../vo/match/ReelMatchInfo';
const { ccclass, property } = _decorator;

@ccclass('SymbolDataPlist')
export class SymbolDataPlist extends Component {
    //// Internal Member
    @property({ type: [SymbolData], visible: true })
    private list: Array<SymbolData> = [];
    private pool: { [key: string]: SymbolData } = {};
    private _language: string = '';

    ////

    //// property
    ////

    ////API
    public getDataById(id: number) {
        return this.pool[id];
    }

    public getDataByIndex(index: number) {
        return this.list[index];
    }

    public set language(value: string) {
        this._language = value;
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].checkLanguage(value);
        }
    }

    public get language() {
        return this._language;
    }
    ////

    //// Hook
    onLoad() {
        for (let i = 0; i < this.list.length; i++) {
            this.pool[this.list[i].id] = this.list[i];
        }
    }

    ////

    ////Internal Method
    ////
}
