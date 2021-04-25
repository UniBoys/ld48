import Submarine from "@/objects/submarine";
import Cannon from "@/objects/weapons/cannon";

export default class SubmarineStage3 extends Submarine {
	constructor(scene) {
		super(scene, 3);
		
		this.obj = scene.add.sprite(this.initX, this.initY);
		this.obj.setScale(0.20)
		this.obj.play("sub3-idle")

		this.hitboxSizeX = 0.75;
		this.hitboxSizeY = 0.2;
		this.hitboxOffsetX = 0;
		this.hitboxOffsetY = 380;

		this.acceleration = 12;
		this.deceleration = 8;
        this.changeBonus = 1.7;
		this.maxSpeedX = 220;
		this.maxSpeedY = 160;

		this.weapons = [
			new Cannon({
				scene, 
				submarine: this, 
				left: {relativeX: 20, relativeY: 70, defaultAngle: 90, minAngle: 60, maxAngle: 150},
				right: {relativeX: 260, relativeY: 70, defaultAngle: 90, minAngle: 30, maxAngle: 120},
			}),
			new Cannon({
				scene, 
				submarine: this, 
				left: {relativeX: 205, relativeY: 70, defaultAngle: 90, minAngle: 30, maxAngle: 120},
				right: {relativeX: 75, relativeY: 70, defaultAngle: 90, minAngle: 60, maxAngle: 150},
			}),
		]

		this.init();
	}

	updateBobbingX(time) {
		if(time == 0) this.obj.play("sub3-move")
		else this.obj.play("sub3-idle")
	}
}