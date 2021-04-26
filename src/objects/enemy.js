import {Spawnable} from '@/objects/spawner'

export default class Enemy extends Spawnable {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
	constructor(scene, disposing, maxHealth) {
        super(disposing)
		this.scene = scene;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;

        this.lastDamage = 0;
    }

    damage(amount) {
        this.health -= amount;

        if(this.health <= 0) this.dispose();
        else {
            this.lastDamage = -1;
            this.obj.tint = 0xff0000;
        }
    }

    init() {
        this.scene.physics.add.existing(this.obj);

        this.obj.damage = (amount) => this.damage(amount)
        this.obj.body.setCollideWorldBounds(true);
    }

    update(time, delta) {
        if(this.lastDamage == -1) this.lastDamage = time
        else if(this.lastDamage > 0 && time - this.lastDamage > 1000) {
            this.lastDamage = 0;
            this.obj.tint = 0xffffff
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
}