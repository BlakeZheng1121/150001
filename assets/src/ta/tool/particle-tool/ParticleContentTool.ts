import { _decorator, Component, ParticleSystem, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ParticleContentTool')
export class ParticleContentTool extends Component {
    private ParticleList: ParticleSystem[] = [];

    private needUpdate: boolean = false;

    private ParticleRateOverTime: number[] = [];

    public PutPoolTimes: number = 0;

    private CallBack: any = null;

    @property({ tooltip: '勾起時為循環粒子模式,註:子物件的ParticleSystem的粒子如需循環還是需開啟Loop',displayName:"粒子循環設定" })
    public IsLoop: boolean = false;

    @property({ tooltip: '子物件的ParticleSystem的粒子初始填色',displayName:"初始粒子填色"}) public InitColor: Color = new Color(
        255,
        255,
        255,
        255
    );

    @property({ tooltip: '如有循環狀態,0為無限循環時間,直到等待關閉為止,接續數字為持續秒數,註:填1為1秒',displayName:"循環時間"})
    public LoopOverTime: number = 0;

    @property({ tooltip: '將會在設定的秒數之後清除相關表現',displayName:"清除物件時間"}) public ClearObjectTime: number = 4;

    //粒子抓取資訊-----------------------------------------------------------------------------------------------------------------------------
    onLoad() {
        this.ParticleList = this.getComponentsInChildren(ParticleSystem);
    }

    //清除粒子抓取資訊-----------------------------------------------------------------------------------------------------------------------------
    start() {
        this.ParticleClear();
    }

    //粒子播放-----------------------------------------------------------------------------------------------------------------------------
    public ParticlePlay(IsCheckPlay: boolean = true, DelayTime: number = 0, color: Color = null) {
        if (IsCheckPlay == true) {
            this.PutPoolTimes = this.LoopOverTime + this.ClearObjectTime + 0.5;
            if (this.needUpdate) {
                for (let i = 0; i < this.ParticleList.length; i++) {
                    this.ParticleList[i].rateOverTime.constant = this.ParticleRateOverTime[i];
                }
                this.needUpdate = false;
            }
            if (color != null) {
                this.SetParticleAlpha(color);
            }

            if (color != null) {
                this.SetParticleColor(color);
            }
            this.unschedule(this.particlePlay.bind(this));
            this.scheduleOnce(this.particlePlay.bind(this), DelayTime);
        }
    }

    //設置粒子透明度-----------------------------------------------------------------------------------------------------------------------------
    public SetParticleAlpha(color: Color = this.InitColor) {
        for (let i = 0; i < this.ParticleList.length; i++) {
            let Proportion = color.a / 255;
            if (
                this.ParticleList[i].startColor.color.r == 255 &&
                this.ParticleList[i].startColor.color.g == 255 &&
                this.ParticleList[i].startColor.color.b == 255
            ) {
                this.ParticleList[i].startColor.color = new Color(
                    color.r,
                    color.g,
                    color.b,
                    this.ParticleList[i].startColor.color.a * Proportion
                );
            } else {
                this.ParticleList[i].startColor.color.a = this.ParticleList[i].startColor.color.a * Proportion;
            }
        }
    }

    //設置粒子顏色-----------------------------------------------------------------------------------------------------------------------------
    public SetParticleColor(color: Color = null) {
        if (color != null) {
            for (let i = 0; i < this.ParticleList.length; i++) {
                this.ParticleList[i].startColor.color = new Color(color.r, color.g, color.b, color.a);
            }
        }
    }

    //粒子暫停-----------------------------------------------------------------------------------------------------------------------------
    public ParticlePause() {
        for (let i = 0; i < this.ParticleList.length; i++) {
            this.ParticleList[i].pause();
        }
    }

    //粒子停止生成-----------------------------------------------------------------------------------------------------------------------------
    public ParticleStop() {
        if (this.needUpdate == false) {
            this.needUpdate = true;
            for (let i = 0; i < this.ParticleList.length; i++) {
                this.ParticleRateOverTime[i] = this.ParticleList[i].rateOverTime.constant;
                this.ParticleList[i].rateOverTime.constant = 0;
            }
        }

        this.scheduleOnce(this.ParticleClear, this.ClearObjectTime);
    }

    //清除粒子-----------------------------------------------------------------------------------------------------------------------------
    public ParticleClear() {
        for (let i = 0; i < this.ParticleList.length; i++) {
            this.ParticleList[i].stop();
            this.ParticleList[i].clear();
            this.ParticleList[i].node.active = false;
        }
    }

    //初始透明度-----------------------------------------------------------------------------------------------------------------------------
    public InitAlpha() {
        for (let i = 0; i < this.ParticleList.length; i++) {
            if (this.ParticleList[i].startColor.color.a != 255) {
                this.ParticleList[i].startColor.color.a = 255;
            } else if (
                this.ParticleList[i].startColor.color.r != 255 &&
                this.ParticleList[i].startColor.color.g != 255 &&
                this.ParticleList[i].startColor.color.b != 255 &&
                this.ParticleList[i].startColor.color.a != 255
            ) {
                this.ParticleList[i].startColor.color = Color.WHITE;
            }
        }
    }

    //粒子播放設定-----------------------------------------------------------------------------------------------------------------------------
    private particlePlay() {
        this.unscheduleAllCallbacks();
        for (let i = 0; i < this.ParticleList.length; i++) {
            this.ParticleList[i].node.active = true;
            this.ParticleList[i].clear();
            this.ParticleList[i].play();
        }

        if (this.IsLoop == true) {
            if (this.LoopOverTime != 0) {
                this.scheduleOnce(this.ParticleStop.bind(this), this.LoopOverTime);
            }
        } else if (this.IsLoop == false) {
            this.scheduleOnce(this.ParticleStop.bind(this), this.ClearObjectTime);
        }
    }
}
