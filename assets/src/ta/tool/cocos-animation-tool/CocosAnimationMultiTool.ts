import { _decorator, Component, Animation, sp, CCString, AnimationClip } from 'cc';
import { ParticleContentTool } from '../../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { AudioManager } from '../AudioManager';

const { ccclass, property } = _decorator;

@ccclass('IsStopParticle')
export class IsStopParticle {
    @property({ type: ParticleContentTool, tooltip: '停止生成粒子' })
    public IsStopParticle: ParticleContentTool | null = null;

    @property({ tooltip: '清除粒子' }) public IsParticleClear: boolean = false;
}

@ccclass('AnimationState')
export class AnimationState {
    @property({ displayName: 'ccAnimation設定面板' })
    public ccAnimation: boolean = true;

    @property({ displayName: 'Spine2D設定面板' })
    public Spine2D: boolean = true;

    @property({ displayName: 'Spine2D混合動畫設定面板' })
    public Spine2DAdd: boolean = false;

    @property({ displayName: '粒子設定面板' })
    public Particle: boolean = false;

    @property({ displayName: '音效設定面板' })
    public Audio: boolean = false;

    @property({ type: ccclass,displayName: '調整'  })
    public Adjust;

    @property({
        visible() {
            return this.ccAnimation;
        }
    })
    @property({ tooltip: '播放CocosAnimation動畫設定 - 面板器中無cc.Animation時無任何作用', displayName: 'ccAnimation動畫播放' })
    public IsAnimationPlay: boolean = true;

    @property({
        visible() {
            return this.ccAnimation;
        }
    })
    @property({ tooltip: 'CocosAnimation狀態編號 - 設定要播的cc.Animation編號,面板器中無cc.Animation時無任何作用', displayName: 'ccAnimation動畫狀態' })
    public CocosAnimationState: number = 0;

    @property({
        visible() {
            return this.Spine2D;
        }
    })
    @property({
        tooltip: '播放Spine2D動畫(或DragonBone動畫) - 面板器中無sp.Skeleton或dragonBones.ArmatureDisplay時無任何作用', displayName: 'Spine2d動畫播放' 
    })
    public IsSpine2DPlay: boolean = true;

    @property({
        visible() {
            return this.Spine2D;
        }
    })
    @property({
        tooltip:
            'Spine2D動畫狀態編號 - 設定要播的sp.Skeleton或dragonBones編號,面板器中無sp.Skeleton或dragonBones.ArmatureDisplay時無任何作用', displayName: 'Spine2d動畫狀態'
    })
    public Spine2DAnimationState: number = 0;

    @property({
        visible() {
            return this.Spine2D;
        }
    })
    @property({
        tooltip:
            'Spine2D動畫循環模式(或DragonBone動畫) - 面板器中無sp.Skeleton或dragonBones.ArmatureDisplay時無任何作用', displayName: 'Spine2d動畫循環'
    })
    public IsSpineAnimationLoop: boolean = false;

    @property({
        visible() {
            return this.Spine2DAdd;
        }
    })
    @property({ tooltip: '播放Spine2D混合添加動畫 - 面板器中無sp.Skeleton時無任何作用', displayName: 'Spine2d混合動畫播放' })
    public IsSpine2DAddPlay: boolean = false;

    @property({
        visible() {
            return this.Spine2DAdd;
        }
    })
    @property({
        tooltip: 'Spine2D混合添加動畫軌道 - 預設添加軌道為第1軌,可以依照需求設定2~4軌,註:第0軌為一般播放Spine2D動畫軌道', displayName: 'Spine2d混合動畫軌道'
    })
    public Spine2DAddAnimationTrack: number = 1;

    @property({
        visible() {
            return this.Spine2DAdd;
        }
    })
    @property({
        tooltip: 'Spine2D混合添加動畫狀態編號 - 設定要播的sp.Skeleton添加動畫編號,面板器中無sp.Skeleton時無任何作用', displayName: 'Spine2d混合動畫狀態'
    })
    public Spine2DAddAnimationState: number = 0;

    @property({
        visible() {
            return this.Spine2DAdd;
        }
    })
    @property({ tooltip: 'Spine2D混合添加動畫循環模式 - 面板器中無Skeleton時無任何作用', displayName: 'Spine2d混合動畫循環' })
    public IsSpineAnimationAddLoop: boolean = false;

