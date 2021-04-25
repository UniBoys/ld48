import {Scene, Input, Camera} from "phaser";
import Player from "@/objects/player";
import Squid from "@/objects/enemies/squid"
import SubmarineStage1 from "@/objects/submarine/stage1";
import SubmarineStage4 from "@/objects/submarine/stage4";
import SubmarineStage2 from "@/objects/submarine/stage2";
import SubmarineStage3 from "@/objects/submarine/stage3";
import Iron from "@/objects/resources/iron";

import Background1 from "@/../resources/img/background-1.png";
import Sub1Sprite from '@/../resources/sprites/sub-1.png'
import Sub2Sprite from '@/../resources/sprites/sub-2.png'
import SquidSprite from '@/../resources/sprites/squid-sprite.png'
import OreIronImage from '@/../resources/img/ore-iron.png'
import PartIron1Image from '@/../resources/img/part-iron-1.png'
import PartIron2Image from '@/../resources/img/part-iron-2.png'
import PartIron3Image from '@/../resources/img/part-iron-3.png'

export default class MainScene extends Scene {
	constructor() {
		super({key: 'main'});
	}

	preload() {
		this.load.image('background1', Background1);
		this.load.spritesheet('sub1', Sub1Sprite, { frameWidth: 957, frameHeight: 717 });
		this.load.spritesheet('sub2', Sub2Sprite, { frameWidth: 1956, frameHeight: 995 });
		this.load.spritesheet('squid', SquidSprite, { frameWidth: 797, frameHeight: 1833 });
		this.load.image('ore-iron', OreIronImage);
		this.load.image('part-iron-1', PartIron1Image);
		this.load.image('part-iron-2', PartIron2Image);
		this.load.image('part-iron-3', PartIron3Image);
	}

    create() {
        this.cameras.main.setBackgroundColor("#4488AA")
		this.cameras.main.zoom = 0.6

		this.animations();

		this.stageList = [SubmarineStage1, SubmarineStage2, SubmarineStage3, SubmarineStage4]
		let stageIndex = 0;

		this.submarine = new (this.stageList[stageIndex])(this);
        
		this.physics.world.setBounds(0, 0, 5000, 6000);
        this.cameras.main.setBounds(0, 0, 5000, 6000);
		const background1 = this.add.image(0, 0, 'background1');
		background1.setSize(5000, 6000);
		background1.setPosition(2500, 3000);
		background1.depth = 1;
		this.background1Texture = this.textures.get('background1');

		this.enemies = [];

		// this.enemies.push(new Squid(this, 800, 800))
		// this.enemies.push(new Squid(this, 1200, 400))
		// this.enemies.push(new Squid(this, 500, 1200))
		// this.enemies.push(new Squid(this, 1800, 300))

		this.projectiles = [];
		this.resources = [];
		this.gatheringResources = [];

		this.resources.push(new Iron(this, 300, 300));

		this.keylistener = this.input.keyboard.addKeys("W,A,S,D,SPACE,U");
		this.keylistener.U.on('down', () => {
			stageIndex++;
			this.submarine.destroy();
			this.submarine = new (this.stageList[stageIndex%this.stageList.length])(this);
			this.updateColliding()
		});

		this.updateColliding();
    }

	update(time, delta) {
		this.submarine.update(time, delta);

		if(this.submarine.shot) {
			const allProjectiles = this.submarine.getAllProjectiles();

			const newProjectile = allProjectiles.filter(projectile => !this.projectiles.includes(projectile))[0];

			if(newProjectile !== undefined) {
				// Check collision with enemies, submarine and resources.
				this.physics.add.collider(this.resources.map(resource => resource.obj), newProjectile, (object1, object2) => {
					if(object1.gather) object1.gather();
					if(object2.explode) object2.explode();

					this.gatheringResources.push(this.resources.find(resource => resource.obj === object1))
					this.projectiles = this.resources.filter(resource => resource.obj !== object1);
					this.resources = this.projectiles.filter(projectile => projectile !== object2);
				})

				this.projectiles.push(newProjectile);
			}
		}

		for(const projectile of this.projectiles) {
			if(projectile.body === undefined) continue;

			const alpha = this.textures.getPixelAlpha(projectile.body.center.x, projectile.body.center.y, "background1");
			
			if(alpha === 0) continue;

			projectile.explode();
		}

		this.gatheringResources.forEach(resource => { resource.update(time, delta) })
		this.enemies.forEach(enemy => { enemy.update(time, delta) })
	}

	updateColliding() {
		this.enemies.forEach((enemy) => { this.physics.add.collider(this.submarine.obj, enemy.obj)})
	}

	animations() {
		// Sub 1
		this.anims.create({
            key: 'sub1-idle',
            frames: this.anims.generateFrameNumbers('sub1', { frames: [ 0, 1, 1, 1, 1,1,1,1, 2, 1, 1, 1, 1,1,1,1 ] }),
            frameRate: 2,
            repeat: -1
        });

		this.anims.create({
            key: 'sub1-move',
            frames: this.anims.generateFrameNumbers('sub1', { frames: [ 0, 1, 2, 1 ] }),
            frameRate: 7,
            repeat: -1
        });

		// Sub 2
		this.anims.create({
            key: 'sub2-idle',
            frames: this.anims.generateFrameNumbers('sub2', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7 ] }),
            frameRate: 2,
            repeat: -1
        });

		this.anims.create({
            key: 'sub2-move',
            frames: this.anims.generateFrameNumbers('sub2', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7 ] }),
            frameRate: 16,
            repeat: -1
        });
		
		/// Squid
		this.anims.create({
            key: 'squid-idle',
            frames: this.anims.generateFrameNumbers('squid', { frames: [ 0, 1, 2, 1 ] }),
            frameRate: 7,
            repeat: -1
        });

		this.anims.create({
            key: 'squid-ult',
            frames: this.anims.generateFrameNumbers('squid', { frames: [ 0, 1, 2, 1 ] }),
            frameRate: 11,
            repeat: -1
        });
	}
}