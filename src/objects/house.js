import layers from "@/layers";
import HouseInventory from "@/objects/houseInventory";

export default class House {
	/**
	 * @param {Phaser.Scene} scene 
	 */
	constructor(scene) {
		this.scene = scene;
		this.initX = 2500;
		this.initY = 490;
		this.radius = 400;
		this.inventory = new HouseInventory({scene, size: 1000, house: this});
		this.upgrades = [500, 600, 700];

		this.obj = this.scene.add.image(this.initX, this.initY, 'house');
		this.scene.physics.add.existing(this.obj);
		this.obj.setScale(0.25);
		this.obj.body.setVelocityY(-7);

		this.obj.depth = layers.CONNECTORS;

		this.width = this.obj.body.width*this.obj.scaleX;
		this.height = this.obj.body.height*this.obj.scaleY;

		this.inventory.init();
	}

	update(time, delta) {
		const y = this.obj.body.y;

		if(y > 310) {
			this.obj.body.setAccelerationY(-10 + Math.random() * 10);
		}
		else if(y < 295) {
			this.obj.body.setAccelerationY(10 + Math.random() * -10);
		}
		else {
			this.obj.body.setAccelerationY(0);
		}

		const submarineCenter = this.scene.submarine.obj.body.center;
		const dist = Phaser.Math.Distance.BetweenPoints(submarineCenter, this.obj.body.center);

		if(dist < this.radius) {
			this.inventory.visible = true;
		}
		else {
			this.inventory.visible = false;
		}

		this.inventory.update(time, delta);
	}
}