import Weapon from "@/objects/weapon";
import layers from "../../layers";

export default class Spear1 extends Weapon {
	constructor({scene, submarine, left, right, leftSide}) {
		super({
			scene, 
			submarine,
			relativeX: left.relativeX, 
			relativeY: left.relativeY, 
			moveRelative: true,
			width: 20,
			height: 80
		});

		this.left = left;
		this.right = right;
		this.defaultAngle = left.defaultAngle;
		this.minAngle = left.minAngle;
		this.maxAngle = left.maxAngle;
		this.leftSide = leftSide;

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

		this.aimAlpha = 0.02;

		this.obj = this.scene.add.rectangle(submarine.initX + this.relativeX, submarine.initY + this.relativeY, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.obj);
		this.obj.setAngle(this.defaultAngle - 90);
		this.obj.depth = layers.WEAPONS; 

		this.support = this.scene.add.rectangle(submarine.initX + this.relativeX + this.width/2 + (this.leftSide ? -this.supportLeft : this.supportLeft), submarine.initY + this.relativeY + this.height/2 - this.supportOffset, this.supportWidth, 50, 0x000000);
		this.support.depth = layers.CONNECTORS;

		this.aimLeft = this.scene.add.triangle(
			submarine.initX + this.left.relativeX, submarine.initY + this.left.relativeY, 
			0, 0, 
			Math.cos(this.left.maxAngle * Phaser.Math.DEG_TO_RAD) * 1200, Math.sin(this.left.maxAngle * Phaser.Math.DEG_TO_RAD) * 1200,
			Math.cos(this.left.minAngle * Phaser.Math.DEG_TO_RAD) * 1200, Math.sin(this.left.minAngle * Phaser.Math.DEG_TO_RAD) * 1200,
			'0x0000000', 0
		);

		this.aimRight = this.scene.add.triangle(
			submarine.initX + this.right.relativeX, submarine.initY + this.right.relativeY, 
			0, 0, 
			Math.cos(this.right.maxAngle * Phaser.Math.DEG_TO_RAD) * 1200, Math.sin(this.right.maxAngle * Phaser.Math.DEG_TO_RAD) * 1200,
			Math.cos(this.right.minAngle * Phaser.Math.DEG_TO_RAD) * 1200, Math.sin(this.right.minAngle * Phaser.Math.DEG_TO_RAD) * 1200,
			'0x0000000', 0
		);

		this.aimRight.visible = false;

		this.aimLeft.depth = layers.BACKGROUND_UI;
		this.aimRight.depth = layers.BACKGROUND_UI;

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
		this.aimLeft.destroy();
		this.aimRight.destroy();
	}

	fire() {
		if(this.stabbing) return;

		this.aimRight.fillAlpha = 0;
		this.aimLeft.fillAlpha = 0;

		this.stabbing = true;

		this.projectiles[0] = this.scene.add.rectangle(this.scene.submarine.obj.body.x + this.relativeX + this.width/2, this.scene.submarine.obj.body.y + this.relativeY + this.height/2, this.width, this.height, 0xffffff);
		this.projectiles[0].depth = layers.PROJECTILES;
        this.scene.physics.add.existing(this.projectiles[0]);
		this.projectiles[0].body.rotation = this.obj.body.rotation;  

		this.projectiles[0].body.setCircle(10, Math.cos(this.projectiles[0].body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2)*30, 60);
		this.projectiles[0].body.setVelocityX(Math.cos(this.projectiles[0].body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
		this.projectiles[0].body.setVelocityY(Math.sin(this.projectiles[0].body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
		this.projectiles[0].explode = () => this.explode();
	}

	flip(flipped) {
		if(flipped) {
			this.relativeX = this.right.relativeX;
			this.relativeY = this.right.relativeY;
			this.defaultAngle = this.right.defaultAngle;
			this.minAngle = this.right.minAngle;
			this.maxAngle = this.right.maxAngle;
			this.aimLeft.visible = false;
			this.aimRight.visible = true;
			this.obj.body.rotation = this.right.defaultAngle - 90;
		}
		else {
			this.relativeX = this.left.relativeX;
			this.relativeY = this.left.relativeY;
			this.defaultAngle = this.left.defaultAngle;
			this.minAngle = this.left.minAngle;
			this.maxAngle = this.left.maxAngle;
			this.aimRight.visible = false;
			this.aimLeft.visible = true;
			this.obj.body.rotation = this.left.defaultAngle - 90;
		}
		this.leftSide = !this.leftSide
	}

	explode() {
		this.projectiles[0].destroy();
		this.projectiles.pop();
	}

	update(time, delta) {
		super.update(delta);

		this.aimLeft.x = this.obj.body.x + this.aimLeft.width/2 + this.obj.body.width/2;
		this.aimLeft.y = this.obj.body.y + this.aimLeft.height/2 + this.obj.body.height/2;
		this.aimRight.x = this.obj.body.x + this.aimRight.width/2 + this.obj.body.width/2;
		this.aimRight.y = this.obj.body.y + this.aimRight.height/2 + this.obj.body.height/2;

		this.support.x = this.submarine.obj.body.x + this.relativeX + this.width/2 + (this.leftSide ? -this.supportLeft : this.supportLeft);
		this.support.y = this.submarine.obj.body.y + this.relativeY + this.height/2 - this.supportOffset;

		if(!this.stabbing) {
			this.nonStabRotate(time, delta);

			if(this.leftSide) {
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
			this.aimRight.fillAlpha = this.aimAlpha;
			this.aimLeft.fillAlpha = this.aimAlpha;
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

		mousePointer.updateWorldPoint(mainCamera)
		const angle = Phaser.Math.Angle.Between(this.obj.x, this.obj.y, mousePointer.worldX, mousePointer.worldY);
		const deg = Phaser.Math.RAD_TO_DEG * angle; 
		const oldRotation = this.obj.body.rotation + 90;

		if(deg > this.minAngle && deg < this.maxAngle && this.mayRotate) {
			this.aimRight.fillAlpha = this.aimAlpha;
			this.aimLeft.fillAlpha = this.aimAlpha;
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
			this.aimRight.fillAlpha = 0;
			this.aimLeft.fillAlpha = 0;
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