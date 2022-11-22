import { _decorator, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioSourcePool')
export class AudioSourcePool {
    private reservedPool: Array<AudioSource> = new Array();

    private getNewAudioSource(audioClip: AudioClip): AudioSource {
        const audioSource = new AudioSource();
        audioSource.clip = audioClip;
        return audioSource;
    }

    getAudioSource(clip: AudioClip): AudioSource {
        let index = this.reservedPool.findIndex((audioSource) => audioSource && audioSource.clip == clip);
        let audioSource = index != -1 ? this.reservedPool.splice(index, 1)[0] : this.getNewAudioSource(clip);
        //this.returnAudioSource(audioSource);
        return audioSource;
    }

    returnAudioSource(audioSource: AudioSource) {
        this.reservedPool.push(audioSource);
    }
}