    @property({
        visible() {
            return this.Particle;
        }
    })
    @property({ type: ParticleContentTool, displayName: '播放粒子' })
    public PlayParticle: Array<ParticleContentTool> = [];

    @property({
        visible() {
            return this.Particle;
        }
    })
    @property({ type: IsStopParticle, displayName: '停止播放粒子' })
    StopParticle: Array<IsStopParticle> = [];

    @property({
        visible() {
            return this.Audio;
        }
    })
    @property({ type: [CCString], displayName: '播放音樂音效名字' })
    public PlayAudio_Name: string[] = [];

    @property({
        visible() {
            return this.Audio;
        }
    })
    @property({ type: [CCString], displayName: '停止播放音樂音效名字' })
    public StopAudio_Name: string[] = [];
}

@ccclass('AnimationList')
export class AnimationList {
    @property({ type: CCString, tooltip: '可以設定此編輯動畫列名字',displayName: '動畫列表名字' }) public List_Name: string = '';

    @property({
        tooltip:
            '開關打開為動畫列時間依照cc.Animation來運行,關閉為依照Spine2D動畫循環模式(或DragonBone動畫)來運行',displayName: '動畫時間依循設定'
    })
    public AnimationFlowIsDependOnCocosAnimation: boolean = true;

    @property({ tooltip: '設定延遲秒數',displayName:'延遲動畫列時間設定' }) public DelayTime: number = 0;

    @property({ type: [AnimationState], tooltip: '可能有單組或多組動畫狀態編輯設定',displayName:'動畫狀態器' })
    AnimationState: Array<AnimationState> = [];

    @property({
        tooltip:
            '動畫列播放完成時是否讓物件開啟或關閉設定,註:預設為關閉,關閉時能減少效能(DrawCall與面數繪製)消耗',displayName:'動畫列播放完成時物件狀態設定'
    })
    public IsAnimationOverActiveType: boolean = false;

    @property({ tooltip: '動畫列的循環,註:開啟時動畫狀態列完整播放完畢回持續循環',displayName:'動畫列播放循環設定' })
    public ListLoop: boolean = false;

    public CallBack: any = null;
}

@ccclass('CocosAnimationMultiTool')
export class CocosAnimationMultiTool extends Component {
    @property({
        tooltip:
            '預設物件開啟或關閉設定,註:預設為關閉,關閉時能減少效能(DrawCall與面數繪製)消耗',displayName:'動畫列預設物件狀態設定' 
    })
    public DefaultActive: boolean = false;

    @property({
        type: CCString,
        tooltip: '可以設定sp.Skeleton或dragonBones.ArmatureDisplay動畫列名字到相對應所使用的ID',displayName:'Spine2D動畫名列表' 
    })
    public SpineAnimationIndex: string[] = [];

    @property({ type: [AnimationList], displayName: '動畫狀態列' }) AnimationList: Array<AnimationList> = [];

    private AnimationListNum = 0;

    private CCAnimationStringNum: string = '';

    private SpineAnimatActionType: boolean = false;

    private SpineStringNum: string = '';

    private SpineStringAddNum: string = '';

    private SpineStringAddNumTrack: number = 0;

    private SpineAnimatAddActionType: boolean = false;

    private AnimationStateNum: number = 0;

    private Animation: Animation | null = null;

    private Spine2D: sp.Skeleton | null = null;

    //private DragonBone: dragonBones.ArmatureDisplay | null = null;

    private IsDragonBoneAnimatActionTypeNum: number = 0;

    private IsCurrentAnimatNum: number = 0;

    private IsListPlay: boolean = false;

    /* 初始化運作-----------------------------------------------------------------------------------------------------------------------------

    1.取得掛件上Animation,Spine2D,DragonBone資訊

    2.依照初始物件設定開關物件

    */
    onLoad() {
        this.Animation = this.getComponent(Animation);

        this.Spine2D = this.getComponent(sp.Skeleton);

        //this.DragonBone = this.getComponent(dragonBones.ArmatureDisplay);

        if (this.DefaultActive == false) {
            this.node.active = false;
        }
    }

