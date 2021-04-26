import {Scene, Input, Camera} from "phaser";
import Player from "@/objects/player";
import Squid from "@/objects/enemies/squid";
import Queen from "@/objects/enemies/queen";
import SubmarineStage1 from "@/objects/submarine/stage1";
import SubmarineStage4 from "@/objects/submarine/stage4";
import SubmarineStage2 from "@/objects/submarine/stage2";
import SubmarineStage3 from "@/objects/submarine/stage3";
import Plank from "@/objects/resources/plank";
import Wood from "@/objects/resources/wood";
import Iron from "@/objects/resources/iron";
import Gold from "@/objects/resources/gold";
import Missile from "@/objects/weapons/missile";

import Background1 from "@/../resources/img/background-1.png";
import Sub1Sprite from '@/../resources/sprites/sub-1.png'
import Sub2Sprite from '@/../resources/sprites/sub-2.png'
import Sub3Sprite from '@/../resources/sprites/sub-3.png'
import Sub4Sprite from '@/../resources/sprites/sub-4.png'
import SquidSprite from '@/../resources/sprites/squid-sprite.png'
import MissileSprite from '@/../resources/sprites/missile-sprite.png'
import WaterSprite from '@/../resources/sprites/water-sprite.png'
import ExplosionSprite from "@/../resources/sprites/explosion.png";
import WaterBarSprite from '@/../resources/sprites/water-bar-sprite.png'
import SharkSprite from '@/../resources/sprites/shark-sprite.png'
import LanternfishSprite from '@/../resources/sprites/lanternfish-sprite.png'
import ChestSprite from '@/../resources/sprites/chest.png'
import WispQueenSprite from '@/../resources/sprites/wisp-queen.png'
import QueenPrisonSprite from '@/../resources/sprites/queen-prison.png'
import QueenPrisonBackground from '@/../resources/img/queen-prison-bg.png'
import OreWood1Image from '@/../resources/img/ore-wood-1.png'
import OrePlank1Image from '@/../resources/img/ore-plank-1.png'
import PartWood1Image from '@/../resources/img/part-wood-1.png'
import PartWood2Image from '@/../resources/img/part-wood-2.png'
import PartWood3Image from '@/../resources/img/part-wood-3.png'
import OreIron1Image from '@/../resources/img/ore-iron-1.png'
import OreIron2Image from '@/../resources/img/ore-iron-2.png'
import PartIron1Image from '@/../resources/img/part-iron-1.png'
import PartIron2Image from '@/../resources/img/part-iron-2.png'
import PartIron3Image from '@/../resources/img/part-iron-3.png'
import PartGold1Image from '@/../resources/img/part-gold-1.png'
import PartGold2Image from '@/../resources/img/part-gold-2.png'
import PartGold3Image from '@/../resources/img/part-gold-3.png'
import WoodBarImage from '@/../resources/img/wood-bar.png'
import IronBarImage from '@/../resources/img/iron-bar.png'
import TreasureBarImage from '@/../resources/img/treasure-bar.png'
import OxygenBarImage from '@/../resources/img/oxygen-bar.png'
import CannonImage from '@/../resources/img/cannon.png'
import CannonballImage from '@/../resources/img/cannonball.png'
import SignImage from '@/../resources/img/sign.png'
import DeathScreenImage from '@/../resources/img/death-screen.png'
import ExplosionSound from '@/../resources/audio/explosion.wav'
import HitSound from '@/../resources/audio/hit.wav'
import OreSound from '@/../resources/audio/ore.wav'
import MissSound from '@/../resources/audio/miss.wav'
import WoodSound from '@/../resources/audio/wood.wav'
import EngineSound from '@/../resources/audio/engine.wav'
import UpgradeSound from '@/../resources/audio/upgrade.wav'
import PickupSound from '@/../resources/audio/pickup.wav'
import SpearSound from '@/../resources/audio/spear.wav'
import ChestSound from '@/../resources/audio/chest.wav'
import layers from "@/layers";
import preloadScene from "@/scenes/preload";
import House from "@/objects/house";
import GlowImage from "@/../resources/img/glow.png";
import Title from "@/../resources/img/title.png";
import SpearImage from "@/../resources/img/spear.png";
import HouseImage from "@/../resources/img/house.png";
import { Spawner } from "../objects/spawner";
import Shark from "../objects/enemies/shark";
import RadialManager from "../radial";
import Lanternfish from "../objects/enemies/kut";

