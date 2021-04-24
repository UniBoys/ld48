import Spear1 from "@/objects/weapons/spear1";
import Spear2 from "@/objects/weapons/spear2";
import Cannon from "./weapons/cannon";
import Missile from "./weapons/missile";

export default class Submarine {
	/**
	 * @param {Phaser.Scene} scene 
	 */
	constructor(scene) {
		this.scene = scene;

		this.acceleration = 5;
		this.deceleration = 3;
        this.changeBonus = 1.2;
        this.bobbing = {
            delayX: 1000,
            delayY: 500,
            maxX: 10,
            maxY: 10,
            lastX: 0,
            lastY: 0,
        }
		this.maxSpeedX = 70;
		this.maxSpeedY = 70;
		this.width = 250;
		this.height = 150;
		this.color = 0xff0000;
		this.initX = 0;
		this.initY = 0;
		this.depth = 4;
		this.weaponCooldown = 2000;
		this.weapons = [
			//new Spear1({scene, submarine: this, relativeX: 60, relativeY: 100, defaultAngle: 90, minAngle: 80, maxAngle: 140, upIsUp: true}),
			//new Spear1({scene, submarine: this, relativeX: 190, relativeY: 100, defaultAngle: 90, minAngle: 40, maxAngle: 100, upIsUp: true}),
			//new Spear2({scene, submarine: this, relativeX: 60, relativeY: 125, defaultAngle: 160, minAngle: 105, maxAngle: 175, left: true}),
			//new Spear2({scene, submarine: this, relativeX: 190, relativeY: 125, defaultAngle: 20, minAngle: 5, maxAngle: 75, left: false}),
			// new Cannon({scene, submarine: this, relativeX: 60, relativeY: 130, defaultAngle: 90, minAngle: 60, maxAngle: 150}),
			// new Cannon({scene, submarine: this, relativeX: 190, relativeY: 130, defaultAngle: 90, minAngle: 30, maxAngle: 120}),
			//new Missile({scene, submarine: this, relativeX: 60, relativeY: 125, defaultAngle: 0}),
			new Missile({scene, submarine: this, relativeX: 190, relativeY: 125, defaultAngle: 0}),
		];

		this.cooldownStart = 0;
	}

	init() {
		this.obj = this.scene.add.rectangle(this.initX, this.initY, this.width, this.height, this.color);
        this.scene.physics.add.existing(this.obj);
		this.obj.depth = 4;
		this.obj.body.setCollideWorldBounds(true);
        this.scene.cameras.main.startFollow(this.obj);
	}

	update(time, delta) {
		this.movement(time, delta);

		const closestWeapon = this.findClosestWeaponToCursor();

		for(const weapon of this.weapons) {
			if(weapon === closestWeapon) weapon.mayRotate = true;
			else weapon.mayRotate = false;

			weapon.update(time, delta);
		}

		if((time-this.cooldownStart) > this.weaponCooldown) {
			this.cooldownStart = 0;
		} 

		if(this.canFire()) {
			closestWeapon.fire();
			this.cooldownStart = time;
		}
	}

	canFire() {
		return this.scene.keylistener.SPACE.isDown && this.cooldownStart === 0;
	}

	findClosestWeaponToCursor() {
		let closest = {d: 10000};

		const mousePointer = this.scene.game.input.mousePointer;
		const mainCamera = this.scene.cameras.main;

		for(const weapon of this.weapons) {
			const xsquare = ((weapon.obj.x + weapon.width/2) - (mousePointer.x + mainCamera.scrollX)) * ((weapon.obj.x + weapon.width/2) - (mousePointer.x + mainCamera.scrollX));
			const ysquare = ((weapon.obj.y + weapon.height/2) - (mousePointer.y + mainCamera.scrollY)) * ((weapon.obj.y + weapon.height/2) - (mousePointer.y + mainCamera.scrollY));
			const d = Math.sqrt(xsquare + ysquare);
			
			if(d > closest.d) continue;

			closest = {d, v: weapon};
		}

		return closest.v;
	}

	movement(time, delta) {
		if(this.scene.keylistener.W.isDown && !this.scene.keylistener.S.isDown) {
			this.obj.body.setAccelerationY(-delta * this.acceleration * (this.obj.body.velocity.y > 0 ? this.changeBonus : 1));

			this.limitMaxSpeed();
		}
		else if(this.scene.keylistener.S.isDown && !this.scene.keylistener.W.isDown) {
			this.obj.body.setAccelerationY(delta * this.acceleration  * (this.obj.body.velocity.y < 0 ? this.changeBonus : 1));

            this.limitMaxSpeed();
		}
		else if(this.obj.body.velocity.y > this.bobbing.maxY && this.bobbing.lastY == 0) {
			this.obj.body.setAccelerationY(-delta * this.deceleration)
		}
		else if(this.obj.body.velocity.y < -this.bobbing.maxY && this.bobbing.lastY == 0) {
			this.obj.body.setAccelerationY(delta * this.deceleration)
		}
		else if(time - this.bobbing.lastY - this.bobbing.delayY > 0) {
            this.bobbing.lastY = time

            if(this.obj.body.velocity.y > this.bobbing.maxY) {
                this.obj.body.setAccelerationY(-delta * this.bobbing.maxY * 0.1)
            }
            else if(this.obj.body.velocity.y < -this.bobbing.maxY) {
                this.obj.body.setAccelerationY(delta * this.bobbing.maxY * 0.1)
            }
		}

		if(this.scene.keylistener.D.isDown && !this.scene.keylistener.A.isDown) {
			this.obj.body.setAccelerationX(delta * this.acceleration * (this.obj.body.velocity.x < 0 ? this.changeBonus : 1));

            this.limitMaxSpeed();
		}
		else if(this.scene.keylistener.A.isDown && !this.scene.keylistener.D.isDown) {
			this.obj.body.setAccelerationX(-delta * this.acceleration  * (this.obj.body.velocity.x > 0 ? this.changeBonus : 1));

            this.limitMaxSpeed();
		}
		else if(this.obj.body.velocity.x > this.bobbing.maxX && this.bobbing.lastX == 0) {
			this.obj.body.setAccelerationX(-delta * this.deceleration)
		}
		else if(this.obj.body.velocity.x < -this.bobbing.maxX && this.bobbing.lastX == 0) {
			this.obj.body.setAccelerationX(delta * this.deceleration)
		}
		else if(time - this.bobbing.lastX - this.bobbing.delayX > 0) {
            this.bobbing.lastX = time

            if(this.obj.body.velocity.x > this.bobbing.maxX) {
                this.obj.body.setAccelerationX(-delta * this.bobbing.maxX * 0.1)
            }
            else if(this.obj.body.velocity.x < -this.bobbing.maxX) {
                this.obj.body.setAccelerationX(delta * this.bobbing.maxX * 0.1)
            }
		}
	}

	limitMaxSpeed() {
		if(Math.abs(this.obj.body.velocity.x) > this.maxSpeedX) {
			this.obj.body.setAccelerationX(0);
			this.obj.body.setVelocityX(this.obj.body.velocity.x > 0 ? this.maxSpeedX : -this.maxSpeedX);
		} 

		if(Math.abs(this.obj.body.velocity.y) > this.maxSpeedY) {
			this.obj.body.setAccelerationY(0);
			this.obj.body.setVelocityY(this.obj.body.velocity.y > 0 ? this.maxSpeedY : -this.maxSpeedY);
		}
        this.bobbing.lastX = 0
        this.bobbing.lastY = 0
	}
}