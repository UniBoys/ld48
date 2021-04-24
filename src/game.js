import m from "mithril";
import Phaser from "phaser";
import MainMenuView from "@/views/mainmenu";
import GameView from "@/views/game";
import LoadingView from "@/views/loading";
import config from "@/config";

export default class Application {
	constructor() {
		this.game = new Phaser.Game(config);
	}

    start() {
		this.render();
    }

    render() {
        m.route(document.body, '/', {
            '/': MainMenuView,
            '/sp': GameView,
			'/load': LoadingView
        });
    }
}