import { _decorator, Component, AudioClip, game, Prefab, resources } from 'cc';
import { Logger } from '../../core/utils/Logger';
import { PoolManager } from '../../sgv3/PoolManager';
import { AudioContainer } from './AudioContainer';
import { AudioSourcePool } from './AudioSourcePool';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    private static _instance: AudioManager;

    public static get Instance(): AudioManager {
        if (this._instance == null) {
            this._instance = new AudioManager();
        }
        return this._instance;
    }

    @property({ type: Prefab })
    private audioContainerPrefab: Prefab;
    //
    private activePool: Array<AudioContainer> = new Array();
    //
    private _audioClipsMap: Map<string, AudioClip>;
    private get audioClipsMap() {
        if (!this._audioClipsMap) {
            this._audioClipsMap = new Map<string, AudioClip>();
        }
        return this._audioClipsMap;
    }
    //
    private mute: boolean = false;
    //
    private audioSourcePool: AudioSourcePool;

    private audioPrefix: string = 'Audio/';

    private preloadList: string[] = ['Preload'];

    private loadList: string[] = ['SFX', 'BGM', 'Scoring', 'Vocal'];

    private activeAudioMaxCount: number = 32;

    onLoad() {
        AudioManager._instance = this;
        this.init();
    }

    private init() {
        this.audioSourcePool = new AudioSourcePool();
        this.preloadAudio();
    }

    preloadAudio() {
        let promiseList = [];
        this.preloadList.forEach((value) => promiseList.push(this.downloadClip(this.getAudioPath(value))));
        Promise.all(promiseList);
    }

    //聲音名稱與clip Mapping
    loadAudio() {
        let promiseList = [];
        while (this.loadList.length > 0) {
            let value = this.loadList.pop();
            promiseList.push(this.downloadClip(this.getAudioPath(value)));
        }
        Promise.all(promiseList).finally(() => this.resumeClip());
    }

    private getAudioPath(name) {
        return this.audioPrefix + name;
    }

    private downloadClip(dir: string) {
        return new Promise((resolve, reject) => {
            resources.loadDir<AudioClip>(dir, (error, audios) => {
                if (error) {
                    return reject(error);
                }
                audios.forEach((clip) => {
                    this.audioClipsMap.set(clip.name, clip);
                    this.audioSourcePool.returnAudioSource(this.audioSourcePool.getAudioSource(clip));
                });
                resolve(dir);
            });
        });
    }

    private resumeClip() {
        this.activePool
            .filter((audio) => audio.audioSource.clip == null)
            .forEach((audio) => {
                if (audio.audioSource.loop == true) {
                    audio.audioSource.clip = this.audioClipsMap.get(audio.clipName);
                    audio.audioSource.play();
                }
                else {
                    this.returnToPool(audio);
                }
            }, this);
    }

    play(clipName: string) {
        if (this.activePool.length >= this.activeAudioMaxCount) {
            Logger.w('音效播放數量已達上限,當前音效量: ' + this.activePool.length);
        }
        let audioContainer = this.createAudioContainerFromPool({ clipName: clipName });
        
        if(audioContainer.audioSource.clip == null) {
            audioContainer.init();
        }

        const options = {
            fade(vol: number, duration: number) {
                audioContainer.fade({ vol: vol, duration: duration });
                return options;
            },
            volume(vol: number) {
                audioContainer.volume = vol;
                return options;
            },
            loop(loop: boolean) {
                audioContainer.loop = loop;
                return options;
            },
            callback(cb: () => void) {
                audioContainer.playCallback = cb;
                return options;
            },
            replay() {
                audioContainer.replay();
                return options;
            }
        };
        audioContainer.play();
        return options;
    }

    fade(clipName: string, volume: number, duration: number, endFn?: () => void) {
        let audioContainer = this.getAudioContainerInActivePool(clipName);
        audioContainer?.fade({ vol: volume, duration: duration, endFn: endFn });
    }

    stop(clipName: string) {
        let audioContainer = this.getAudioContainerInActivePool(clipName);

        const options = {
            fade(vol: number, duration: number) {
                audioContainer?.fade({ vol: vol, duration: duration, completeThenStop: true });
                return options;
            },
            callback(cb: () => void) {
                audioContainer.stopCallback = cb;
                return options;
            }
        };
        audioContainer?.fade({ vol: audioContainer.volume, duration: 0, completeThenStop: true });
        return options;
    }

    private createAudioContainerFromPool({
        volume = 1,
        loop = false,
        clipName = null,
        mute = this.mute
    }: audioContainerPara): AudioContainer {
        let clip = this.audioClipsMap.get(clipName);
        let audioSourceContainerNode = PoolManager.instance.getNode(this.audioContainerPrefab, this.node);
        let audioSourceContainer = audioSourceContainerNode.getComponent(AudioContainer);

        audioSourceContainer.audioSource = this.audioSourcePool.getAudioSource(clip);
        audioSourceContainer.clipName = clipName;
        audioSourceContainer.volume = volume;
        audioSourceContainer.loop = loop;
        audioSourceContainer.mute = mute;

        this.activePool.push(audioSourceContainer);

        return audioSourceContainer;
    }

    returnToPool(audioContainer: AudioContainer) {
        let index = this.activePool.indexOf(audioContainer);
        if (index != -1) {
            this.activePool.splice(index, 1);
            this.audioSourcePool.returnAudioSource(audioContainer.audioSource);
            PoolManager.instance.putNode(audioContainer.node);
        }
    }

    //回傳activePool中對應名稱的單一AudioContainer
    private getAudioContainerInActivePool(clipName: string): AudioContainer {
        {
            let audioContanier: AudioContainer = this.activePool.find((x) => {
                return x.clipName == clipName;
            });
            return audioContanier;
        }
    }

    /**聲音總開關 */
    audioOnOff(onOff: boolean) {
        this.mute = !onOff;
        this.activePool.forEach((x) => {
            x.mute = this.mute;
        });
    }
}

export interface audioContainerPara {
    volume?: number;
    loop?: boolean;
    clipName: string;
    mute?: boolean;
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