export default class MainScene extends Scene {
	constructor() {
		super({
			key: 'main', 
			pack: {
				files: [
					{
						type: 'image',
						key: 'title',
						url: Title,
					}
				]
			},
		});
	}

	preload() {
		preloadScene(this)
		this.load.image('background1', Background1);
		this.load.spritesheet('sub1', Sub1Sprite, { frameWidth: 957, frameHeight: 717 });
		this.load.spritesheet('sub2', Sub2Sprite, { frameWidth: 1956, frameHeight: 995 });
		this.load.spritesheet('sub3', Sub3Sprite, { frameWidth: 2048, frameHeight: 2048 });
		this.load.spritesheet('sub4', Sub4Sprite, { frameWidth: 1627, frameHeight: 897 });
		this.load.spritesheet('squid', SquidSprite, { frameWidth: 797, frameHeight: 1833 });
		this.load.spritesheet('missile', MissileSprite, { frameWidth: 1546, frameHeight: 457 });
		this.load.spritesheet('water', WaterSprite, { frameWidth: 1200, frameHeight: 200 });
		this.load.spritesheet('explosion', ExplosionSprite, { frameWidth: 500, frameHeight: 500 });
		this.load.spritesheet('water-bar', WaterBarSprite, {frameWidth: 50, frameHeight: 800});
		this.load.spritesheet('shark', SharkSprite, {frameWidth: 2048, frameHeight: 900});
		this.load.spritesheet('lanternfish', LanternfishSprite, {frameWidth: 1706, frameHeight: 909});
		this.load.spritesheet('wisp-queen', WispQueenSprite, {frameWidth: 429, frameHeight: 512});
		this.load.spritesheet('queen-prison', QueenPrisonSprite, {frameWidth: 2260, frameHeight: 1584});
		this.load.image('queen-prison-bg', QueenPrisonBackground);
		this.load.image('ore-wood-1', OreWood1Image);
		this.load.image('ore-wood-1', OreWood1Image);
		this.load.image('part-wood-1', PartWood1Image);
		this.load.image('part-wood-2', PartWood2Image);
		this.load.image('part-wood-3', PartWood3Image);
		this.load.image('ore-plank-1', OrePlank1Image);
		this.load.image('part-plank-1', PartWood1Image);
		this.load.image('part-plank-2', PartWood2Image);
		this.load.image('part-plank-3', PartWood3Image);
		this.load.image('ore-iron-1', OreIron1Image);
		this.load.image('ore-iron-2', OreIron2Image);
		this.load.image('part-iron-1', PartIron1Image);
		this.load.image('part-iron-2', PartIron2Image);
		this.load.image('part-iron-3', PartIron3Image);
		this.load.spritesheet('chest', ChestSprite, {frameWidth: 861, frameHeight: 744});
		this.load.image('part-gold-1', PartGold1Image);
		this.load.image('part-gold-2', PartGold2Image);
		this.load.image('part-gold-3', PartGold3Image);
		this.load.image('cannon', CannonImage);
		this.load.image('cannonball', CannonballImage);
        this.load.image('glow', GlowImage);
        this.load.image('spear', SpearImage);
		this.load.image('house', HouseImage);
		this.load.image('sign', SignImage);
		this.load.image('oxygen-bar', OxygenBarImage);
		this.load.image('iron-bar', IronBarImage);
		this.load.image('wood-bar', WoodBarImage);
		this.load.image('treasure-bar', TreasureBarImage);
		this.load.image('death-screen', DeathScreenImage);
		this.load.audio('explosion', ExplosionSound);
		this.load.audio('hit', HitSound);
		this.load.audio('ore', OreSound);
		this.load.audio('miss', MissSound);
		this.load.audio('wood', WoodSound);
		this.load.audio('engine', EngineSound);
		this.load.audio('upgrade', UpgradeSound);
		this.load.audio('pickup', PickupSound);
		this.load.audio('spear', SpearSound);
		this.load.audio('chest', ChestSound);
	}

