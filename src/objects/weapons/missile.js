import Weapon from "@/objects/weapon";
import layers from "../../layers";

export default class Missile extends Weapon {
	constructor({scene, submarine, left, right}) {
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

		this.isLeft = true;

		this.missile = {
			velocity: 200,
			rotateSpeed: 0.01,
			rotateLock: 1000,
			explodeAfter: 10000
		}

		this.defaultAngle = left.defaultAngle;
		this.mayRotate = false;
		this.reloadTime = 3000;
		this.reloadFrames = 10;
		this.reloadY = 30;
		this.supportWidth = 5;
		this.supportHeight = 20;

		this.obj = this.scene.add.rectangle(submarine.initX + this.relativeX, submarine.initY + this.relativeY, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.obj);
		this.obj.setAngle(this.defaultAngle - 90);
		this.obj.depth = layers.WEAPONS;

		this.support1 = this.scene.add.rectangle(submarine.initX + this.relativeX + this.width/2 - 20, submarine.initY + this.relativeY + this.height/2 - 10, this.supportWidth, this.supportHeight, 0x000000);
		this.support1.depth = layers.CONNECTORS;

		this.support2 = this.scene.add.rectangle(submarine.initX + this.relativeX + this.width/2 + 20, submarine.initY + this.relativeY + this.height/2 - 10, this.supportWidth, this.supportHeight, 0x000000);
		this.support2.depth = layers.CONNECTORS;

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
		this.projectiles[0].depth = layers.PROJECTILES;
        this.scene.physics.add.existing(this.projectiles[0]);
		this.projectiles[0].setOrigin(0.5, 0)
		this.projectiles[0].body.setCircle(10, 0, 0)
		this.projectiles[0].body.rotation = this.obj.body.rotation;
		this.projectiles[0].iAngle = this.obj.body.rotation * Phaser.Math.DEG_TO_RAD;
		this.projectiles[0].explode = () => this.explode();
	}

	flip(flipped) {
		if(flipped) {
			this.relativeX = this.right.relativeX;
			this.relativeY = this.right.relativeY;
			this.defaultAngle = this.right.defaultAngle;
			this.obj.body.rotation = this.right.defaultAngle - 90;
		}
		else {
			this.relativeX = this.left.relativeX;
			this.relativeY = this.left.relativeY;
			this.defaultAngle = this.left.defaultAngle;
			this.obj.body.rotation = this.left.defaultAngle - 90;
		}
		this.isLeft = !flipped
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
			if(this.projectiles[0].body.y  < this.scene.minY) {
				this.explode();
			} else if((time-this.fireStart) < this.missile.rotateLock) {
				if(this.isLeft) this.projectiles[0].iAngle -= this.missile.rotateSpeed/4;
				else this.projectiles[0].iAngle += this.missile.rotateSpeed/4;

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
				mousePointer.updateWorldPoint(mainCamera)
				const trueAngle = Phaser.Math.Angle.Between(this.projectiles[0].body.x, this.projectiles[0].body.y, mousePointer.worldX, mousePointer.worldY);

				const normTrueAngle = Phaser.Math.Angle.Normalize(trueAngle);
				const normIAngle = Phaser.Math.Angle.Normalize(this.projectiles[0].iAngle - 3.14/2);
				const calc = (normTrueAngle - normIAngle + 2*3.14) % (3.14*2);

				if(calc < 3.14 && calc > 0.2) {
					this.projectiles[0].iAngle += this.missile.rotateSpeed;
				}
				else if(calc < 6.1) {
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