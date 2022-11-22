
import { _decorator, Component} from 'cc';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';

import { CocosAnimationMultiTool } from '../cocos-animation-tool/CocosAnimationMultiTool';

const { ccclass, property } = _decorator;

@ccclass("SubAnimationMultiTool")
export class SubAnimationMultiTool{

    @property({type:CocosAnimationMultiTool,tooltip:"附加的CocosAnimationMultiTool動畫器",displayName:"附加動畫器"})public CocosAnimationMultiTool: CocosAnimationMultiTool|null = null;

    @property({displayName:"動畫線編號"}) public PlayTimeLineNumber: number = 0;

};

@ccclass("TimeLineState")
export class TimeLineState{

    @property({tooltip:"設定延遲秒數",displayName:"延遲動畫列時間設定"}) public DelayTime: number = 0;

    @property({type:CocosAnimationMultiTool,tooltip:"主要的CocosAnimationMultiTool動畫器",displayName:"主體動畫器"})public MainCocosAnimationMultiTool: CocosAnimationMultiTool|null = null;

    @property({tooltip:"主要的CocosAnimationMultiTool動畫編號",displayName:"主體動畫編號"}) public MainPlayTimeLineNumber: number = 0;

    @property({type: [SubAnimationMultiTool],tooltip:"附加的CocosAnimationMultiTool動畫列",displayName:"附加動畫列"}) SubAnimationMultiTool:  Array<SubAnimationMultiTool> = [];

};

@ccclass("TimeLineList")
export class TimeLineList{

    @property({displayName:"TimeLine時間線名稱"})public List_Name:string="";

    @property({type: [TimeLineState],displayName:"動畫片段列"})public TimeLineState:  Array<TimeLineState> = [];

    @property({displayName:"TimeLine時間線列循環設定"}) public IsLoop: boolean = false;

    public AnimationMultiToolsNum:number = 0;

    public CallBack: any = null;

};

@ccclass('AnimationTimeLineTool')

export class AnimationTimeLineTool extends Component {

    @property({type: [TimeLineList],displayName:"TimeLine時間線列"}) TimeLineList:  Array<TimeLineList> = [];

    private TimeLineListNum:number = 0;

    private IsListPlay: boolean = false;

    /* 初始播放(TimeLine時間線ID,CallBack回調事件,Skip狀態回調事件,註:初始為True)-----------------------------------------------------------------------------------------------------------------------------

    1.判斷是否Skip狀態

    2.更新TimeLine動畫時間列與動畫狀態器ID

    3.導向CocosAnimationMultiTool動畫播放流程

    */
    public OnPlay(ListNum:number=0,cb:any|null = null,IsCB: boolean = true){

    this.unscheduleAllCallbacks();
               
    this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum = 0;
    
    if(this.IsListPlay == true){

            for (let i = 0; i < this.TimeLineList.length; i++) {
    
                if(IsCB == true){
    
                    if(this.TimeLineList[i]?.CallBack!=null){
                      
                       this.TimeLineList[i]?.CallBack();
          
                    }
    
                }
          
                this.TimeLineList[i].CallBack = null;
                  
            }
    
    this.IsListPlay = false;
    
    }

    this.IsListPlay = true;

    this.TimeLineListNum = ListNum;

    if(cb){

    this.TimeLineList[this.TimeLineListNum].CallBack = () => cb();
        
    }

        this.scheduleOnce(()=>this.OnPlayAnimation(),this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum]?.DelayTime)
           
    }

    
    // CocosAnimationMultiTool播放-----------------------------------------------------------------------------------------------------------------------------
    private OnPlayAnimation(){

        this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum = 0;

        this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum]?.MainCocosAnimationMultiTool?.OnPlay(this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum]?.MainPlayTimeLineNumber,()=>this.OnNextAnimation());

        for (let i = 0; i < this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum]?.SubAnimationMultiTool.length; i++) {

            this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum].SubAnimationMultiTool[i].CocosAnimationMultiTool?.OnPlay(this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum].SubAnimationMultiTool[i]?.PlayTimeLineNumber);
                
        } 

    }

    /* CocosAnimationMultiTool接續播放-----------------------------------------------------------------------------------------------------------------------------

    1.animation接續片段狀態設定以及判斷CallBack

    2.animationq判斷是否進入接續片段或結束

    */
    private OnNextAnimation(){

        let ListNum =  this.TimeLineListNum;
   
        this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum++;

        this.scheduleOnce(()=>{

            if(this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum>this.TimeLineList[this.TimeLineListNum].TimeLineState.length-1){

                this.IsListPlay = false;
    
                const CurrentAction = this.TimeLineList[ListNum].CallBack;
    
                if(this.TimeLineList[ListNum].IsLoop){
    
                    this.OnPlay(this.TimeLineListNum);
    
                }else{
           
                    this.TimeLineList[ListNum].CallBack = null;

                }
                
                CurrentAction?.();
    
            }else{
    
                this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum]?.MainCocosAnimationMultiTool?.OnPlay(this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum]?.MainPlayTimeLineNumber,()=>this.OnNextAnimation());
    
                for (let i = 0; i < this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum]?.SubAnimationMultiTool.length; i++) {
    
                    this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum].SubAnimationMultiTool[i].CocosAnimationMultiTool?.OnPlay(this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum].SubAnimationMultiTool[i]?.PlayTimeLineNumber);
                    
                } 
    
            }


        },this.TimeLineList[this.TimeLineListNum].TimeLineState[this.TimeLineList[this.TimeLineListNum].AnimationMultiToolsNum]?.DelayTime)

    }
   
}