import Submarine from "@/objects/submarine";
import Cannon from "@/objects/weapons/cannon";

export default class SubmarineStage3 extends Submarine {
	constructor(scene) {
		super(scene);
		
		this.obj = scene.add.sprite(this.initX, this.initY);
		this.obj.setScale(0.20)
		this.obj.play("sub3-idle")

		this.hitboxSizeX = 0.88;
		this.hitboxSizeY = 0.37;
		this.hitboxOffsetX = 37;
		this.hitboxOffsetY = 33;

		this.acceleration = 10;
		this.deceleration = 6;
        this.changeBonus = 1.5;
		this.maxSpeedX = 180;
		this.maxSpeedY = 120;

		this.weapons = [
			// new Cannon({scene, submarine: this, relativeX: 60, relativeY: 130, defaultAngle: 90, minAngle: 60, maxAngle: 150}),
			// new Cannon({scene, submarine: this, relativeX: 190, relativeY: 130, defaultAngle: 90, minAngle: 30, maxAngle: 120})
		]

		this.init();
	}

	updateBobbingX(time) {
		if(time == 0) this.obj.play("sub3-move")
		else this.obj.play("sub3-idle")
	}
}