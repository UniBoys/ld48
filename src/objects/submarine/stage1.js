import Submarine from "@/objects/submarine";
import Spear1 from "@/objects/weapons/spear1";

export default class SubmarineStage1 extends Submarine {
	/**
	 * @param {Phaser.Scene} scene 
	 */
	constructor(scene) {
		super(scene);

		this.obj = scene.add.sprite(this.initX, this.initY);
		this.obj.setScale(0.27)
		this.obj.play("sub1-idle")

		this.weapons = [
			new Spear1({scene, submarine: this, relativeX: 40, relativeY: 120, defaultAngle: 90, minAngle: 70, maxAngle: 170, upIsUp: true}),
			new Spear1({scene, submarine: this, relativeX: 140, relativeY: 128, defaultAngle: 90, minAngle: 50, maxAngle: 100, upIsUp: true})
		]

		this.init();
	}
}