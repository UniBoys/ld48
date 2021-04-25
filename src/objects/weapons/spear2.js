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
		this.reloadFrames = 15;
		this.reloadY = 45;
		this.shootVelocity = 200;
		this.rotateSpeed = 5;

		this.supportLeft = 15;
		this.supportWidth = 5;
		this.supportSpeed = 8;
		this.supportOffset = 25;

		this.obj = this.scene.add.rectangle(submarine.initX + relativeX, submarine.initY + relativeY, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.obj);
		this.obj.setAngle(defaultAngle - 90);
		this.obj.depth = 7; 

		this.support = this.scene.add.rectangle(submarine.initX + relativeX + this.width/2 + (this.left ? -this.supportLeft : this.supportLeft), submarine.initY + relativeY + this.height/2 - this.supportOffset, this.supportWidth, 50, 0x000000);
		this.support.depth = 6;

		this.stabbing = false;
		this.stabStart = 0;
		this.reloadStep = 0;
		this.projectiles = [];
	}

	destroy() {
		this.obj.destroy();
		for(const projectile of this.projectiles) {
			projectile.destroy();
		}
		this.support.destroy();
	}

	fire() {
		if(this.stabbing) return;

		this.stabbing = true;

		this.projectiles[0] = this.scene.add.rectangle(this.scene.submarine.obj.body.x + this.relativeX + this.width/2, this.scene.submarine.obj.body.y + this.relativeY + this.height/2, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.projectiles[0]);
		this.projectiles[0].body.rotation = this.obj.body.rotation;  
		this.projectiles[0].body.setVelocityX(Math.cos(this.projectiles[0].body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
		this.projectiles[0].body.setVelocityY(Math.sin(this.projectiles[0].body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
		this.projectiles[0].explode = () => this.explode();
	}

	explode() {
		this.projectiles[0].destroy();
		this.projectiles.pop();
	}

	update(time, delta) {
		super.update(delta);

		this.support.x = this.submarine.obj.body.x + this.relativeX + this.width/2 + (this.left ? -this.supportLeft : this.supportLeft);
		this.support.y = this.submarine.obj.body.y + this.relativeY + this.height/2 - this.supportOffset;

		if(!this.stabbing) {
			this.nonStabRotate(time, delta);

			if(this.left) {
				this.support.y += Math.tan((180 - this.obj.body.rotation) * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.supportSpeed; 
			}
			else {
				this.support.y += Math.tan(this.obj.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.supportSpeed;
			}
			
		}
		else if(this.stabStart === 0) {
			this.stabStart = time;
		}
		else if((time-this.stabStart) <= 3000) {
			this.obj.body.rotation = this.defaultAngle - 90;

			this.obj.body.y -= this.reloadY;
			this.support.y -= this.reloadY;
		}
		else if(this.reloadStep === this.reloadFrames) {
			this.stabbing = false;
			this.stabStart = 0;
			this.reloadStep = 0 ;
		}
		else if((time-this.stabStart) > 3000) {
			this.obj.body.y -= this.reloadY -  this.reloadStep * (this.reloadY/this.reloadFrames);
			this.support.y -= this.reloadY -  this.reloadStep * (this.reloadY/this.reloadFrames); 
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