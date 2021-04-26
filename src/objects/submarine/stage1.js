import Submarine from "@/objects/submarine";
import Spear1 from "@/objects/weapons/spear1";

export default class SubmarineStage1 extends Submarine {
	/**
	 * @param {Phaser.Scene} scene 
	 */
	constructor(scene) {
		super(scene, 1);

		this.obj = scene.add.sprite(this.initX, this.initY);
		this.obj.setScale(0.27)
		this.obj.play("sub1-idle")

		this.signX = 110;
		this.signY = 50;
		this.signR = 5;
		this.signW = 100;
		this.signH = 18;

		this.inventorySetting.size = 250;

		this.depthDamage = [
			{y1: 0, y2: 1600, amount: 1},
			{y1: 1600, y2: 6000, amount: 5},
		]

		this.weapons = [
			new Spear1({
				scene, submarine: this, 
				left: {relativeX: 2, relativeY: 95, defaultAngle: 120, minAngle: 90, maxAngle: 160},
				right: {relativeX: 182, relativeY: 95, defaultAngle: 60, minAngle: 20, maxAngle: 90}
			}),
			new Spear1({
				scene, submarine: this, 
				left: {relativeX: 118, relativeY: 110, defaultAngle: 75, minAngle: 50, maxAngle: 100},
				right: {relativeX: 72, relativeY: 110, defaultAngle: 115, minAngle: 80, maxAngle: 130}
			})
		]

		this.init();
	}


	updateBobbingX(time) {
		if(time == 0) this.obj.play("sub1-move")
		else this.obj.play("sub1-idle")
	}
}