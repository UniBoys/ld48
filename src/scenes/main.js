import {Scene, Input, Camera} from "phaser";
import Player from "@/objects/player";
import Squid from "@/objects/enemies/squid"
import SubmarineStage1 from "@/objects/submarine/stage1";
import SubmarineStage4 from "@/objects/submarine/stage4";
import SubmarineStage2 from "@/objects/submarine/stage2";
import SubmarineStage3 from "@/objects/submarine/stage3";
import image from "@/../resources/img/Background_3_Layers-1.png";

export default class MainScene extends Scene {
	constructor() {
		super({key: 'main'});
	}

	preload() {
		this.load.image('Background_3_Layers-1', image);
	}

    create() {
        this.cameras.main.setBackgroundColor("#4488AA")

        for(var i = 0; i < 10; i++) {
            this.add.rectangle(200 + i*10, 200 + 200*i, 50, 50, 0x00ff00);
		}

		const stageList = [SubmarineStage1, SubmarineStage2, SubmarineStage3, SubmarineStage4]
		let stageIndex = 0;

		this.player = new Player(this)
		this.submarine = new (stageList[stageIndex])(this);
        
		this.physics.world.setBounds(0, 0, 5000, 6000);
        this.cameras.main.setBounds(0, 0, 5000, 6000);
		const background1 = this.add.image(0, 0, 'Background_3_Layers-1');
		background1.setSize(5000, 6000);
		background1.setPosition(2500, 3000);
		background1.depth = 1;

		const texture = this.textures.get('Background_3_Layers-1');

		for(let i = 0; i < 80; i++) {
			this.textures.getPixelAlpha(Math.ceil(500 * Math.random()), Math.ceil(500 * Math.random()), );
		}

		console.log(`It took ${(stopTime-startTime)} ms to find colors 80 times`);

		this.enemies = []

		this.enemies.push(new Squid(this, 800, 800))
		this.enemies.push(new Squid(this, 1200, 400))
		this.enemies.push(new Squid(this, 500, 1200))
		this.enemies.push(new Squid(this, 1800, 300))

		this.keylistener = this.input.keyboard.addKeys("W,A,S,D,SPACE,U");
		this.keylistener.U.on('down', () => {
			stageIndex++;
			this.submarine.destroy();
			this.submarine = new (stageList[stageIndex%stageList.length])(this);
		});
    }

	update(time, delta) {
		this.submarine.update(time, delta);
		this.player.update(delta);
		this.enemies.forEach(enemy => { enemy.update(time, delta) })
	}
}