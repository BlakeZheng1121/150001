
import { _decorator, Component,systemEvent,SystemEvent, EventKeyboard,KeyCode} from 'cc';
import { AnimationTimeLineTool } from './AnimationTimeLineTool';

const { ccclass, property } = _decorator;

@ccclass("CocosAnimationTimeLineTestList")
export class CocosAnimationTimeLineTestList{

    @property({type:ccclass,displayName:"按_A觸發"})
    public A;

    @property({type:AnimationTimeLineTool,tooltip:"指定任一掛有AnimationTimeLineTool的時間線動畫物件",displayName:"動畫線A"})private AnimationTimeLineTool_A: AnimationTimeLineTool|null = null;

    @property({displayName:"動畫線A的選擇播放ID"}) private PlayTimeLineNumber_A: number = 0;

    @property({tooltip:"勾選後能播放接續的時間線動畫線",displayName:"動畫線A的接續"}) private IsContinueAnimatLine_A: boolean = true;

    @property({tooltip:"勾選後跳過狀態播放能夠及時CallBack",displayName:"動畫線A的跳過CallBack運行設定"}) private IsSkipCB_A: boolean = true;

    private CurrentTimeLineA:number = 0;

    @property({type:ccclass,displayName:"按_S觸發"})
    public S;

    @property({type:AnimationTimeLineTool,tooltip:"指定任一掛有AnimationTimeLineTool的時間線動畫物件",displayName:"動畫線S"})private AnimationTimeLineTool_S: AnimationTimeLineTool|null = null;

    @property({displayName:"動畫線S的選擇播放ID"}) private PlayTimeLineNumber_S: number = 0;

    @property({tooltip:"勾選後能播放接續的時間線動畫線",displayName:"動畫線S的接續"}) private IsContinueAnimatLine_S: boolean = true;

    @property({tooltip:"勾選後跳過狀態播放能夠及時CallBack",displayName:"動畫線S的跳過CallBack運行設定"}) private IsSkipCB_S: boolean = true;

    private CurrentTimeLineB:number = 0;

    // 測試時間線A的播放以及CallBack設定-----------------------------------------------------------------------------------------------------------------------------
    public perform_A(){

        if(this.PlayTimeLineNumber_A>=this.AnimationTimeLineTool_A.TimeLineList.length){
            this.PlayTimeLineNumber_A = this.AnimationTimeLineTool_A.TimeLineList.length-1;
        }

        this.AnimationTimeLineTool_A?.OnPlay(this.PlayTimeLineNumber_A,()=>this.Test_A(),this.IsSkipCB_A);

        this.CurrentTimeLineA = this.PlayTimeLineNumber_A;
        
        if(this.IsContinueAnimatLine_A){
            if(this.AnimationTimeLineTool_A){
                this.PlayTimeLineNumber_A++
                if(this.PlayTimeLineNumber_A>=this.AnimationTimeLineTool_A.TimeLineList.length){
                    this.PlayTimeLineNumber_A = 0;
                }
            }
        }

        //console.log('第',this.CurrentTimeLineA,'時間線',this.AnimationTimeLineTool_A?.TimeLineList[this.CurrentTimeLineA].List_Name,'表現開始');

    }

    // 測試時間線A的播放以及CallBack設定-----------------------------------------------------------------------------------------------------------------------------
    private Test_A(){

        //console.log('第',this.CurrentTimeLineA,'時間線',this.AnimationTimeLineTool_A?.TimeLineList[this.CurrentTimeLineA].List_Name,'表現完成');
        //this.perform_A();

    }

    // 測試時間線B的播放以及CallBack設定-----------------------------------------------------------------------------------------------------------------------------
    public perform_B(){

        if(this.PlayTimeLineNumber_A>=this.AnimationTimeLineTool_A.TimeLineList.length){
            this.PlayTimeLineNumber_A = this.AnimationTimeLineTool_A.TimeLineList.length-1;
        }

        this.AnimationTimeLineTool_S?.OnPlay(this.PlayTimeLineNumber_S,()=>this.Test_B(),this.IsSkipCB_S);
        
        this.CurrentTimeLineB = this.PlayTimeLineNumber_S;

        if(this.IsContinueAnimatLine_S){
            if(this.AnimationTimeLineTool_S){
                this.PlayTimeLineNumber_S++
                if(this.PlayTimeLineNumber_S>=this.AnimationTimeLineTool_S.TimeLineList.length){
                    this.PlayTimeLineNumber_S = 0;
                }
            }
        }

        //console.log('第',this.CurrentTimeLineB,'時間線',this.AnimationTimeLineTool_S?.TimeLineList[this.CurrentTimeLineB].List_Name,'表現開始');

    }

    // 測試時間線B的播放以及CallBack設定-----------------------------------------------------------------------------------------------------------------------------
    private Test_B(){

        //console.log('第',this.CurrentTimeLineB,'時間線',this.AnimationTimeLineTool_S?.TimeLineList[this.CurrentTimeLineB].List_Name,'表現完成');
        //this.perform_B();

    }
};

@ccclass('AnimationTimeLineTestTool')

export class AnimationTimeLineTestTool extends Component {

    @property({type: [CocosAnimationTimeLineTestList],displayName:"測試清單"}) AnimationSingleProperty:  Array<CocosAnimationTimeLineTestList> = []

    onLoad() {

        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    }

    onDestroy(){
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_A) {

            for (let i = 0; i < this.AnimationSingleProperty.length; i++) {

            this.AnimationSingleProperty[i]?.perform_A();
            
           }

        }

        if (event.keyCode == KeyCode.KEY_S) {

            for (let i = 0; i < this.AnimationSingleProperty.length; i++) {

            this.AnimationSingleProperty[i]?.perform_B();
            
           }

        }

    }
   
}