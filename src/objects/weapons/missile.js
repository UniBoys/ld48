import Weapon from "@/objects/weapon";

export default class Missile extends Weapon {
	constructor({scene, submarine, relativeX, relativeY, defaultAngle}) {
		super({
			scene, 
			submarine,
			relativeX, 
			relativeY, moveRelative: true,
			width: 20,
			height: 80
		});

		this.missile = {
			velocity: 200,
			rotateSpeed: 0.05
		}

		this.mayRotate = false;
		this.reloadTime = 3000;
		this.reloadFrames = 10;
		this.reloadY = 30;
		this.supportWidth = 5;
		this.supportHeight = 20;

		this.obj = this.scene.add.rectangle(submarine.initX + relativeX, submarine.initY + relativeY, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.obj);
		this.obj.setAngle(defaultAngle - 90);
		this.obj.depth = 3;

		this.support1 = this.scene.add.rectangle(submarine.initX + relativeX + this.width/2 - 20, submarine.initY + relativeY + this.height/2 - 10, this.supportWidth, this.supportHeight, 0x000000);
		this.support1.depth = 2;

		this.support2 = this.scene.add.rectangle(submarine.initX + relativeX + this.width/2 + 20, submarine.initY + relativeY + this.height/2 - 10, this.supportWidth, this.supportHeight, 0x000000);
		this.support2.depth = 2;

		this.firing = false;
		this.fireStart = 0;
		this.reloadFire = 0;
	}

	fire() {
		if(this.firing) return;

		this.firing = true;

		this.projectile = this.scene.add.rectangle(this.scene.submarine.obj.body.x + this.relativeX + this.width/2, this.scene.submarine.obj.body.y + this.relativeY + this.height/2, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.projectile);
		this.projectile.body.rotation = this.obj.body.rotation;
		this.projectile.iAngle = this.obj.body.iAngle;
		//this.projectile.body.setVelocityX(Math.cos(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
		//this.projectile.body.setVelocityY(Math.sin(this.projectile.body.rotation * Phaser.Math.DEG_TO_RAD + Math.PI/2) * this.shootVelocity);
	}

	update(time, delta) {
		super.update(delta);

		this.support1.x = this.submarine.obj.body.x + this.relativeX + this.width/2 - 20;
		this.support1.y = this.submarine.obj.body.y + this.relativeY + this.height/2 - 10; 
		
		this.support2.x = this.submarine.obj.body.x + this.relativeX + this.width/2 + 20;
		this.support2.y = this.submarine.obj.body.y + this.relativeY + this.height/2 - 10;

		if(this.firing) {
			const mousePointer = this.scene.game.input.mousePointer;
			const mainCamera = this.scene.cameras.main;
			const trueAngle = Phaser.Math.Angle.Between(this.projectile.body.x, this.projectile.body.y, mousePointer.x + mainCamera.scrollX, mousePointer.y + mainCamera.scrollY);
			let newAngle = Phaser.Math.Angle.RotateTo(trueAngle, this.projectile.iAngle, 0.05);
			this.projectile.iAngle = newAngle;
			console.log(newAngle);
			//if(newAngle-) 

			this.projectile.body.setVelocityX(Math.cos(newAngle) * this.missile.velocity), 
			this.projectile.body.setVelocityY(Math.sin(newAngle) * this.missile.velocity)
			//this.projectile.body.rotation = newAngle * Phaser.Math.RAD_TO_DEG + 90;
		}
	}
}