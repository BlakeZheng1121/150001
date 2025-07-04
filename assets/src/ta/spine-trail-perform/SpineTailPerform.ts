import { _decorator, Component, Prefab, Node } from 'cc';
import { PoolManager } from '../../sgv3/PoolManager';
import { TimelineTool } from 'TimelineTool';

const { ccclass, property } = _decorator;

@ccclass('SpineTailPerform')
export class SpineTailPerform extends Component {
    @property({ type: Node, visible: true })
    public effectTarget: Node | null = null;
    @property({ type: Prefab, visible: true })
    public trailPrefab: Prefab | null = null;
    @property({ type: Prefab, visible: true })

    public spineDragonTrail: TimelineTool[] = [];
    public trailName: string[] = [];

    private listIndex: number = 0;

    private TRAIL_STRING: String = String('Trail'); // trail of DragonBall hit
    private SCORE_STRING: String = String('Score'); 

    private MINI_ENTRY_STRING: String = String('MiniEntry'); // miniGame explosive items

    private dragonBallPos: Array<number> = [10, 5, 0, 11, 6, 1, 12, 7, 2, 13, 8, 3, 14, 9, 4]; // symbol items pos (3 X 5)
    private miniEntryPos: Array<number> = [8, 4, 0, 9, 5, 1, 10, 6, 2, 11, 7, 3]; // miniGame items pos (3 X 4)

    public UpdateAnimationObjectID(index: number, playType: number=0) {
        let trail: TimelineTool = PoolManager.instance.getNode(this.trailPrefab, this.node).getComponent(TimelineTool);

        this.listIndex = index;

        let string;
        if(playType == 2){ // Hold and Spin
            string = this.SCORE_STRING;
        }
        else{
            string = this.TRAIL_STRING;
        }

        let trailName = string + this.dragonBallPos[this.listIndex];

        this.spineDragonTrail.push(trail);
        this.trailName.push(trailName);
    }

    public SpineTrailEffect() {
        let trailName = this.trailName[this.trailName.length - 1];
        this.spineDragonTrail[this.spineDragonTrail.length - 1].play(trailName);

        this.scheduleOnce(() => {
            this.trailName.shift();
            let trail = this.spineDragonTrail.shift();
            PoolManager.instance.putNode(trail.node);
        }, 1);
    }

    public SpineFreeTrailEffect(cb: any | null = null) {
        let trailName = this.trailName[this.trailName.length - 1];
        this.spineDragonTrail[this.spineDragonTrail.length - 1].play(trailName);

        this.scheduleOnce(() => {
            this.trailName.shift();
            let trail = this.spineDragonTrail.shift();
            PoolManager.instance.putNode(trail.node);
        }, 1);
    }

    public SpineMiniEffect(index: number) {
        let trail: TimelineTool = PoolManager.instance.getNode(this.trailPrefab, this.node).getComponent(TimelineTool);

        let trailName = String(this.MINI_ENTRY_STRING) + this.miniEntryPos[index];

        this.spineDragonTrail.push(trail);

        this.scheduleOnce(() => trail.play(trailName), Math.random() * 0.5);

        this.scheduleOnce(() => {
            let trail = this.spineDragonTrail.shift();
            PoolManager.instance.putNode(trail.node);
        }, 3);
    }
}