    /* 初始播放(動畫線ID,CallBack回調事件,Skip狀態回調事件,註:初始為True)-----------------------------------------------------------------------------------------------------------------------------

    1.判斷是否Skip狀態

    2.更新動畫列態列與動畫狀態器ID

    3.清空計時器

    4.新增計時器數值

    5.粒子狀態設定(播放或停止)

    6.導向各動畫播放流程(Animation,Spine2D,DragonBone)

    */
    public OnPlay(AnimationList: number, cb: any | null = null, IsCB: boolean = true) {
        if (this.IsListPlay == true) {
            for (let i = 0; i < this.AnimationList.length; i++) {
                if (IsCB == true) {
                    if (this.AnimationList[i]?.CallBack != null) {
                        this.AnimationList[i]?.CallBack();
                    }
                }

                this.AnimationList[i].CallBack = null;
            }

            this.IsListPlay = false;
        }

        this.IsListPlay = true;

        this.node.active = true;

        if (this.AnimationList.length == 0) return;

        this.AnimationListNum = AnimationList;

        if (this.AnimationListNum >= this.AnimationList.length) {
            this.AnimationListNum = this.AnimationList.length - 1;
        }

        if (cb) {
            this.AnimationList[this.AnimationListNum].CallBack = () => cb();
        }

        if (this.AnimationList[this.AnimationListNum].AnimationState.length != 0) {
            if (this.AnimationListNum >= this.AnimationList.length - 1) {
                this.AnimationListNum = this.AnimationList.length - 1;
            }

            this.AnimationStateNum = 0;

            this.UpdateAnimationTimeLineData();

            this.unscheduleAllCallbacks();

            if (this.Animation) {
                this.scheduleOnce(() => this.AnimationStatePlay(), this.AnimationList[this.AnimationListNum].DelayTime);
            }

            if (this.Spine2D) {
                this.scheduleOnce(() => this.Spin2DPlay(), this.AnimationList[this.AnimationListNum].DelayTime);
            }

            // if (this.DragonBone) {
            //     this.scheduleOnce(() => this.DragonBonePlay(), this.AnimationList[this.AnimationListNum].DelayTime);
            // }
        }
    }

    /* 更新動畫時間線資訊-----------------------------------------------------------------------------------------------------------------------------

    1.更新cc.Animation動畫狀態器資料

    2.更新sp.Spine2D動畫狀態器資料

    3.更新dragonBone動畫狀態器資料

    */
    private UpdateAnimationTimeLineData() {
        if (this.Animation) {
            this.CCAnimationStringNum =
                this.Animation.clips[
                    this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].CocosAnimationState
                ]!.name;
        }

        if (this.Spine2D) {
            this.SpineStringNum =
                this.SpineAnimationIndex[
                    this.AnimationList[this.AnimationListNum].AnimationState[
                        this.AnimationStateNum
                    ].Spine2DAnimationState
                ];

            this.SpineAnimatActionType =
                this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].IsSpineAnimationLoop;

