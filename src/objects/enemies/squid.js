import Enemy from '@/objects/enemy'
import layers from '@/layers';

export default class Squid extends Enemy {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
    constructor(scene, x, y, disposable) {
        super(scene, disposable, 2)

        this.attackDistance = 600
        this.defaultAcceleration = 1;
		this.defaultDeceleration = 3;
        this.defaultMaxSpeed = 30;
        this.changeBonus = 2;
        this.ultRange = 400;
        this.ultTime = 2000;
        this.ultAcceleration = 3;
        this.ultDeceleration = 6;
        this.ultMaxSpeed = 50;
        this.ultCooldown = 5000;

        this.wiggle = {
            multiplier: 0.2,
            delay: 20,
            last: 0,
        }

        this.obj = scene.add.sprite(x, y);
		this.obj.setScale(0.13)
		this.obj.play("squid-idle")
        this.obj.depth = layers.MOBS;

        this.init()

        this.obj.body.setCircle(400, 50, 500)
        this.obj.body.setBounce(1)

        this.acceleration = this.defaultAcceleration;
		this.deceleration = this.defaultDeceleration;
        this.maxSpeed = this.defaultMaxSpeed;
        this.ultStart = 0;
        this.ultCooldownStart = 0;
        this.ulting = false;
        this.cooldown = false;
    }

    dispose() {
        super.dispose()
        this.obj.destroy()
    }

    update(time, delta) {
        super.update(time, delta);
        const submarine = this.scene.submarine;
        const dist = Math.sqrt((this.obj.x - submarine.obj.x)*(this.obj.x - submarine.obj.x) + (this.obj.y - submarine.obj.y)*(this.obj.y - submarine.obj.y));

        if((time-this.ultCooldownStart) > this.ultCooldown && this.cooldown) { // Cooldown finished
            this.ultCooldownStart = 0;
            this.cooldown = false;
        }
        else if(!this.cooldown && !this.ulting && dist < this.ultRange && this.ultCooldownStart === 0) { // Ulting
            this.obj.play("squid-ult")
            this.ultStart = time;
            this.acceleration = this.ultAcceleration;
            this.deceleration = this.ultDeceleration;
            this.maxSpeed = this.ultMaxSpeed;
            this.ulting = true;
        }
        else if((time-this.ultStart) > this.ultTime && this.ulting) { // Cooldown starting
            this.obj.play("squid-idle")
            this.ultStart = 0;
            this.ulting = false;
            this.ultCooldownStart = time;
            this.acceleration = this.defaultAcceleration;
            this.deceleration = this.defaultDeceleration;
            this.maxSpeed = this.defaultMaxSpeed;
            this.cooldown = true;
        }

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

        const trueAngle = Phaser.Math.Angle.Between(this.obj.x, this.obj.y, this.obj.x + this.obj.body.velocity.x, this.obj.y + this.obj.body.velocity.y)
        const nextAngle = Phaser.Math.Angle.RotateTo((this.obj.angle - 90) * Phaser.Math.DEG_TO_RAD, trueAngle, 0.01)

        this.obj.setAngle(nextAngle * Phaser.Math.RAD_TO_DEG + 90)

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