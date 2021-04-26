import {Spawnable} from '@/objects/spawner'
import layers from "@/layers";

export default class Resource extends Spawnable {
	constructor({scene, x, y, width, height, disposing}) {
		super(disposing)
		this.scene = scene;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.rotation = 0;
		this.partWidth = 30;
		this.partHeight = 30;
		this.freeFloatTime = 1000;
		this.partSpeed = 6;
		this.partRotateSpeed = 0.04;
		this.amount = 50;
		this.name = "";
	}

	init() {
		this.obj = this.scene.add.image(this.x, this.y, `ore-${this.name}-${Math.ceil(this.variance*Math.random())}`);
		this.obj.setOrigin(0.5, 1)
		this.obj.flipX = Math.random() <= 0.4;
        this.scene.physics.add.existing(this.obj);
		this.obj.setDisplaySize(this.width, this.height)
		this.obj.setAngle(this.rotation);
		this.obj.depth = layers.RESOURCES;
		this.obj.gather = () => this.gather();

		this.gathering = false;
		this.gatherStart = 0;
		this.parts = [];
		if(this.addName == undefined) this.addName = this.name;
	}

	update(time, delta) {
		if(this.gathering && this.gatherStart === 0) {
			this.gatherStart = time;
		}
		else if((time-this.gatherStart)>this.freeFloatTime) {
			for(const part of this.parts) {
				let angleToPlayer = Phaser.Math.Angle.Between(part.body.x, part.body.y, this.scene.submarine.obj.body.x + this.scene.submarine.obj.body.width/2, this.scene.submarine.obj.body.y + this.scene.submarine.obj.body.height/2);
				const normTrueAngle = Phaser.Math.Angle.Normalize(angleToPlayer);
				const normIAngle = Phaser.Math.Angle.Normalize(part.iAngle);
				const calc = (normTrueAngle - normIAngle + 2*3.14) % (3.14*2);
	
				if(calc < 3.14 && calc > 0.1) {
					part.iAngle += this.partRotateSpeed + (Math.random()-0.5) * 0.01;
				}
				else if(calc < 6.2) {
					part.iAngle -= this.partRotateSpeed + (Math.random()-0.5) * 0.01;
				}
	
				part.body.setVelocityX(Math.cos(part.iAngle) * this.partSpeed * delta)
				part.body.setVelocityY(Math.sin(part.iAngle) * this.partSpeed * delta)
			}
		}
	}

	gather() {
		this.dispose();
		this.obj.destroy();

		this.createPart(1);
		this.createPart(2);
		this.createPart(3);

		this.scene.physics.add.collider(this.parts, this.scene.submarine.obj, (object1, object2) => {
			object1.destroy();
			this.parts = this.parts.filter(part => part !== object1);
			this.scene.submarine.inventory.add(this.addName, this.amount / 3);
		})
		
		this.gathering = true;
	}

	createPart(index) {
		const part = this.scene.add.image(this.x, this.y, `part-${this.name}-${index}`);
		part.depth = layers.ITEMS;
		part.setDisplaySize(this.partWidth, this.partHeight);
        this.scene.physics.add.existing(part);
		part.body.rotation = Math.random() * 360;
		
		let angleToPlayer = Phaser.Math.Angle.Between(part.body.x, part.body.y, this.scene.submarine.obj.body.x + this.scene.submarine.obj.body.width/2, this.scene.submarine.obj.body.y + this.scene.submarine.obj.body.height/2);
		angleToPlayer += (3.14/1.5) * (Math.random() - 0.5);

		part.body.setVelocityX(Math.cos(angleToPlayer) * this.partSpeed * 10);
		part.body.setVelocityY(Math.sin(angleToPlayer) * this.partSpeed * 10);
		part.iAngle = angleToPlayer;
		this.parts.push(part);
	}
}