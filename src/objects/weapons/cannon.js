import Weapon from "@/objects/weapon";

export default class Cannon extends Weapon{
	constructor({scene, submarine, relativeX, relativeY, defaultAngle, minAngle, maxAngle}) {
		super({
			scene, 
			submarine,
			relativeX, 
			relativeY, moveRelative: true,
			width: 30,
			height: 40
		});

		this.defaultAngle = defaultAngle;
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;

		this.mayRotate = false;
		this.reloadTime = 1000;
		this.reloadFrames = 15;
		this.reloadY = 45;
		this.shootVelocity = 200;
		this.rotateSpeed = 5;
		this.umpD = 5;
		this.umpFrames = 12;

		this.obj = this.scene.add.rectangle(submarine.initX + relativeX, submarine.initY + relativeY, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.obj);
		this.obj.setAngle(defaultAngle - 90); 
		this.obj.depth = 2;

		this.reloadStart = 0;
		this.projectiles = [];
		this.firing = false;
		this.umpTimer = 0;
	}

	fire() {
		this.firing = true;
		this.projectile = this.scene.add.circle(this.scene.submarine.obj.body.x + this.relativeX + this.width/2, this.scene.submarine.obj.body.y + this.relativeY + this.height/2, 10, 0x000000);
        this.scene.physics.add.existing(this.projectile);
		this.projectile.body.rotation = this.obj.body.rotation;
		this.projectile.body.setVelocityX(Math.cos(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
		this.projectile.body.setVelocityY(Math.sin(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
	}

	update(time, delta) {
		super.update(delta);

		if(!this.firing) {
			this.nonFireRotate(time, delta);
		}
		else if(this.umpTimer <= this.umpFrames) {
			if(this.reloadStart === 0) this.reloadStart = time;

			this.obj.body.x -= Math.cos(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * (this.umpD / this.umpFrames) * this.umpTimer;
			this.obj.body.y -= Math.sin(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * (this.umpD / this.umpFrames) * this.umpTimer;
			this.umpTimer++;
		}
		else if(this.umpTimer <= 2*this.umpFrames) {
			this.obj.body.x -= Math.cos(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.umpD - Math.cos(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * (this.umpD / this.umpFrames) * (this.umpTimer - this.umpFrames);
			this.obj.body.y -= Math.sin(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.umpD - Math.sin(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * (this.umpD / this.umpFrames) * (this.umpTimer - this.umpFrames);
			this.umpTimer++;
		}
		else if((time-this.reloadStart) > this.reloadTime) {
			this.umpTimer = 0;
			this.firing = false;
		}
	}

	nonFireRotate(time, delta) {
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