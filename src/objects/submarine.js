import Inventory from "@/objects/inventory";
import layers from "../layers";

export default class Submarine {
	/**
	 * @param {Phaser.Scene} scene 
	 */
	constructor(scene, stage) {
		this.scene = scene;
		this.stage = stage;

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
		this.initX = 2500;
		this.initY = 650;
		this.weaponCooldown = 2000;
		this.hitboxSizeX = 0.8;
		this.hitboxSizeY = 0.8;
		this.hitboxOffsetX = 0;
		this.hitboxOffsetY = 30;
		this.weapons = [];
		this.signY = 0;
		this.signX = 0;
		this.signR = 0;
		this.signW = 0;
		this.signH = 0;
		this.depthDamage = [];
		this.depthDamageDelay = 1000;
		this.inventorySetting = {
			size: 1000
		}
		this.headLights = []
		this.glowStrength = 0.2;
		this.glowWidth = 1000;
		this.glowHeight = 700;
		this.glowColor = 0xdddddd;

		this.cooldownStart = 0;
		this.lastDepthDamage = 0;
	}

	destroy() {
		this.obj.destroy();
		this.sign.destroy();
		for(const weapon of this.weapons) {
			weapon.destroy();
		}
	}

	init() {
        this.scene.physics.add.existing(this.obj);
		this.obj.depth = layers.SUBMARINE;
		this.obj.body.setCollideWorldBounds(true);
		this.obj.body.setSize(this.obj.width*this.hitboxSizeX, this.obj.height*this.hitboxSizeY)
		this.obj.body.setOffset(this.obj.body.offset.x + this.hitboxOffsetX, this.obj.body.offset.y + this.hitboxOffsetY);
        this.scene.cameras.main.startFollow(this.obj);
		this.inventory = new Inventory(this.scene, this.inventorySetting);

		this.sign = this.scene.add.image(this.obj.body.x + this.signLeftX, this.obj.body.x + this.signY, 'sign');
		this.sign.depth = layers.SIGN;
		this.sign.setDisplaySize(this.signW, this.signH);
		this.sign.angle = this.signR;

		this.radial = this.scene.radials.getFree(this.obj);
	}

	flip() {
		if(!this.flipped) {
			this.flipped = true;
			this.obj.flipX = true;
			this.sign.visible = false;

			for(const weapon of this.weapons) {
				weapon.flip(this.flipped);
			}
			for(const headLight of this.headLights) {
				headLight.flip(this.flipped);
			}
		}
		else {
			this.flipped = false;
			this.obj.flipX = false;
			this.sign.visible = true;

			for(const weapon of this.weapons) {
				weapon.flip(this.flipped);
			}
			for(const headLight of this.headLights) {
				headLight.flip(this.flipped);
			}
		}
	}

	update(time, delta) {
		if(this.shot) {
			this.shot = false;
		}

		if(this.bobbing.lastX == 0) {
			if(this.obj.body.velocity.x > 10 && !this.flipped) {
				this.flip();	
			} else if(this.obj.body.velocity.x < -10 && this.flipped) {
				this.flip();
			}
		}

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
			this.shot = true;
		}

		for(const headLight of this.headLights) {
			headLight.update(time, delta);
		}

		if(!this.flipped) {
			this.sign.x = this.obj.body.x + this.signX;
			this.sign.y = this.obj.body.y + this.signY;
		}

		if((time-this.lastDepthDamage) > this.depthDamageDelay) {
			for(const damage of this.depthDamage) {
				if(this.obj.body.y < damage.y1 || this.obj.body.y > damage.y2) continue;

				this.inventory.add('water', damage.amount);
			}

			this.lastDepthDamage = time;
		}

		this.inventory.update(time, delta);

		this.radial.setAlpha(this.glowStrength);
		this.radial.setTint(this.glowColor);
		this.radial.setDisplaySize(this.glowWidth, this.glowHeight);
		this.radial.setPosition(this.obj.body.x + this.obj.body.width/2, this.obj.body.y + this.obj.body.height/2);

		if(this.inventory.get('oxygen') <= 0) {
			this.scene.respawn(time);
		}
	}

	canFire() {
		return (this.scene.keylistener.SPACE.isDown || this.scene.input.mousePointer.leftButtonDown()) && this.cooldownStart === 0;
	}

	getAllProjectiles() {
		const projectiles = [];
		
		for(const weapon of this.weapons) {
			projectiles.push(...weapon.projectiles)
		}

		return projectiles;
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
		if(this.obj.body.y + this.obj.body.height/2 < this.scene.minY) {
			this.obj.body.setAccelerationY(100)
		} else if(this.scene.keylistener.W.isDown && !this.scene.keylistener.S.isDown) {
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
			if(this.bobbing.lastX == 0) {
				this.updateBobbingX(time)
			}
            this.bobbing.lastX = time

            if(this.obj.body.velocity.x > this.bobbing.maxX) {
                this.obj.body.setAccelerationX(-delta * this.bobbing.maxX * 0.1)
            }
            else if(this.obj.body.velocity.x < -this.bobbing.maxX) {
                this.obj.body.setAccelerationX(delta * this.bobbing.maxX * 0.1)
            }
		}

		if(this.checkForMapCollision(this.obj.body.x, this.obj.body.y)) {
			if(this.obj.body.velocity.x < 0) this.obj.body.setVelocityX(0);
			if(this.obj.body.velocity.y < 0) this.obj.body.setVelocityY(0);
		}
		else if(this.checkForMapCollision(this.obj.body.x + this.obj.body.width, this.obj.body.y)) {
			if(this.obj.body.velocity.x > 0) this.obj.body.setVelocityX(0);
			if(this.obj.body.velocity.y < 0) this.obj.body.setVelocityY(0);
		}
		else if(this.checkForMapCollision(this.obj.body.x, this.obj.body.y + this.obj.body.height)) {
			if(this.obj.body.velocity.x < 0) this.obj.body.setVelocityX(0);
			if(this.obj.body.velocity.y > 0) this.obj.body.setVelocityY(0);
		}
		else if(this.checkForMapCollision(this.obj.body.x + this.obj.body.width, this.obj.body.y + this.obj.body.height)) {
			if(this.obj.body.velocity.x > 0) this.obj.body.setVelocityX(0);
			if(this.obj.body.velocity.y > 0) this.obj.body.setVelocityY(0);
		}
	}

	checkForMapCollision(x, y) {
		return this.scene.textures.getPixelAlpha(x, y, "background1") > 0;
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

		if(this.bobbing.lastX != 0) {
			this.updateBobbingX(0)
		}
        this.bobbing.lastX = 0
        this.bobbing.lastY = 0
	}


	updateBobbingX(time) {}
}