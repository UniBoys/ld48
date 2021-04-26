import {Spawnable} from '@/objects/spawner'

export default class Enemy extends Spawnable {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
	constructor(scene, disposing, maxHealth) {
        super(disposing)
		this.scene = scene;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
    }

    destroy() {}

    damage(amount) {
        this.health -= amount;

        if(this.health < 0) this.destroy();
    }

    init() {
        this.scene.physics.add.existing(this.obj);

        this.obj.body.setCollideWorldBounds(true);
    }

    update(time, delta) {}
}