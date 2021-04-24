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
			rotateSpeed: 0.03,
			rotateLock: 1000,
			explodeAfter: 10000
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
		this.reloadStart = 0;
		this.reloadStep = 0;
		this.projectiles = [];
	}

	fire() {
		if(this.firing) return;

		this.firing = true;

		this.projectiles[0] = this.scene.add.rectangle(this.scene.submarine.obj.body.x + this.relativeX + this.width/2, this.scene.submarine.obj.body.y + this.relativeY + this.height/2, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.projectiles[0]);
		this.projectiles[0].body.rotation = this.obj.body.rotation;
		this.projectiles[0].iAngle = this.obj.body.rotation * Phaser.Math.DEG_TO_RAD;
	}

	explode() {
		this.firing = false;
		this.reloading = true;
		this.fireStart = 0;

		this.projectiles[0].destroy();
		this.projectiles.pop();
	}

	destroy() {
		this.obj.destroy();
		for(const projectile of this.projectiles) {
			projectile.destroy();
		}
		this.support1.destroy();
		this.support2.destroy();
	}

	update(time, delta) {
		super.update(delta);

		this.support1.x = this.submarine.obj.body.x + this.relativeX + this.width/2 - 20;
		this.support1.y = this.submarine.obj.body.y + this.relativeY + this.height/2 - 10; 
		
		this.support2.x = this.submarine.obj.body.x + this.relativeX + this.width/2 + 20;
		this.support2.y = this.submarine.obj.body.y + this.relativeY + this.height/2 - 10;

		if(this.firing) {
			this.obj.body.y -= this.reloadY;
			this.support1.y -= this.reloadY;
			this.support2.y -= this.reloadY;

			if(this.fireStart === 0) {
				this.fireStart = time;
			}
			else if((time-this.fireStart) < this.missile.rotateLock) {
				this.projectiles[0].iAngle -= this.missile.rotateSpeed/4;

				this.projectiles[0].body.setVelocityX(Math.cos(this.projectiles[0].iAngle - 3.14/2) * this.missile.velocity)
				this.projectiles[0].body.setVelocityY(Math.sin(this.projectiles[0].iAngle - 3.14/2) * this.missile.velocity)
				this.projectiles[0].setAngle(this.projectiles[0].iAngle * Phaser.Math.RAD_TO_DEG);
			}
			else if((time-this.fireStart) > this.missile.explodeAfter) {
				this.explode();
			}
			else {
				const mousePointer = this.scene.game.input.mousePointer;
				const mainCamera = this.scene.cameras.main;
				const trueAngle = Phaser.Math.Angle.Between(this.projectiles[0].body.x, this.projectiles[0].body.y, mousePointer.x + mainCamera.scrollX, mousePointer.y + mainCamera.scrollY);

				const normTrueAngle = Phaser.Math.Angle.Normalize(trueAngle);
				const normIAngle = Phaser.Math.Angle.Normalize(this.projectiles[0].iAngle - 3.14/2);
				const calc = (normTrueAngle - normIAngle + 2*3.14) % (3.14*2);

				if(calc < 3.14 && calc > 0.1) {
					this.projectiles[0].iAngle += this.missile.rotateSpeed;
				}
				else if(calc < 6.2) {
					this.projectiles[0].iAngle -= this.missile.rotateSpeed;
				}

				this.projectiles[0].body.setVelocityX(Math.cos(this.projectiles[0].iAngle - 3.14/2) * this.missile.velocity)
				this.projectiles[0].body.setVelocityY(Math.sin(this.projectiles[0].iAngle - 3.14/2) * this.missile.velocity)
				this.projectiles[0].setAngle(this.projectiles[0].iAngle * Phaser.Math.RAD_TO_DEG);
			}
		}
		else if(this.reloading) {
			
			if(this.reloadStart === 0) {
				this.reloadStart = time;
				this.obj.body.y -= this.reloadY;
				this.support1.y -= this.reloadY;
				this.support2.y -= this.reloadY;
			}
			else if(this.reloadStep > this.reloadFrames) {
				this.reloading = false;
				this.reloadStep = 0;
				this.reloadStart = 0;
			}
			else if((time-this.reloadStart) > this.reloadTime) {
				this.obj.body.y -= this.reloadY - this.reloadStep * (this.reloadY / this.reloadFrames);
				this.support1.y -= this.reloadY - this.reloadStep * (this.reloadY / this.reloadFrames);
				this.support2.y -= this.reloadY - this.reloadStep * (this.reloadY / this.reloadFrames);
				this.reloadStep++;
			}
			else {
				this.obj.body.y -= this.reloadY;
				this.support1.y -= this.reloadY;
				this.support2.y -= this.reloadY;
			}
		}
	}
}