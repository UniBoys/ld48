import Weapon from "@/objects/weapon";
import layers from "../../layers";

export default class Cannon extends Weapon {
	constructor({scene, submarine, left, right}) {
		super({
			scene, 
			submarine,
			relativeX: left.relativeX, 
			relativeY: left.relativeY, 
			moveRelative: true,
			width: 30,
			height: 40
		});

		this.left = left;
		this.right = right;
		this.defaultAngle = left.defaultAngle;
		this.minAngle = left.minAngle;
		this.maxAngle = left.maxAngle;

		this.mayRotate = false;
		this.reloadTime = 1000;
		this.reloadFrames = 15;
		this.reloadY = 45;
		this.shootVelocity = 200;
		this.rotateSpeed = 5;
		this.umpD = 6;
		this.umpFrames = 12;

		this.aimAlpha = 0.02;

		this.obj = this.scene.add.image(submarine.initX + this.relativeX, submarine.initY + this.relativeY, 'cannon');
		this.obj.setDisplaySize(this.width, this.height);
        this.scene.physics.add.existing(this.obj);
		this.obj.setAngle(this.defaultAngle - 90); 
		this.obj.depth = layers.WEAPONS;

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

		this.reloadStart = 0;
		this.projectiles = [];
		this.firing = false;
		this.umpTimer = 0;
	}

	destroy() {
		this.obj.destroy();

		for(const projectile of this.projectiles) {
			projectile.destroy();
		}
		this.aimLeft.destroy();
		this.aimRight.destroy();
	}

	explode(projectile) {
		this.projectiles = this.projectiles.filter(projectile_ => projectile_ !== projectile);
		projectile.destroy();
	}

	fire() {
		const projectile = this.scene.add.image(this.scene.submarine.obj.body.x + this.relativeX + this.width/2, this.scene.submarine.obj.body.y + this.relativeY + this.height/2, 'cannonball');
		projectile.setDisplaySize(20, 20);
        this.scene.physics.add.existing(projectile);
		projectile.depth = layers.PROJECTILES;
		projectile.body.rotation = this.obj.body.rotation;
		projectile.body.setVelocityX(Math.cos(projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
		projectile.body.setVelocityY(Math.sin(projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
		projectile.explode = () => this.explode(projectile);

		this.projectiles.push(projectile);
		
		this.firing = true;
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
	}

	update(time, delta) {
		super.update(delta);

		this.aimLeft.x = this.obj.body.x + this.aimLeft.width/2 + this.obj.body.width/2;
		this.aimLeft.y = this.obj.body.y + this.aimLeft.height/2 + this.obj.body.height/2;
		this.aimRight.x = this.obj.body.x + this.aimRight.width/2 + this.obj.body.width/2;
		this.aimRight.y = this.obj.body.y + this.aimRight.height/2 + this.obj.body.height/2;

		if(!this.firing) {
			this.nonFireRotate(time, delta);
		}
		else if(this.umpTimer <= this.umpFrames) {
			if(this.reloadStart === 0) this.reloadStart = time;

			this.obj.body.x -= Math.cos(this.obj.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * (this.umpD / this.umpFrames) * this.umpTimer;
			this.obj.body.y -= Math.sin(this.obj.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * (this.umpD / this.umpFrames) * this.umpTimer;
			this.umpTimer++;
		}
		else if(this.umpTimer <= 2*this.umpFrames) { 
			this.obj.body.x -= Math.cos(this.obj.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.umpD - Math.cos(this.obj.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * (this.umpD / this.umpFrames) * (this.umpTimer - this.umpFrames);
			this.obj.body.y -= Math.sin(this.obj.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.umpD - Math.sin(this.obj.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * (this.umpD / this.umpFrames) * (this.umpTimer - this.umpFrames);
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