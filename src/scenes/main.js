import {Scene, Input} from "phaser";

export default class MainScene extends Scene {
	constructor() {
		super({key: 'main'});
	}

    create() {
        const submarine = this.add.rectangle(100, 100, 50, 50, 0xff0000);
    }
}