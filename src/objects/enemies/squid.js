import Enemy from '@/objects/enemy'

export default class Squid extends Enemy {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
    constructor(scene, x, y) {
        super(scene)

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

        this.obj = scene.add.rectangle(x, y, 30, 80, 0xff00ff);
        this.init()

        this.acceleration = this.defaultAcceleration;
		this.deceleration = this.defaultDeceleration;
        this.maxSpeed = this.defaultMaxSpeed;
        this.ultStart = 0;
        this.ultCooldownStart = 0;
        this.ulting = false;
        this.cooldown = false;
    }


    update(time, delta) {
        const submarine = this.scene.submarine;
        const dist = Math.sqrt((this.obj.x - submarine.obj.x)*(this.obj.x - submarine.obj.x) + (this.obj.y - submarine.obj.y)*(this.obj.y - submarine.obj.y));
        console.log(this.ultStart === 0, dist < this.ultRange, this.ultCooldownStart === 0);

        if((time-this.ultCooldownStart) > this.ultCooldown && this.cooldown) { // Cooldown finished
            console.log("Cooldown finished");
            this.ultCooldownStart = 0;
            this.cooldown = false;
        }
        else if(!this.cooldown && !this.ulting && dist < this.ultRange && this.ultCooldownStart === 0) { // Ulting
            console.log("Ulting");
            this.obj.fillColor = 0xff0099
            this.ultStart = time;
            this.acceleration = this.ultAcceleration;
            this.deceleration = this.ultDeceleration;
            this.maxSpeed = this.ultMaxSpeed;
            this.ulting = true;
        }
        else if((time-this.ultStart) > this.ultTime && this.ulting) { // Cooldown starting
            console.log("Cooldown starting");
            this.obj.fillColor = 0xff00ff
            this.ultStart = 0;
            this.ulting = false;
            this.ultCooldownStart = time;
            this.acceleration = this.defaultAcceleration;
            this.deceleration = this.defaultDeceleration;
            this.maxSpeed = this.defaultMaxSpeed;
            this.cooldown = true;
        }

        // Move x
        if(this.obj.x - submarine.obj.x < this.attackDistance && submarine.obj.x < this.obj.x) {
            this.obj.body.setAccelerationX(-delta * this.acceleration * (this.obj.body.velocity.y > 0 ? this.changeBonus : 1))

            this.limitMaxSpeed()
        } else if(submarine.obj.x - this.obj.x > -this.attackDistance && submarine.obj.x > this.obj.x) {
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
        if(this.obj.y - submarine.obj.y < this.attackDistance && submarine.obj.y < this.obj.y) {
            this.obj.body.setAccelerationY(-delta * this.acceleration * (this.obj.body.velocity.y > 0 ? this.changeBonus : 1))

            this.limitMaxSpeed()
        } else if(submarine.obj.y - this.obj.y > -this.attackDistance && submarine.obj.y > this.obj.y) {
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
        const nextAngle = Phaser.Math.Angle.RotateTo(this.obj.angle, trueAngle, 0.0005)

        this.obj.body.rotation = nextAngle * Phaser.Math.RAD_TO_DEG + 90

        if(time - this.wiggle.last - this.wiggle.delay > 0) {
            this.wiggle.last = time
            this.obj.x += Math.sin(time/this.wiggle.delay) * this.wiggle.multiplier
            this.obj.y += Math.cos(time/this.wiggle.delay) * this.wiggle.multiplier

            console.log(`Change: ${Math.sin(time/this.wiggle.delay) * this.wiggle.multiplier}`)
        }        
    }

    limitMaxSpeed() {
		if(Math.abs(this.obj.body.velocity.x) > this.maxSpeed) {
			this.obj.body.setAccelerationX(0);
			this.obj.body.setVelocityX(this.obj.body.velocity.x > 0 ? this.maxSpeed : -this.maxSpeed);
		} 
	}
}