import { _decorator, Component, systemEvent, EventKeyboard, SystemEvent, KeyCode, Color } from 'cc';
import { ParticleContentTool } from './ParticleContentTool';

const { ccclass, property } = _decorator;

@ccclass('ParticleTest')
export class ParticleTest extends Component {
    private ParticleContentTool: ParticleContentTool | null = null;

    @property({ tooltip: '勾起時能將以下顏色設定帶入粒子上',displayName:"控制顏色選項"}) public IsColorControl: boolean = false;

    @property({ displayName: '填色控制' }) private InputColor: Color = new Color(255, 255, 255, 255);

    @property({ tooltip: '勾起時能在按A時輪流開啟關閉粒子',displayName:"開啟停止播放粒子選項"}) public IsStopAction: boolean =
        false;

    public horizontalCallback: (v: number) => void;

    private _bKeyA: boolean = false;

    private _fSensitivity: number = 3.0;

    private _fHorizontal: number = 0.0;

    private f: number = 0.0;

    onLoad() {
        this.ParticleContentTool = this.getComponent(ParticleContentTool);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        //console.log('表現開始');
        if (event.keyCode == KeyCode.KEY_A) {
            this._bKeyA = true;

            if (this.IsStopAction) {
                if (this.f == 0) {
                    if (this.IsColorControl) {
                        this.ParticleContentTool?.ParticlePlay(true, 0, this.InputColor);
                    } else {
                        this.ParticleContentTool?.ParticlePlay(true, 0);
                    }
                } else {
                    this.ParticleContentTool?.ParticleStop();
                }
                this.f++;
                if (this.f > 1) {
                    this.f = 0;
                }
            } else {
                if (this.IsColorControl) {
                    this.ParticleContentTool?.ParticlePlay(true, 0, this.InputColor);
                } else {
                    this.ParticleContentTool?.ParticlePlay(true, 0);
                }
            }
        }
    }

    private Test_A() {
        //console.log('表現完成');
        //this.perform_A();
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_A) {
            this._bKeyA = false;
        }
    }

    update(deltaTime: number) {
        if (this._bKeyA) {
            this._fHorizontal -= deltaTime * this._fSensitivity;
            if (this._fHorizontal < -1.0) {
                this._fHorizontal = -1.0;
            }
        }
    }
}
