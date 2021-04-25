export default class Player {
	/**
	 * @param {Phaser.Scene} scene 
	 */
	constructor(scene) {
		this.scene = scene;
		this.obj = scene.add.rectangle(0, 0, 20, 20, 0xff00ff);

        this.scene.physics.add.existing(this.obj);

		this.acceleration = 5;
		this.deceleration = 4;
		this.maxSpeedX = 20;
		this.maxSpeedY = 20;
		this.inSub = true;

        this.obj.body.setCollideWorldBounds(true);
	}

	update() {
		if(this.inSub) {
			this.obj.body.x = this.scene.submarine.obj.body.x;
			this.obj.body.y = this.scene.submarine.obj.body.y;
		}
	}
}