    create() {
		this.cameras.main.zoom = 0.8

		this.animations();

		this.minY = 600;

		this.stageList = [
			SubmarineStage1, 
			SubmarineStage2, 
			SubmarineStage3, 
			SubmarineStage4,
		]
		this.stageIndex = 0;

		this.physics.world.setBounds(0, 0, 5000, 6000);
        this.cameras.main.setBounds(0, 0, 5000, 6000);
		const background1 = this.add.image(0, 0, 'background1');
		background1.setSize(5000, 6000);
		background1.setPosition(2500, 3000);
		background1.depth = layers.BACKGROUND_MAIN;
		this.background1Texture = this.textures.get('background1');

		const graphics = this.add.graphics();
   		graphics.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.2, 0.2, 0.5, 0.5);
    	graphics.fillRect(0, 620, 5000, 800);
		graphics.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.5, 0.5, 0.85, 0.85);
    	graphics.fillRect(0, 620+800, 5000, 300);
		graphics.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.85, 0.85, 0.93, 0.93);
    	graphics.fillRect(0, 620+800+300, 5000, 1500);
		graphics.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.93, 0.93, 0.98, 0.98);
    	graphics.fillRect(0, 620+800+300+1500, 5000, 450);
		graphics.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.98, 0.98, 1, 1);
    	graphics.fillRect(0, 620+800+300+1500+450, 5000, 1000);
		graphics.fillGradientStyle(0x000000, 0x000000, 0x6d549b, 0x6d549b, 1, 1, 0.6, 0.6);
    	graphics.fillRect(0, 620+800+300+1500+450+1000, 5000, 1500);
		graphics.depth = layers.DARKEN;

		this.darkenMask = this.add.graphics();

		graphics.mask = new Phaser.Display.Masks.BitmapMask(this, this.darkenMask);
		graphics.mask.invertAlpha = true;
		
		this.radials = new RadialManager(this, 1);
		this.radials.create();

		this.submarine = new (this.stageList[this.stageIndex])(this);
		this.house = new House(this);
		
		for(let x = 0; x < 6000; x += 120) {
			const water = this.add.sprite(x, 610);
			water.play("water");
			water.setDisplaySize(120, 20);
		}
		this.spawners = [];
		this.enemies = [];

		this.projectiles = [];
		this.resources = [];
		this.gatheringResources = [];

		this.setupSpawners();

		this.keylistener = this.input.keyboard.addKeys("W,A,S,D,SPACE,E,U");
		this.keylistener.U.on('down', () => {
			this.stageIndex++;
			this.submarine.destroy();
			this.submarine = new (this.stageList[this.stageIndex%this.stageList.length])(this);
			this.updateColliding()
		});

		this.updateColliding();

		this.corstText = this.make.text({
			x: this.cameras.main.width / 2,
			y: this.cameras.main.height / 2 + 300,
			text: '',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});
		this.corstText.setOrigin(0.5, 0.5);
		this.corstText.setScrollFactor(0);
		this.corstText.depth = layers.UI_2

		this.deathScreenStart = 0;
		this.deathScreen = this.add.image(0, 0, 'death-screen');
		this.deathScreen.setScrollFactor(0)
		this.deathScreen.setDisplaySize(1600/.8, 900/.8);
		this.deathScreen.setPosition(800, 450);
		this.deathScreen.depth = layers.UI_SCREENS;
		this.deathScreen.visible = false;
    }

	update(time, delta) {
		this.darkenMask.clear();
		this.submarine.update(time, delta);
		this.house.update(time, delta);

		this.corstText.setText(`x: ${this.input.mousePointer.worldX.toFixed(0)}, y: ${this.input.mousePointer.worldY.toFixed(0)}`)

		if(this.submarine.shot) {
			this.handleNewProjectile();
		}

		if(this.deathScreenStart > 0 && (time-this.deathScreenStart) > 2000) {
			this.deathScreenStart = 0;
			this.deathScreen.visible = false;
		}

		this.handleProjectileMapCollision();

		this.spawners.filter((resource) => resource != undefined).forEach(spawner => { spawner.update(time, delta) })
		this.gatheringResources.filter((resource) => resource != undefined).forEach(resource => { resource.update(time, delta) })
		this.enemies.filter((resource) => resource != undefined).forEach(enemy => { enemy.update(time, delta) });
	}

	respawn(time) {
		this.submarine.destroy();
		this.submarine = new (this.stageList[this.stageIndex%this.stageList.length])(this);
		this.updateColliding();

		this.deathScreen.visible = true;
		this.deathScreenStart = time;
	}

	handleProjectileMapCollision() {
		for(const projectile of this.projectiles) {
			if(projectile.body === undefined) continue;

			const alpha = this.textures.getPixelAlpha(projectile.body.center.x, projectile.body.center.y, "background1");
			
			if(alpha === 0) continue;

			if(!(projectile instanceof Missile)) {
				const sound = this.sound.add('miss')
				sound.setVolume(0.3)
				sound.play();
			}
			projectile.explode();
		}
	}

	handleNewProjectile() {
		const allProjectiles = this.submarine.getAllProjectiles();

		const newProjectile = allProjectiles.filter(projectile => !this.projectiles.includes(projectile))[0];

		if(newProjectile !== undefined) {
			// Check collision with enemies, submarine and resources.
			this.physics.add.overlap(this.resources.map(resource => resource.obj), newProjectile, (object1, object2) => {
				this.gatheringResources.push(this.resources.find(resource => resource.obj === object1))
				this.resources = this.resources.filter(resource => resource.obj !== object1);
				this.projectiles = this.projectiles.filter(projectile => projectile !== object2);

				if(object1.gather) object1.gather();
				if(object2.explode) object2.explode();
			})

			this.physics.add.overlap(this.enemies.map(enemy => enemy.obj), newProjectile, (object1, object2) => {
				const amount = this.stageIndex === 3 ? 2 : 1;

				if(object1.damage) object1.damage(amount);
				if(object2.explode) object2.explode();

				this.projectiles = this.projectiles.filter(projectile => projectile.obj !== object1);
			})

			this.projectiles.push(newProjectile);
		}
	}

	setupSpawners() {
		/// Enemies - Squid
		this.spawners.push(new Spawner(this, [
			{x: 4300, y: 930, must: true},
			{x: 4300, y: 2600, must: false},
			{x: 2300, y: 1700, must: false},
			{x: 3300, y: 1800, must: false},
			{x: 2600, y: 3050, must: false},
			{x: 1350, y: 2000, must: false},
			{x: 500, y: 2200, must: false},
			{x: 500, y: 3300, must: false},
		], 6, 10000, this.enemies, (x, y, disposing) => new Squid(this, x, y, disposing)));

		// Sharks
		this.spawners.push(new Spawner(this, [
			{x: 1200, y: 2840, must: false},
			{x: 1180, y: 4060, must: false},
			{x: 460, y: 2160, must: false},
			{x: 4610, y: 2783, must: false},
			{x: 2410, y: 1930, must: false},
		], 3, 10000, this.enemies, (x, y, disposing) => new Shark(this, x, y, disposing)));

		// Lanter Fish
		this.spawners.push(new Spawner(this, [
			{x: 937, y: 4328, must: false},
			{x: 4400, y: 3900, must: false},
			{x: 4131, y: 5522, must: true},
			{x: 1592, y: 5382, must: true},
		], 4, 10000, this.enemies, (x, y, disposing) => new Lanternfish(this, x, y, disposing)));

		// Queen
		this.spawners.push(new Spawner(this, [
			{x: 2800, y: 5870, must: true},
		], 1, 10000, this.enemies, (x, y, disposing) => new Queen(this, x, y, disposing)));

		/// Resources - Planks
		this.spawners.push(new Spawner(this, [
			{x: 415, y: 1335, must: true},
			{x: 780, y: 1227, must: false},
			{x: 1440, y: 1024, must: false},
			{x: 2650, y: 1245, must: false},
		], 3, 120000, this.resources, (x, y, disposing) => new Plank(this, x, y, disposing)))

		// Wood
		this.spawners.push(new Spawner(this, [
			{x: 3045, y: 1075, must: true},
			{x: 1950, y: 1438, must: false},
			{x: 1215, y: 1533, must: false},
		], 2, 120000, this.resources, (x, y, disposing) => new Wood(this, x, y, disposing)))

		// Iron
		this.spawners.push(new Spawner(this, [
			{x: 4151, y: 2840, must: false},
			{x: 3377, y: 3236, must: false},
			{x: 2908, y: 2755, must: true},
			{x: 2238, y: 3025, must: false},
			{x: 2177, y: 2195, must: false},
			{x: 1500, y: 2142, must: false},
			{x: 345, y: 2420, must: false},
			{x: 673, y: 2423, must: false},
			{x: 1285, y: 3055, must: true},
			{x: 579, y: 3628, must: false},
			{x: 1500, y: 4265, must: false},
			{x: 1856, y: 4425, must: false},
			{x: 2400, y: 4210, must: false},
			{x: 3210, y: 4240, must: false},
			{x: 3980, y: 4474, must: false},
		], 10, 120000, this.resources, (x, y, disposing) => new Iron(this, x, y, disposing)))

		// Chests
		this.spawners.push(new Spawner(this, [
			{x: 4485, y: 1200, must: false},
			{x: 4650, y: 3120, must: false},
			{x: 281, y: 3550, must: false},
			{x: 627, y: 4540, must: false},
			{x: 4480, y: 4210, must: false},
		], 5, 10000000, this.resources, (x, y, disposing) => new Gold(this, x, y, disposing)))
	}

	updateColliding() {
		this.enemies.forEach((enemy) => { 
			this.physics.add.collider(this.submarine.obj, enemy.obj, (object1, object2) => {
				this.submarine.damage(30);
				enemy.damage(1)
			})
		})
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

		// Sub 3
		this.anims.create({
            key: 'sub3-idle',
            frames: this.anims.generateFrameNumbers('sub3', { frames: [ 0, 1] }),
            frameRate: 1,
            repeat: -1
        });

		this.anims.create({
            key: 'sub3-move',
            frames: this.anims.generateFrameNumbers('sub3', { frames: [ 0, 1 ] }),
            frameRate: 9,
            repeat: -1
        });

		// Sub 4
		this.anims.create({
            key: 'sub4-idle',
            frames: this.anims.generateFrameNumbers('sub4', { frames: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1] }),
            frameRate: 9,
            repeat: -1
        });

		this.anims.create({
            key: 'sub4-move',
            frames: this.anims.generateFrameNumbers('sub4', { frames: [ 0, 1, 2, 3, 2, 1 ] }),
            frameRate: 11,
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

		// Missile
		this.anims.create({
            key: 'missile-idle',
            frames: this.anims.generateFrameNumbers('missile', { frames: [ 0 ] }),
            frameRate: 1,
            repeat: -1
        });
		this.anims.create({
            key: 'missile-run',
            frames: this.anims.generateFrameNumbers('missile', { frames: [ 0, 1, 2, 3 ] }),
            frameRate: 11,
            repeat: -1
        });

		// Water 
		this.anims.create({
            key: 'water',
            frames: this.anims.generateFrameNumbers('water', { frames: [ 0, 1, 2 ] }),
            frameRate: 8,
            repeat: -1
        });

		// Explosion
		this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] }),
            frameRate: 20,
            repeat: 0
        });

		// Water bar
		this.anims.create({
            key: 'water-bar',
            frames: this.anims.generateFrameNumbers('water-bar', { frames: [ 1,2,3,4 ] }),
            frameRate: 6,
            repeat: -1,
        });

		// Shark
		this.anims.create({
            key: 'shark-idle',
            frames: this.anims.generateFrameNumbers('shark', { frames: [ 0, 1, 2, 1 ] }),
            frameRate: 6,
            repeat: -1
        });

		this.anims.create({
            key: 'shark-ult',
            frames: this.anims.generateFrameNumbers('shark', { frames: [ 0, 1, 2, 1 ] }),
            frameRate: 9,
            repeat: -1
        });

		// Lanternfish
		this.anims.create({
            key: 'lanternfish-idle',
            frames: this.anims.generateFrameNumbers('lanternfish', { frames: [ 0, 1, 2, 3, 4, 3, 2, 1 ] }),
            frameRate: 9,
            repeat: -1
        });

		// Chest
		this.anims.create({
            key: 'chest-idle',
            frames: this.anims.generateFrameNumbers('chest', { frames: [ 0 ] }),
            frameRate: 1,
            repeat: 0,
        });

		this.anims.create({
            key: 'chest-open',
            frames: this.anims.generateFrameNumbers('chest', { frames: [ 0, 1, 2 ] }),
            frameRate: 4,
            repeat: 0,
		});

		// Wisp Queen
		this.anims.create({
            key: 'queen-idle',
            frames: this.anims.generateFrameNumbers('wisp-queen', { frames: [ 0, 1, 2, 3, 4, 3, 2, 1 ] }),
            frameRate: 8,
            repeat: -1,
        });

		// Queen Prison
		this.anims.create({
            key: 'prison-idle',
            frames: this.anims.generateFrameNumbers('queen-prison', { frames: [ 0 ] }),
            frameRate: 1,
            repeat: 0,
        });

		this.anims.create({
            key: 'prison-break',
            frames: this.anims.generateFrameNumbers('queen-prison', { frames: [ 0, 1, 2, 3, 4, 5 ] }),
            frameRate: 6,
            repeat: 0,
        });
	}
}