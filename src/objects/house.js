import HouseInventory from "./houseInventory";

export default class House {
	constructor(scene) {
		this.scene = scene;
		this.width = 500;
		this.height = 200;
		this.initX = 2500;
		this.initY = 620;
		this.radius = 400;
		this.inventory = new HouseInventory({scene, size: 1000, house: this});
		this.upgrades = [500, 600, 700];

		this.obj = this.scene.add.rectangle(this.initX, this.initY-.5*this.height, this.width, this.height, 0x00ff00);
		this.scene.physics.add.existing(this.obj);

		this.inventory.init();
	}

	update(time, delta) {
		if(this.obj.body.y < (this.initY-.7*this.height) && this.obj.body.y > (this.initY-.9*this.height)) {
			this.obj.body.setAccelerationY(-70 + Math.random() * 10);
		}
		else if(this.obj.body.y < (this.initY-.9*this.height) && this.obj.body.y > (this.initY-1.1*this.height)) {
			this.obj.body.setAccelerationY(70 + Math.random() * -10);
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