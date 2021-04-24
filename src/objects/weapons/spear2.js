import Weapon from "@/objects/weapon";

export default class Spear1 extends Weapon {
	constructor({scene, submarine, relativeX, relativeY, defaultAngle, minAngle, maxAngle, left}) {
		super({
			scene, 
			submarine,
			relativeX, 
			relativeY, moveRelative: true,
			width: 20,
			height: 80
		});

		this.defaultAngle = defaultAngle;
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
		this.left = left;

		this.mayRotate = false;
		this.reloadTime = 3000;
		this.reloadFrames = 10;
		this.reloadY = 30;
		this.shootVelocity = 200;
		this.rotateSpeed = 5;

		this.obj = this.scene.add.rectangle(submarine.initX + relativeX, submarine.initY + relativeY, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.obj);
		this.obj.setAngle(defaultAngle - 90);
		this.obj.depth = 8;

		this.support = this.scene.add.rectangle(submarine.initX + relativeX + this.width/2 + (this.left ? -20 : 20), submarine.initY + relativeY + this.height/2 - 17, 5, 15, 0x000000);
		this.support.depth = 8;

		this.stabbing = false;
		this.stabStart = 0;
		this.reloadStep = 0;
	}

	stab() {
		if(this.stabbing) return;

		this.stabbing = true;

		this.projectile = this.scene.add.rectangle(this.scene.submarine.obj.body.x + this.relativeX + this.width/2, this.scene.submarine.obj.body.y + this.relativeY + this.height/2, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.projectile);
		this.projectile.body.rotation = this.obj.body.rotation;  
		this.projectile.body.setVelocityX(Math.cos(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
		this.projectile.body.setVelocityY(Math.sin(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
	}

	update(time, delta) {
		super.update(delta);

		if(!this.stabbing) {
			this.nonStabRotate(time, delta);
		}
		else if(this.stabStart === 0) {
			this.stabStart = time;
		}
		else if((time-this.stabStart) <= 3000) {
			this.obj.body.rotation = this.defaultAngle - 90;

			if(this.upIsUp) {
				this.obj.body.y -= this.reloadY;
			}
			else {
				this.obj.body.y += this.reloadY;
			}
		}
		else if(this.reloadStep === this.reloadFrames) {
			this.stabbing = false;
			this.stabStart = 0;
			this.reloadStep = 0 ;
		}
		else if((time-this.stabStart) > 3000) {
			this.obj.body.y -= this.reloadY -  this.reloadStep * (this.reloadY/this.reloadFrames);
			this.reloadStep++;
		}
	}

	nonStabRotate(time, delta) {
		const mousePointer = this.scene.game.input.mousePointer;
		const mainCamera = this.scene.cameras.main;
		const angle = Phaser.Math.Angle.Between(this.obj.x, this.obj.y, mousePointer.x + mainCamera.scrollX, mousePointer.y + mainCamera.scrollY);
		const deg = Phaser.Math.RAD_TO_DEG * angle; 
		const oldRotation = this.obj.body.rotation + 90;

		if(deg > this.minAngle && deg < this.maxAngle && this.mayRotate) {
			this.resetStart = 0;

			if(deg-oldRotation > 1) {
				this.obj.body.angularVelocity = this.rotateSpeed * delta;
			}
			else if(deg-oldRotation < -1) {
				this.obj.body.angularVelocity = -this.rotateSpeed * delta;
			}
			else {
				this.obj.body.angularVelocity = 0;
			}

			if(this.obj.body.rotation + 90 > this.maxAngle) {
				this.obj.body.angularVelocity = 0;
			} 
			if(this.obj.body.rotation + 90 < this.minAngle) {
				this.obj.body.angularVelocity = 0;
			}
		}
		else {
			if(this.defaultAngle-oldRotation > 1) {
				this.obj.body.angularVelocity = this.rotateSpeed * delta;
			}
			else if(this.defaultAngle-oldRotation < -1) {
				this.obj.body.angularVelocity = -this.rotateSpeed * delta;
			}
			else {
				this.obj.body.angularVelocity = 0;
			}
		}
	}
}