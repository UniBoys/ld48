import Submarine from "@/objects/submarine";
import Spear2 from "@/objects/weapons/spear2";
import HeadLight from "@/objects/submarine/headLight";

export default class SubmarineStage2 extends Submarine {
	constructor(scene) {
		super(scene, 2);

		this.obj = scene.add.sprite(this.initX, this.initY);
		this.obj.setScale(0.20)
		this.obj.play("sub2-idle")

		this.hitboxSizeX = 0.88;
		this.hitboxSizeY = 0.37;
		this.hitboxOffsetX = 37;
		this.hitboxOffsetY = 33;

		this.acceleration = 7;
		this.deceleration = 5;
        this.changeBonus = 1.3;
		this.maxSpeedX = 120;
		this.maxSpeedY = 90;

		this.signX = 240;
		this.signY = 25;
		this.signR = 5;
		this.signW = 110;
		this.signH = 18;

		this.weapons = [
			new Spear2({
				scene, 
				submarine: this, 
				left: {relativeX: 60, relativeY: 55, defaultAngle: 160, minAngle: 105, maxAngle: 175}, 
				right: {relativeX: 270, relativeY: 55, defaultAngle: 20, minAngle: 5, maxAngle: 75}, 
				leftSide: true,
			}),
			new Spear2({
				scene, 
				submarine: this, 
				left: {relativeX: 270, relativeY: 55, defaultAngle: 20, minAngle: 5, maxAngle: 75}, 
				right: {relativeX: 60, relativeY: 55, defaultAngle: 160, minAngle: 105, maxAngle: 175}, 
				leftSide: false,
			}),
		]

		this.headLights = [
			new HeadLight({
				scene,
				submarine: this,
				left: {relativeX: -8, relativeY: 68, a1: 185, a2: 80},
				right: {relativeX: 335, relativeY: 68, a1: -5, a2: 110}
			})
		]

		this.init();
	}

	updateBobbingX(time) {
		if(time == 0) this.obj.play("sub2-move")
		else this.obj.play("sub2-idle")
	}
}