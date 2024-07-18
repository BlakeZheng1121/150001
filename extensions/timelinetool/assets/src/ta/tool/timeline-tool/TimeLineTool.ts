import { _decorator, Component, CCClass, __private, Animation } from "cc";
import { EDITOR } from "cc/env";
import { ParticleState, Timeline, TimelineType } from "./ToolData";

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("TimeLineTool")
@executeInEditMode(true)
export class TimeLineTool extends Component {
  @property({ type: [Timeline] })
  public arrayTimelineData: Timeline[] = [];
  _isPlaying: boolean = false;

  update() {
    this.updateEditorEnum();
  }

  SetTimelineSpineData(timelineIndex: number, timelineDataIndex: number) {
    let timlineSpineName = Object.getOwnPropertyDescriptor(
      this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timelineSpine.skeletonData.getAnimsEnum(),
      this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timelineSpineName
    ).value;

    this.scheduleOnce(() => {
      this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timelineSpine.node.active = true;
      this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timelineSpine.timeScale =
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timeScale;

      let trackEntry = this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timelineSpine.setAnimation(
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.trackIndex,
        timlineSpineName,
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.isLoop
      );
      this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.trackEntry = trackEntry;

      this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timelineSpine.setTrackCompleteListener(
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.trackEntry, 
        () => {
          this.scheduleOnce(() => {
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timelineSpine.setTrackCompleteListener(
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.trackEntry, () => {});
            if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.isLoop === true) {
              return;
            }
            this.checkTimelineEnd(timelineIndex);
            if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.isEndClose === true) {
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timelineSpine.clearTrack(
                this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.trackIndex
              );
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.timelineSpine.node.active = false;
            }
          });
        });
    }, this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.delayTime);
  }

  SetTimelineSpineDataAppendSpine(timelineIndex: number, timelineDataIndex: number) {
    if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.useSpine) {
      let spineName = Object.getOwnPropertyDescriptor(
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.spine.skeletonData.getAnimsEnum(),
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.spineName
      ).value;

      this.scheduleOnce(() => {
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.spine.node.active = true;

        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.spine.timeScale =
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.timeScale;
        let trackEntry = this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.spine.setAnimation(
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.trackIndex,
          spineName,
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.isLoop
        );
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.trackEntry = trackEntry;
        
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.spine.setTrackCompleteListener(
          trackEntry, 
          () => {
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.spine.setTrackCompleteListener(
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.trackEntry, () => {});
            if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.isEndClose) {
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.spine.clearTrack(
                this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.trackIndex
              );
    
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.spine.node.active = false;
            }
          });
      }, this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.spineSetupData.delayTime);
    }
  }

  SetTimelineSpineDataAppendAnimation(timelineIndex: number, timelineDataIndex: number) {
    if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.useAnim) {
      let animationName =
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.animSetupData.animation.clips[
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.animSetupData.animationName
        ].name;

      this.scheduleOnce(() => {
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.animSetupData.animation.play(animationName);
      }, this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.animSetupData.delayTime);
    }
  }

  SetTimelineSpineDataAppendParticle(timelineIndex: number, timelineDataIndex: number) {
    if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.useParticle) {
      for (let j = 0; j < this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.particleData.length; j++) {
        switch (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.particleData[j].particleState) {
          case ParticleState.Play:
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.particleData[j].particle.ParticleClear();
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.particleData[j].particle.ParticlePlay(
              true,
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.particleData[j].delayTime
            );
            break;
          case ParticleState.Stop:
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineSpine.particleData[j].particle.ParticleStop();
            break;
        }
      }
    }
  }

  SetTimelineAnimationData(timelineIndex: number, timelineDataIndex: number) {
    let timelineAnimationName =
      this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.timelineAnimation.clips[
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.timelineAnimationName
      ].name;

    //TimelineAnimation 的End 事件
    this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.timelineAnimation.on(
      Animation.EventType.FINISHED,
      () => {
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.timelineAnimation.off(Animation.EventType.FINISHED);
        this.checkTimelineEnd(timelineIndex);
      },
      this
    );
    this.scheduleOnce(() => {
      this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.timelineAnimation.play(timelineAnimationName);
    }, this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.delayTime);
  }

  SetTimelineAnimationDataAppendSpine(timelineIndex: number, timelineDataIndex: number) {
    if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.useSpine) {
      let spineName = Object.getOwnPropertyDescriptor(
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.spine.skeletonData.getAnimsEnum(),
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.spineName
      ).value;

      this.scheduleOnce(() => {
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.spine.node.active = true;

        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.spine.timeScale =
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.timeScale;
        let trackEntry = this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.spine.setAnimation(
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.trackIndex,
          spineName,
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.isLoop
        );
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.trackEntry = trackEntry;

        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.spine.setTrackCompleteListener(
          trackEntry,
          () => {
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.spine.setTrackCompleteListener(
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.trackEntry, () => {});
            if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.isEndClose) {
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.spine.clearTrack(
                this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.trackIndex
              );
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.spineSetupData.spine.node.active = false;
            }
          });
      }, this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.delayTime);
    }
  }

  SetTimelineAnimationDataAppendAnimation(timelineIndex: number, timelineDataIndex: number) {
    if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.useAnim) {
      let animationName =
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.animSetupData.animation.clips[
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.animSetupData.animationName
        ].name;

      this.scheduleOnce(() => {
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.animSetupData.animation.play(animationName);
      }, this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.animSetupData.delayTime);
    }
  }

  SetTimelineAnimationDataAppendParticle(timelineIndex: number, timelineDataIndex: number) {
    if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.useParticle) {
      for (let j = 0; j < this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.particleData.length; j++) {
        switch (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.particleData[j].particleState) {
          case ParticleState.Play:
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.particleData[j].particle.ParticleClear();
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.particleData[j].particle.ParticlePlay(
              true,
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.particleData[j].delayTime
            );
            break;
          case ParticleState.Stop:
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineAnimation.particleData[j].particle.ParticleStop();
            break;
        }
      }
    }
  }

  SetTimelineTimeDataAppendSpine(timelineIndex: number, timelineDataIndex: number) {
    if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.useSpine) {
      let spineName = Object.getOwnPropertyDescriptor(
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.spine.skeletonData.getAnimsEnum(),
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.spineName
      ).value;

      this.scheduleOnce(() => {
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.spine.node.active = true;

        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.spine.timeScale =
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.timeScale;
        let trackEntry = this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.spine.setAnimation(
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.trackIndex,
          spineName,
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.isLoop
        );
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.trackEntry = trackEntry;

        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.spine.setTrackCompleteListener(
          trackEntry, 
          () => {
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.spine.setTrackCompleteListener(
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.trackEntry, () => {});
            if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.isEndClose === true) {
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.spine.clearTrack(
                this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.trackIndex
              );
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.spine.node.active = false;
            }
          });
      }, this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.spineSetupData.delayTime);
    }
  }

  SetTimelineTimeDataAppendAnimation(timelineIndex: number, timelineDataIndex: number) {
    if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.useAnim) {
      let animationName =
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.animSetupData.animation.clips[
          this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.animSetupData.animationName
        ].name;

      this.scheduleOnce(() => {
        this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.animSetupData.animation.play(animationName);
      }, this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.animSetupData.delayTime);
    }
  }

  SetTimelineTimeDataAppendParticle(timelineIndex: number, timelineDataIndex: number) {
    if (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.useParticle) {
      for (let j = 0; j < this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.particleData.length; j++) {
        switch (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.particleData[j].particleState) {
          case ParticleState.Play:
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.particleData[j].particle.ParticleClear();
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.particleData[j].particle.ParticlePlay(
              true,
              this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.particleData[j].delayTime
            );
            break;
          case ParticleState.Stop:
            this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.particleData[j].particle.ParticleStop();
            break;
        }
      }
    }
    this.scheduleOnce(() => {
      this.checkTimelineEnd(timelineIndex);
    }, this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineTime.toNextStateTime);
  }

  checkTimelineIndex(timelineIndex: number, timelineDataIndex: number) {
    if (this.isPlaying === false) return;
    switch (this.arrayTimelineData[timelineIndex].timelineData[timelineDataIndex].timelineType) {
      case TimelineType.Spine:
        this.SetTimelineSpineData(timelineIndex, timelineDataIndex);
        this.SetTimelineSpineDataAppendSpine(timelineIndex, timelineDataIndex);
        this.SetTimelineSpineDataAppendAnimation(timelineIndex, timelineDataIndex);
        this.SetTimelineSpineDataAppendParticle(timelineIndex, timelineDataIndex);
        break;
      case TimelineType.Animation:
        this.SetTimelineAnimationData(timelineIndex, timelineDataIndex);
        this.SetTimelineAnimationDataAppendSpine(timelineIndex, timelineDataIndex);
        this.SetTimelineAnimationDataAppendAnimation(timelineIndex, timelineDataIndex);
        this.SetTimelineAnimationDataAppendParticle(timelineIndex, timelineDataIndex);
        break;
      case TimelineType.Time:
        // 分支Spine播放設定
        this.SetTimelineTimeDataAppendSpine(timelineIndex, timelineDataIndex);
        // 分支Animation播放設定
        this.SetTimelineTimeDataAppendAnimation(timelineIndex, timelineDataIndex);
        // 分支Particle播放設定
        this.SetTimelineTimeDataAppendParticle(timelineIndex, timelineDataIndex);
        break;
      default:
        break;
    }
  }

  checkTimelineEnd(timelineIndex: number) {
    this.arrayTimelineData[timelineIndex].timelineDataIndex++;
    if (this.arrayTimelineData[timelineIndex].timelineDataIndex < this.arrayTimelineData[timelineIndex].timelineData.length) {
      this.checkTimelineIndex(timelineIndex, this.arrayTimelineData[timelineIndex].timelineDataIndex);
    } else {
      this.timelineEnd(timelineIndex);
    }
  }

  timelineEnd(timelineIndex: number) {
    let callBack = this.arrayTimelineData[timelineIndex].TimelineEndCallBack;
    this.changeStateInit();
    this.isPlaying = false;
    callBack?.();
  }

  private changeStateInit() {
    this.unscheduleAllCallbacks();
    for (let index = 0; index < this.arrayTimelineData.length; index++) {
      this.arrayTimelineData[index].timelineDataIndex = 0;
      this.arrayTimelineData[index].TimelineEndCallBack = null;
      for (let i = 0; i < this.arrayTimelineData[index].timelineData.length; i++) {
        switch (this.arrayTimelineData[index].timelineData[i].timelineType) {
          case TimelineType.Spine:
            if (this.arrayTimelineData[index].timelineData[i].timelineSpine.trackEntry != null) {
              this.arrayTimelineData[index].timelineData[i].timelineSpine.timelineSpine.setTrackCompleteListener(
                this.arrayTimelineData[index].timelineData[i].timelineSpine.trackEntry, () => {});
            }
            break;
          case TimelineType.Animation:
            this.arrayTimelineData[index].timelineData[i].timelineAnimation.timelineAnimation.off(Animation.EventType.FINISHED);
            break;
          default:
            break;
        }
      }
    }
  }

  public changeState(name: string, cb: Function = () => {}) {
    this.changeStateInit();
    for (let i = 0; i < this.arrayTimelineData.length; i++) {
      if (name === this.arrayTimelineData[i].timelineName) {
        this.arrayTimelineData[i].TimelineEndCallBack = cb;
        this.checkTimelineIndex(i, this.arrayTimelineData[i].timelineDataIndex);
      }
    }
  }
  //--------------------------API---------------------------
  public init() {
    this.unscheduleAllCallbacks();
    for (let index = 0; index < this.arrayTimelineData.length; index++) {
      this.arrayTimelineData[index].timelineDataIndex = 0;
      this.arrayTimelineData[index].TimelineEndCallBack = null;
      for (let i = 0; i < this.arrayTimelineData[index].timelineData.length; i++) {
        switch (this.arrayTimelineData[index].timelineData[i].timelineType) {
          case TimelineType.Spine:
            if (this.arrayTimelineData[index].timelineData[i].timelineSpine.trackEntry != null) {
              this.arrayTimelineData[index].timelineData[i].timelineSpine.timelineSpine.setTrackCompleteListener(
                this.arrayTimelineData[index].timelineData[i].timelineSpine.trackEntry, () => {});
            }
            this.arrayTimelineData[index].timelineData[i].timelineSpine.timelineSpine?.clearTracks();
            if (this.arrayTimelineData[index].timelineData[i].timelineSpine.useSpine) {
              this.arrayTimelineData[index].timelineData[i].timelineSpine.spineSetupData.spine?.clearTracks();
              this.arrayTimelineData[index].timelineData[i].timelineSpine.spineSetupData.spine.node.active = false;
            }
            if (this.arrayTimelineData[index].timelineData[i].timelineSpine.useAnim) {
              this.arrayTimelineData[index].timelineData[i].timelineSpine.animSetupData.animation?.stop();
            }
            if (this.arrayTimelineData[index].timelineData[i].timelineSpine.useParticle) {
              for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData.length; j++) {
                this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].particle?.ParticleClear();
                this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].particle?.unscheduleAllCallbacks();
              }
            }
            break;
          case TimelineType.Animation:
            this.arrayTimelineData[index].timelineData[i].timelineAnimation.timelineAnimation.off(Animation.EventType.FINISHED);
            this.arrayTimelineData[index].timelineData[i].timelineAnimation.timelineAnimation?.stop();
            if (this.arrayTimelineData[index].timelineData[i].timelineAnimation.useSpine) {
              this.arrayTimelineData[index].timelineData[i].timelineAnimation.spineSetupData.spine?.clearTracks();
              this.arrayTimelineData[index].timelineData[i].timelineAnimation.spineSetupData.spine.node.active = false;
            }
            if (this.arrayTimelineData[index].timelineData[i].timelineAnimation.useAnim) {
              this.arrayTimelineData[index].timelineData[i].timelineAnimation.animSetupData.animation?.stop();
            }
            if (this.arrayTimelineData[index].timelineData[i].timelineAnimation.useParticle) {
              for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData.length; j++) {
                this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].particle?.ParticleClear();
                this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].particle?.unscheduleAllCallbacks();
              }
            }
            break;
          case TimelineType.Time:
            //清除重寫
            if (this.arrayTimelineData[index].timelineData[i].timelineTime.useSpine) {
              this.arrayTimelineData[index].timelineData[i].timelineTime.spineSetupData.spine?.clearTracks();
              this.arrayTimelineData[index].timelineData[i].timelineTime.spineSetupData.spine.node.active = false;
            }
            if (this.arrayTimelineData[index].timelineData[i].timelineTime.useAnim) {
              this.arrayTimelineData[index].timelineData[i].timelineTime.animSetupData.animation?.stop();
            }
            if (this.arrayTimelineData[index].timelineData[i].timelineTime.useParticle) {
              for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineTime.particleData.length; j++) {
                this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].particle?.ParticleClear();
                this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].particle?.unscheduleAllCallbacks();
              }
            }
            break;
          default:
            break;
        }
      }
    }
    this.isPlaying = false;
  }

  public setTimeScale(name: string,timeScale:number){
    for (let i = 0; i < this.arrayTimelineData.length; i++) {
      if (name === this.arrayTimelineData[i].timelineName) {
        for(let j in  this.arrayTimelineData[i].timelineData){
          //this.arrayTimelineData[i].timelineData[j].
          switch (this.arrayTimelineData[i].timelineData[j].timelineType) {
            case TimelineType.Spine:
              this.arrayTimelineData[i].timelineData[j].timelineSpine.timeScale = timeScale
              break;
            case TimelineType.Animation:
              this.arrayTimelineData[i].timelineData[j].timelineAnimation.timelineAnimation.clips.forEach((val)=>{
                val.speed = timeScale;
              })
              break;
            case TimelineType.Time:
              //this.arrayTimelineData[i].timelineData[j].timelineSpine.timeScale = timeScale
              break;
            default:
              break;
          }
        }
      }
    }
  }

  public play(name: string, cb?: Function) {
    if (this.isPlaying === true) this.changeState(name, cb);
    else {
      this.isPlaying = true;
      for (let i = 0; i < this.arrayTimelineData.length; i++) {
        if (name === this.arrayTimelineData[i].timelineName) {
          this.arrayTimelineData[i].TimelineEndCallBack = cb;
          this.checkTimelineIndex(i, this.arrayTimelineData[i].timelineDataIndex);
        }
      }
    }
  }

  public stop() {
    this.init();
  }

  public set isPlaying(value: boolean) {
    this._isPlaying = value;
  }

  public get isPlaying() {
    return this._isPlaying;
  }

  //-----------------Editor上面即時更換Enum的內容---------------------------
  updateEditorEnum() {
    if (EDITOR) {
      for (let index = 0; index < this.arrayTimelineData.length; index++) {
        for (let i = 0; i < this.arrayTimelineData[index].timelineData.length; i++) {
          // 主線的Spine設定檔
          if (this.arrayTimelineData[index].timelineData[i].timelineSpine.timelineSpine !== null) {
            this._refreshSecEnum_TimelineSpineName(
              this.arrayTimelineData[index].timelineData[i].timelineSpine.timelineSpine.skeletonData.getAnimsEnum(),
              this.arrayTimelineData[index].timelineData[i].timelineSpine
            );
          } else {
            this._refreshSecEnum_TimelineSpineName({ "<None>": 0 }, this.arrayTimelineData[index].timelineData[i].timelineSpine);
          }
          // Spine分支的Spine & Animation設定檔
          if (this.arrayTimelineData[index].timelineData[i].timelineSpine.spineSetupData.spine !== null) {
            this._refreshSecEnum_SpineName(
              this.arrayTimelineData[index].timelineData[i].timelineSpine.spineSetupData.spine.skeletonData.getAnimsEnum(),
              this.arrayTimelineData[index].timelineData[i].timelineSpine.spineSetupData
            );
          } else {
            this._refreshSecEnum_SpineName({ "<None>": 0 }, this.arrayTimelineData[index].timelineData[i].timelineSpine.spineSetupData);
          }

          if (this.arrayTimelineData[index].timelineData[i].timelineSpine.animSetupData.animation !== null) {
            var AnimEnum: object = {};
            for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineSpine.animSetupData.animation.clips.length; j++) {
              var name: string = this.arrayTimelineData[index].timelineData[i].timelineSpine.animSetupData.animation.clips[j].name;
              AnimEnum = Object.assign(AnimEnum, { [name]: j });
            }
            this._refreshSecEnum_AnimationName(AnimEnum, this.arrayTimelineData[index].timelineData[i].timelineSpine.animSetupData);
          } else {
            this._refreshSecEnum_AnimationName({ "<None>": 0 }, this.arrayTimelineData[index].timelineData[i].timelineSpine.animSetupData);
          }
          //Spine分支的particle設定
          for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData.length; j++) {
            if (this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].particle !== null) {
              this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].isParticleLoop =
                this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].particle.IsLoop;
              this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].initParticleColor =
                this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].particle.InitColor;
              this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].cycleTime =
                this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].particle.LoopOverTime;
              this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].clearParticleTime =
                this.arrayTimelineData[index].timelineData[i].timelineSpine.particleData[j].particle.ClearObjectTime;
            }
          }

          // 主線的Animation設定檔
          if (this.arrayTimelineData[index].timelineData[i].timelineAnimation.timelineAnimation !== null) {
            var AnimEnum: object = {};
            for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineAnimation.timelineAnimation.clips.length; j++) {
              var name: string = this.arrayTimelineData[index].timelineData[i].timelineAnimation.timelineAnimation.clips[j].name;
              AnimEnum = Object.assign(AnimEnum, { [name]: j });
            }
            this._refreshSecEnum_TimelineAnimationName(AnimEnum, this.arrayTimelineData[index].timelineData[i].timelineAnimation);
          } else {
            this._refreshSecEnum_TimelineAnimationName({ "<None>": 0 }, this.arrayTimelineData[index].timelineData[i].timelineAnimation);
          }
          // Animation分支的Spine & Animation設定檔
          if (this.arrayTimelineData[index].timelineData[i].timelineAnimation.spineSetupData.spine !== null) {
            this._refreshSecEnum_SpineName(
              this.arrayTimelineData[index].timelineData[i].timelineAnimation.spineSetupData.spine.skeletonData.getAnimsEnum(),
              this.arrayTimelineData[index].timelineData[i].timelineAnimation.spineSetupData
            );
          } else {
            this._refreshSecEnum_SpineName({ "<None>": 0 }, this.arrayTimelineData[index].timelineData[i].timelineAnimation.spineSetupData);
          }

          if (this.arrayTimelineData[index].timelineData[i].timelineAnimation.animSetupData.animation !== null) {
            var AnimEnum: object = {};
            for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineAnimation.animSetupData.animation.clips.length; j++) {
              var name: string = this.arrayTimelineData[index].timelineData[i].timelineAnimation.animSetupData.animation.clips[j].name;
              AnimEnum = Object.assign(AnimEnum, { [name]: j });
            }
            this._refreshSecEnum_AnimationName(AnimEnum, this.arrayTimelineData[index].timelineData[i].timelineAnimation.animSetupData);
          } else {
            this._refreshSecEnum_AnimationName({ "<None>": 0 }, this.arrayTimelineData[index].timelineData[i].timelineAnimation.animSetupData);
          }
          //Animation分支的particle設定
          for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData.length; j++) {
            if (this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].particle !== null) {
              this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].isParticleLoop =
                this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].particle.IsLoop;
              this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].initParticleColor =
                this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].particle.InitColor;
              this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].cycleTime =
                this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].particle.LoopOverTime;
              this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].clearParticleTime =
                this.arrayTimelineData[index].timelineData[i].timelineAnimation.particleData[j].particle.ClearObjectTime;
            }
          }
          //主線的TimelineTime的Spine & Animation設定
          if (this.arrayTimelineData[index].timelineData[i].timelineTime.spineSetupData.spine !== null) {
            this._refreshSecEnum_SpineName(
              this.arrayTimelineData[index].timelineData[i].timelineTime.spineSetupData.spine.skeletonData.getAnimsEnum(),
              this.arrayTimelineData[index].timelineData[i].timelineTime.spineSetupData
            );
          } else {
            this._refreshSecEnum_SpineName({ "<None>": 0 }, this.arrayTimelineData[index].timelineData[i].timelineTime.spineSetupData);
          }

          if (this.arrayTimelineData[index].timelineData[i].timelineTime.animSetupData.animation !== null) {
            var AnimEnum: object = {};
            for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineTime.animSetupData.animation.clips.length; j++) {
              var name: string = this.arrayTimelineData[index].timelineData[i].timelineTime.animSetupData.animation.clips[j].name;
              AnimEnum = Object.assign(AnimEnum, { [name]: j });
            }
            this._refreshSecEnum_AnimationName(AnimEnum, this.arrayTimelineData[index].timelineData[i].timelineTime.animSetupData);
          } else {
            this._refreshSecEnum_AnimationName({ "<None>": 0 }, this.arrayTimelineData[index].timelineData[i].timelineTime.animSetupData);
          }
          //主線的TimelineTime的particle設定
          for (let j = 0; j < this.arrayTimelineData[index].timelineData[i].timelineTime.particleData.length; j++) {
            if (this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].particle !== null) {
              this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].isParticleLoop =
                this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].particle.IsLoop;
              this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].initParticleColor =
                this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].particle.InitColor;
              this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].cycleTime =
                this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].particle.LoopOverTime;
              this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].clearParticleTime =
                this.arrayTimelineData[index].timelineData[i].timelineTime.particleData[j].particle.ClearObjectTime;
            }
          }
        }
      }
    }
  }

  //-----------------更換Enum內容的Function---------------------------
  _refreshSecEnum_TimelineSpineName(value: {}, myself: any) {
    if (EDITOR) {
      const arr = [];
      for (let key in value) {
        arr.push({ name: key, value: value[key] });
      }
      CCClass.Attr.setClassAttr(myself, "timelineSpineName", "enumList", arr);
    }
  }
  _refreshSecEnum_SpineName(value: {}, myself: any) {
    if (EDITOR) {
      const arr = [];
      for (let key in value) {
        arr.push({ name: key, value: value[key] });
      }
      CCClass.Attr.setClassAttr(myself, "spineName", "enumList", arr);
    }
  }
  _refreshSecEnum_TimelineAnimationName(value: {}, myself: any) {
    if (EDITOR) {
      const arr = [];
      for (let key in value) {
        arr.push({ name: key, value: value[key] });
      }
      CCClass.Attr.setClassAttr(myself, "timelineAnimationName", "enumList", arr);
    }
  }
  _refreshSecEnum_AnimationName(value: {}, myself: any) {
    if (EDITOR) {
      const arr = [];
      for (let key in value) {
        arr.push({ name: key, value: value[key] });
      }
      CCClass.Attr.setClassAttr(myself, "animationName", "enumList", arr);
    }
  }
}
