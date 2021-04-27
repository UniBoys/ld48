import layers from "../../layers";
import Enemy from "../enemy";

export default class Lanternfish extends Enemy{
	/**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
	 constructor(scene, x, y, disposable) {
        super(scene, disposable, 4)

        this.attackDistance = 1000
		this.acceleration = 1;
		this.deceleration = 3;
        this.maxSpeed = 30;
        this.changeBonus = 2;

        this.wiggle = {
            multiplier: 0.2,
            delay: 20,
            last: 0,
        }

        this.obj = scene.add.sprite(x, y);
		this.obj.setScale(0.28)
		this.obj.play("lanternfish-idle")
        this.obj.depth = layers.MOBS;

        this.init()

        this.obj.body.setBounce(1)
		this.obj.body.setSize(this.obj.width*.7, this.obj.height*.6);

		this.radial = this.scene.add.image(this.obj.body.x, this.obj.body.y, 'glow');
		this.radial.setAlpha(0.5);
		this.radial.setTint(0x651fff);
		this.radial.setDisplaySize(300, 300);
		this.radial.depth = layers.LANTERN;
    }

    dispose() {
        super.dispose()
        this.obj.destroy()
        this.radial.destroy();
    }

    update(time, delta) {
        super.update(time, delta);
        const submarine = this.scene.submarine;
        const inRange = Math.abs(this.obj.x - submarine.obj.x) < this.attackDistance && Math.abs(this.obj.y - submarine.obj.y) < this.attackDistance

        // Move x
        if(inRange && submarine.obj.x < this.obj.x) {
            this.obj.body.setAccelerationX(-delta * this.acceleration * (this.obj.body.velocity.y > 0 ? this.changeBonus : 1))

            this.limitMaxSpeed()
        } else if(inRange && submarine.obj.x > this.obj.x) {
            this.obj.body.setAccelerationX(delta * this.acceleration * (this.obj.body.velocity.y < 0 ? this.changeBonus : 1))

            this.limitMaxSpeed()
        } else {
            if(this.obj.body.velocity.x > this.deceleration*2) {
                this.obj.body.setAccelerationX(-delta * this.deceleration)
            } else if(this.obj.body.velocity.x <-this.deceleration*2) {
                this.obj.body.setAccelerationX(delta * this.deceleration)
            } else {
                this.obj.body.setAccelerationX(0)
                this.obj.body.setVelocityX(0)
            }
        }

        // Move y
        const subY = submarine.obj.y + submarine.obj.height*submarine.obj.scaleY/2

        if(this.obj.body.y < this.scene.minY) {
			this.obj.body.setAccelerationY(100)
		} else if(inRange && subY < this.obj.y) {
            this.obj.body.setAccelerationY(-delta * this.acceleration * (this.obj.body.velocity.y > 0 ? this.changeBonus : 1))

            this.limitMaxSpeed()
        } else if(inRange && subY > this.obj.y) {
            this.obj.body.setAccelerationY(delta * this.acceleration * (this.obj.body.velocity.y < 0 ? this.changeBonus : 1))

            this.limitMaxSpeed()
        } else {
            if(this.obj.body.velocity.y > this.deceleration*2) {
                this.obj.body.setAccelerationY(-delta * this.deceleration)
            } else if(this.obj.body.velocity.y <-this.deceleration*2) {
                this.obj.body.setAccelerationY(delta * this.deceleration)
            } else {
                this.obj.body.setAccelerationY(0)
                this.obj.body.setVelocityY(0)
            }
        }

		if(this.obj.body.velocity.x > 4) {
			this.obj.setFlipX(true)
		}
		else if(this.obj.body.velocity.x < -4) {
			this.obj.setFlipX(false)
		}

		if(this.obj.flipX) {
			this.radial.setPosition(this.obj.body.x + this.obj.body.width/2 + 220, this.obj.body.y + this.obj.body.height/2 - 20);
		}
		else {
			this.radial.setPosition(this.obj.body.x + this.obj.body.width/2 - 220, this.obj.body.y + this.obj.body.height/2 - 20);
		}

        if(time - this.wiggle.last - this.wiggle.delay > 0) {
            this.wiggle.last = time
            this.obj.x += Math.sin(time/this.wiggle.delay) * this.wiggle.multiplier
            this.obj.y += Math.cos(time/this.wiggle.delay) * this.wiggle.multiplier
        }
	}

    limitMaxSpeed() {
		if(Math.abs(this.obj.body.velocity.x) > this.maxSpeed) {
			this.obj.body.setAccelerationX(0);

            if(this.obj.body.velocity.x > 0) {
                this.obj.body.setVelocityX(this.obj.body.velocity.x-0.1)
            } else {
                this.obj.body.setVelocityX(this.obj.body.velocity.x+0.1)
            }
		} 
	}
}