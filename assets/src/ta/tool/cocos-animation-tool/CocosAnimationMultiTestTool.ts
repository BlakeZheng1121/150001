
import { _decorator, Component,systemEvent,SystemEvent, EventKeyboard,KeyCode} from 'cc';

import { CocosAnimationMultiTool } from './CocosAnimationMultiTool';

const { ccclass, property } = _decorator;

@ccclass("TestList")
export class TestList{

    @property({type:ccclass,displayName:"按_A觸發"})
    public A;

    @property({type:CocosAnimationMultiTool,tooltip:"指定任一掛有CocosAnimationMultiTool的動畫物件",displayName:"動畫線A"})private CocosAnimationMultiTool_A: CocosAnimationMultiTool|null = null;

    @property({displayName:"動畫線A的選擇播放ID"}) private PlayTimeLineNumber_A: number = 0;

    @property({tooltip:"勾選後能播放接續的動畫線",displayName:"動畫線A的接續"}) private IsContinueAnimatLine_A: boolean = true;

    @property({tooltip:"勾選後跳過狀態播放能夠及時CallBack",displayName:"動畫線A的跳過CallBack運行設定"}) private IsSkipCB_A: boolean = true;

    private CurrentAnimationLineA:number = 0;

    @property({type:ccclass,displayName:"按_S觸發"})
    public S;

    @property({type:CocosAnimationMultiTool,tooltip:"指定任一掛有CocosAnimationMultiTool的動畫物件",displayName:"動畫線S"})private CocosAnimationMultiTool_S: CocosAnimationMultiTool|null = null;

    @property({displayName:"動畫線S的選擇播放ID"}) private PlayTimeLineNumber_S: number = 0;

    @property({tooltip:"勾選後能播放接續的動畫線",displayName:"動畫線S的接續"}) private IsContinueAnimatLine_S: boolean = true;

    @property({tooltip:"勾選後跳過狀態播放能夠及時CallBack",displayName:"動畫線S的跳過CallBack運行設定"}) private IsSkipCB_S: boolean = true;

    private CurrentAnimationLineB:number = 0;

    // 測試動畫線A的播放以及CallBack設定-----------------------------------------------------------------------------------------------------------------------------
    public perform_A(){

        this.CocosAnimationMultiTool_A?.OnPlay(this.PlayTimeLineNumber_A,()=>this.Test_A(),this.IsSkipCB_A);

        this.CurrentAnimationLineA = this.PlayTimeLineNumber_A;

        if(this.IsContinueAnimatLine_A){
            if(this.CocosAnimationMultiTool_A){
                this.PlayTimeLineNumber_A++
                if(this.PlayTimeLineNumber_A>=this.CocosAnimationMultiTool_A.AnimationList.length){
                    this.PlayTimeLineNumber_A = 0;
                }
            }
        }

        //console.log('第',this.CurrentAnimationLineA,'動畫線',this.CocosAnimationMultiTool_A?.AnimationList[this.CurrentAnimationLineA].List_Name,'表現開始');

    }

    // 測試動畫線A的CallBack設定-----------------------------------------------------------------------------------------------------------------------------
    private Test_A(){

        //console.log('第',this.CurrentAnimationLineA,'動畫線',this.CocosAnimationMultiTool_A?.AnimationList[this.CurrentAnimationLineA].List_Name,'表現完成');
        //this.perform_A();

    }

    // 測試動畫線B的播放以及CallBack設定-----------------------------------------------------------------------------------------------------------------------------
    public perform_B(){

        this.CocosAnimationMultiTool_S?.OnPlay(this.PlayTimeLineNumber_S,()=>this.Test_B(),this.IsSkipCB_S);

        this.CurrentAnimationLineB = this.PlayTimeLineNumber_S;

        if(this.IsContinueAnimatLine_S){
            if(this.CocosAnimationMultiTool_S){
                this.PlayTimeLineNumber_S++
                if(this.PlayTimeLineNumber_S>=this.CocosAnimationMultiTool_S.AnimationList.length){
                    this.PlayTimeLineNumber_S = 0;
                }
            }
        }

        //console.log('第',this.CurrentAnimationLineB,'動畫線',this.CocosAnimationMultiTool_S?.AnimationList[this.CurrentAnimationLineB].List_Name,'表現開始');

    }

    // 測試動畫線B的CallBack設定-----------------------------------------------------------------------------------------------------------------------------
    private Test_B(){

        //console.log('第',this.CurrentAnimationLineB,'動畫線',this.CocosAnimationMultiTool_S?.AnimationList[this.CurrentAnimationLineB].List_Name,'表現完成');
        //this.perform_B();

    }
};

@ccclass('CocosAnimationMultiTestTool')

export class CocosAnimationMultiTestTool extends Component {

    @property({type: [TestList],displayName:"測試清單"}) AnimationSingleProperty:  Array<TestList> = []

    // 按鍵事件監聽註冊-----------------------------------------------------------------------------------------------------------------------------
    onLoad() {

        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    }

    onDestroy(){
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    
    // 按下事件觸發-----------------------------------------------------------------------------------------------------------------------------
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