import {Spawnable} from '@/objects/spawner'

export default class Enemy extends Spawnable {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
	constructor(scene, disposing) {
        super(disposing)
		this.scene = scene;
    }

    init() {
        this.scene.physics.add.existing(this.obj);

        this.obj.body.setCollideWorldBounds(true);
    }
}