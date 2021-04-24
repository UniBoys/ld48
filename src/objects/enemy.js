

export default class Enemy {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
	constructor(scene) {
		this.scene = scene;
    }

    init() {
        this.scene.physics.add.existing(this.obj);

        this.obj.body.setCollideWorldBounds(true);
    }

    update(time, delta) {

    }
}