            if (this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].IsSpine2DAddPlay) {
                this.SpineStringAddNumTrack =
                    this.AnimationList[this.AnimationListNum].AnimationState[
                        this.AnimationStateNum
                    ].Spine2DAddAnimationTrack;

                this.SpineStringAddNum =
                    this.SpineAnimationIndex[
                        this.AnimationList[this.AnimationListNum].AnimationState[
                            this.AnimationStateNum
                        ].Spine2DAddAnimationState
                    ];

                this.SpineAnimatAddActionType =
                    this.AnimationList[this.AnimationListNum].AnimationState[
                        this.AnimationStateNum
                    ].IsSpineAnimationAddLoop;
            }
        }

        // if (this.DragonBone) {
        //     this.SpineStringNum =
        //         this.SpineAnimationIndex[
        //             this.AnimationList[this.AnimationListNum].AnimationState[
        //                 this.AnimationStateNum
        //             ].Spine2DAnimationState
        //         ];

        //     this.SpineAnimatActionType =
        //         this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].IsSpineAnimationLoop;

        //     if (this.SpineAnimatActionType == true) {
        //         this.IsDragonBoneAnimatActionTypeNum = 0;
        //     } else if (this.SpineAnimatActionType == false) {
        //         this.IsDragonBoneAnimatActionTypeNum = 1;
        //     }
        // }
    }

    /* cc.Animation播放-----------------------------------------------------------------------------------------------------------------------------

    1.animation片段CallBack取消

    2.animation片段狀態設定以及判斷CallBack

    3.animationq判斷是否進入接續片段

    */
    private AnimationStatePlay() {
        let ListNum = this.AnimationListNum;

        this.Animation?.off(Animation.EventType.FINISHED, this.SetAnimationFinished, this);

        if (this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].IsAnimationPlay) {
            this.Animation?.play(this.CCAnimationStringNum);

            this.ParticleFunction();

            //this.AudioFunction();

            const AnimationState = this.Animation?.getState(this.CCAnimationStringNum);

            if (AnimationState?.wrapMode == AnimationClip.WrapMode.Loop) {
                this.IsListPlay = false;

                const CurrentAction = this.AnimationList[ListNum].CallBack;

                this.AnimationList[ListNum].CallBack = null;

                CurrentAction?.();
            }
        } else {
            this.SetAnimationFinished();
        }

        if (this.AnimationList[this.AnimationListNum].AnimationFlowIsDependOnCocosAnimation == true) {
            this.Animation?.on(Animation.EventType.FINISHED, this.SetAnimationFinished, this);
        }

        if (this.AnimationStateNum > this.AnimationList[this.AnimationListNum].AnimationState.length - 1) {
            this.AnimationStateNum = 0;
        }
    }

    /* cc.Animation接續播放-----------------------------------------------------------------------------------------------------------------------------

    1.animation接續片段狀態設定以及判斷CallBack

    2.animationq判斷是否進入接續片段或結束

    3.粒子狀態設定(播放或停止)

    */
    private SetAnimationFinished() {
        let ListNum = this.AnimationListNum;

        if (this.AnimationList[this.AnimationListNum].AnimationState.length > this.AnimationStateNum) {
            this.AnimationStateNum++;

            if (this.AnimationStateNum > this.AnimationList[this.AnimationListNum].AnimationState.length - 1) {
                this.AnimationStateNum = 0;

                this.IsListPlay = false;

                const CurrentAction = this.AnimationList[ListNum].CallBack;

                this.node.active = this.AnimationList[this.AnimationListNum].IsAnimationOverActiveType;

                this.Animation?.off(Animation.EventType.FINISHED, this.SetAnimationFinished, this);

                if (this.AnimationList[this.AnimationListNum].ListLoop == true) {
                    this.OnPlay(this.AnimationListNum);
                } else {
                    this.AnimationList[ListNum].CallBack = null;
                }

                CurrentAction?.();
            } else {
                this.UpdateAnimationTimeLineData();

                this.ParticleFunction();

                //this.AudioFunction();

                if (this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].IsAnimationPlay) {
                    this.Animation?.play(this.CCAnimationStringNum);

                    const AnimationState = this.Animation?.getState(this.CCAnimationStringNum);

                    if (AnimationState?.wrapMode == AnimationClip.WrapMode.Loop) {
                        this.IsListPlay = false;

                        this.node.active = true;

                        const CurrentAction = this.AnimationList[ListNum].CallBack;

                        this.AnimationList[ListNum].CallBack = null;

                        CurrentAction?.();
                    }
                } else {
                    this.SetAnimationFinished();
                }

                if (this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].IsSpine2DPlay) {
                    this.Spine2D?.clearTracks();
                    this.Spine2D?.setAnimation(0, this.SpineStringNum, this.SpineAnimatActionType);

                    //this.DragonBone?.playAnimation(this.SpineStringNum, this.IsDragonBoneAnimatActionTypeNum);
                }

                this.Spin2DAddPlay();

                if (this.CCAnimationStringNum != null) {
                    this.Animation?.on(Animation.EventType.FINISHED, this.SetAnimationFinished, this);
                } else {
                    this.AnimationStateNum = 0;

                    this.IsListPlay = false;

                    const CurrentAction = this.AnimationList[ListNum].CallBack;

                    this.AnimationList[ListNum].CallBack = null;

                    CurrentAction?.();

                    this.Animation?.off(Animation.EventType.FINISHED, this.SetAnimationFinished, this);
                }

                if (this.AnimationList[this.AnimationListNum].AnimationState.length == 1) {
                    this.Animation?.off(Animation.EventType.FINISHED, this.SetAnimationFinished, this);
                }
            }
        }
    }

    /* Spine2D播放-----------------------------------------------------------------------------------------------------------------------------

    1.sp.Skeleton片段CallBack取消

    2.sp.Skeleton片段狀態設定以及判斷CallBack

    3.sp.Skeleton判斷是否進入接續片段

    */
    private Spin2DPlay() {
        let ListNum = this.AnimationListNum;

        this.Spine2D?.setCompleteListener(this.Empty);

        if (this.SpineAnimatActionType) {
            if (this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].IsSpine2DPlay) {
                this.Spine2D?.clearTracks();
                this.Spine2D?.setAnimation(0, this.SpineStringNum, this.SpineAnimatActionType);

                this.ParticleFunction();

                //this.AudioFunction();
            }

            this.IsListPlay = false;

            const CurrentAction = this.AnimationList[ListNum].CallBack;

            this.AnimationList[ListNum].CallBack = null;

            CurrentAction?.();
        } else {
            if (this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].IsSpine2DPlay) {
                this.Spine2D?.clearTracks();
                this.Spine2D?.setAnimation(0, this.SpineStringNum, this.SpineAnimatActionType);

                this.ParticleFunction();

                if (this.AnimationList[this.AnimationListNum].AnimationFlowIsDependOnCocosAnimation == false) {
                    this.SetCompleteListener();
                }
            }

            this.Spin2DAddPlay();

            if (this.AnimationStateNum > this.AnimationList[this.AnimationListNum].AnimationState.length - 1) {
                this.AnimationStateNum = 0;
            }
        }
    }

    //Spine2D混合動畫播放-----------------------------------------------------------------------------------------------------------------------------
    private Spin2DAddPlay() {
        if (this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].IsSpine2DAddPlay) {
            this.ParticleFunction();
            for (let i = 1; i < 10; i++) {
                this.Spine2D.clearTrack(i);
            }

            this.Spine2D?.addAnimation(
                this.SpineStringAddNumTrack,
                this.SpineStringAddNum,
                this.SpineAnimatAddActionType
            );
        }
    }

    /* Spine2D接續播放-----------------------------------------------------------------------------------------------------------------------------

    1.Spine2D接續片段狀態設定以及判斷CallBack

    2.Spine2D判斷是否進入接續片段或結束

    3.粒子狀態設定(播放或停止)

    */
    private SetCompleteListener() {
        let ListNum = this.AnimationListNum;

        this.Spine2D?.setCompleteListener(() => {
            if (this.AnimationList[this.AnimationListNum].AnimationState.length > this.AnimationStateNum) {
                if (this.SpineAnimatActionType) {
                    this.IsCurrentAnimatNum = 10000;
                } else {
                    this.IsCurrentAnimatNum =
                        this.AnimationList[this.AnimationListNum].AnimationState[
                            this.AnimationStateNum
                        ].Spine2DAnimationState;
                }

                this.AnimationStateNum++;

                if (this.AnimationStateNum > this.AnimationList[this.AnimationListNum].AnimationState.length - 1) {
                    this.AnimationStateNum = 0;

                    this.IsListPlay = false;

                    const CurrentAction = this.AnimationList[ListNum].CallBack;

                    this.node.active = this.AnimationList[this.AnimationListNum].IsAnimationOverActiveType;

                    this.Spine2D?.setCompleteListener(this.Empty);

                    if (this.AnimationList[this.AnimationListNum].ListLoop == true) {
                        this.OnPlay(this.AnimationListNum);
                    } else {
                        this.AnimationList[ListNum].CallBack = null;
                    }

                    CurrentAction?.();
                } else {
                    if (this.Spine2D?.animation == this.SpineAnimationIndex[this.IsCurrentAnimatNum]) {
                        this.UpdateAnimationTimeLineData();

                        this.ParticleFunction();

                        //this.AudioFunction();

                        if (
                            this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum]
                                .IsAnimationPlay
                        ) {
                            this.Animation?.play(this.CCAnimationStringNum);

                            if (this.SpineAnimatActionType == true) {
                                this.node.active = true;

                                this.IsListPlay = false;

                                const CurrentAction = this.AnimationList[ListNum].CallBack;

                                this.AnimationList[ListNum].CallBack = null;

                                CurrentAction?.();
                            }
                        }

                        if (
                            this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum]
                                .IsSpine2DPlay
                        ) {
                            this.Spine2D?.clearTracks();
                            this.Spine2D?.setAnimation(0, this.SpineStringNum, this.SpineAnimatActionType);
                        }

                        if (this.AnimationList[this.AnimationListNum].AnimationState.length == 1) {
                            this.Spine2D?.setCompleteListener(this.Empty);
                        }
                    } else {
                        this.UpdateAnimationTimeLineData();

                        this.ParticleFunction();

                        //this.AudioFunction();

                        if (
                            this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum]
                                .IsAnimationPlay
                        ) {
                            this.Animation?.play(this.CCAnimationStringNum);
                        }

                        if (
                            this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum]
                                .IsSpine2DPlay
                        ) {
                            this.Spine2D?.clearTracks();
                            this.Spine2D?.setAnimation(0, this.SpineStringNum, this.SpineAnimatActionType);
                        }
                    }

                    this.Spin2DAddPlay();

                    if (this.SpineStringNum != '') {
                        this.SetCompleteListener();
                    } else {
                        this.AnimationStateNum = 0;

                        this.IsListPlay = false;

                        const CurrentAction = this.AnimationList[ListNum].CallBack;

                        this.AnimationList[ListNum].CallBack = null;

                        this.Spine2D?.setCompleteListener(this.Empty);

                        CurrentAction?.();
                    }
                }
            }
        });
    }

    /*空Function-----------------------------------------------------------------------------------------------------------------------------

    1.使用於Spine2D在回調時所塞入的空狀態寫法

    */
    private Empty() {
        return null;
    }

    /* DragonBone播放-----------------------------------------------------------------------------------------------------------------------------

    1.DragonBone片段CallBack取消

    2.DragonBone片段狀態設定以及判斷CallBack

    3.DragonBone判斷是否進入接續片段

    */
    /*private DragonBonePlay() {
        let ListNum = this.AnimationListNum;

        this.unschedule(() =>
            this.DragonBone?.playAnimation(this.SpineStringNum, this.IsDragonBoneAnimatActionTypeNum)
        );

        if (this.IsDragonBoneAnimatActionTypeNum == 0) {
            this.DragonBone?.playAnimation(this.SpineStringNum, this.IsDragonBoneAnimatActionTypeNum);

            this.ParticleFunction();

            //this.AudioFunction();

            if (this.SpineAnimatActionType == true) {
                this.node.active = true;

                this.IsListPlay = false;

                const CurrentAction = this.AnimationList[ListNum].CallBack;

                this.AnimationList[ListNum].CallBack = null;

                CurrentAction?.();
            } else {
                this.node.active = this.AnimationList[this.AnimationListNum].IsAnimationOverActiveType;
            }
        } else {
            this.DragonBone?.playAnimation(this.SpineStringNum, this.IsDragonBoneAnimatActionTypeNum);

            if (this.AnimationList[this.AnimationListNum].AnimationFlowIsDependOnCocosAnimation == false) {
                this.SetDragonBoneCallBackAction();
            }
        }

        if (this.AnimationStateNum > this.AnimationList[this.AnimationListNum].AnimationState.length - 1) {
            this.AnimationStateNum = 0;
        }
    }*/

    /*DragonBone接續播放-----------------------------------------------------------------------------------------------------------------------------

    1.DragonBone接續片段狀態設定以及判斷CallBack

    2.DragonBone判斷是否進入接續片段或結束

    3.粒子狀態設定(播放或停止)

    */
    /*private SetDragonBoneCallBackAction() {
        let ListNum = this.AnimationListNum;

        this.DragonBone?.addEventListener(
            dragonBones.EventObject.COMPLETE,
            () => {
                if (this.AnimationList[this.AnimationListNum].AnimationState.length > this.AnimationStateNum) {
                    if (this.SpineAnimatActionType) {
                        this.IsCurrentAnimatNum = 10000;
                    } else {
                        this.IsCurrentAnimatNum =
                            this.AnimationList[this.AnimationListNum].AnimationState[
                                this.AnimationStateNum
                            ].Spine2DAnimationState;
                    }

                    this.AnimationStateNum++;

                    if (this.AnimationStateNum > this.AnimationList[this.AnimationListNum].AnimationState.length - 1) {
                        this.AnimationStateNum = 0;

                        this.IsListPlay = false;

                        const CurrentAction = this.AnimationList[ListNum].CallBack;

                        this.node.active = this.AnimationList[this.AnimationListNum].IsAnimationOverActiveType;

                        this.DragonBone?.removeEventListener(
                            dragonBones.EventObject.COMPLETE,
                            this.SetDragonBoneCallBackAction(),
                            this
                        );

                        if (this.AnimationList[this.AnimationListNum].ListLoop == true) {
                            this.OnPlay(this.AnimationListNum);
                        } else {
                            this.AnimationList[ListNum].CallBack = null;
                        }

                        CurrentAction?.();
                    } else {
                        if (this.DragonBone?.animationName == this.SpineAnimationIndex[this.IsCurrentAnimatNum]) {
                            this.UpdateAnimationTimeLineData();

                            this.ParticleFunction();

                            //this.AudioFunction();

                            if (
                                this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum]
                                    .IsAnimationPlay
                            ) {
                                this.Animation?.play(this.CCAnimationStringNum);

                                if (this.SpineAnimatActionType == true) {
                                    this.node.active = true;

                                    this.IsListPlay = false;

                                    const CurrentAction = this.AnimationList[ListNum].CallBack;

                                    this.AnimationList[ListNum].CallBack = null;

                                    CurrentAction?.();
                                }
                            }

                            if (this.AnimationList[this.AnimationListNum].AnimationState.length == 1) {
                                this.DragonBone?.removeEventListener(
                                    dragonBones.EventObject.COMPLETE,
                                    this.SetDragonBoneCallBackAction(),
                                    this
                                );
                            }
                        } else {
                            this.UpdateAnimationTimeLineData();

                            this.ParticleFunction();

                            //this.AudioFunction();

                            if (
                                this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum]
                                    .IsAnimationPlay
                            ) {
                                this.Animation?.play(this.CCAnimationStringNum);
                            }

                            if (
                                this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum]
                                    .IsSpine2DPlay
                            ) {
                                this.DragonBone?.playAnimation(
                                    this.SpineStringNum,
                                    this.IsDragonBoneAnimatActionTypeNum
                                );

                                if (this.SpineStringNum != '') {
                                    this.SetDragonBoneCallBackAction();
                                } else {
                                    this.AnimationStateNum = 0;

                                    this.IsListPlay = false;

                                    const CurrentAction = this.AnimationList[ListNum].CallBack;

                                    this.AnimationList[ListNum].CallBack = null;

                                    this.DragonBone?.removeEventListener(
                                        dragonBones.EventObject.COMPLETE,
                                        this.SetDragonBoneCallBackAction(),
                                        this
                                    );

                                    CurrentAction?.();
                                }
                            }
                        }
                    }
                }
            },
            this
        );
    }*/

    /*粒子狀態執行-----------------------------------------------------------------------------------------------------------------------------

    1.判斷是否有粒子播放設定

    2.判斷是否有粒子停止播放設定

    3.依存在ParticleContentTool上

    */
    private ParticleFunction(IsCheckPlay: boolean = true, DelayTime: number = 0) {
        for (
            let i = 0;
            i < this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].StopParticle.length;
            i++
        ) {
            this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].StopParticle[
                i
            ].IsStopParticle?.ParticleStop();

            if (
                this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].StopParticle[i]
                    .IsParticleClear
            ) {
                this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].StopParticle[
                    i
                ].IsStopParticle?.ParticleClear();
            }
        }

        for (
            let i = 0;
            i < this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].PlayParticle.length;
            i++
        ) {
            this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].PlayParticle[
                i
            ]?.ParticlePlay(IsCheckPlay, DelayTime);
        }
    }

    /*Audio狀態執行-----------------------------------------------------------------------------------------------------------------------------

    1.判斷動畫片段狀態是否播放特定音效

    2.判斷動畫片段狀態是否停止播放特定音效

    3.依存於HowlerAudioManager

    */
    private AudioFunction() {
        for (
            let i = 0;
            i < this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].PlayAudio_Name.length;
            i++
        ) {
            //AudioManager.Instance.play(this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum]?.PlayAudio_Name[i]);
        }

        for (
            let i = 0;
            i < this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum].StopAudio_Name.length;
            i++
        ) {
            //AudioManager.Instance.play(this.AnimationList[this.AnimationListNum].AnimationState[this.AnimationStateNum]?.PlayAudio_Name[i]);
        }
    }
}
