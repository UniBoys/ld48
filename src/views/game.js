import m from "mithril";
import config from "@/config";
import Phaser from "phaser";

export default class GameView {
    oncreate() {
        this.game = new Phaser.Game(config);
    }

    view() {
        return (
			<div id="game-frame" class="main-center">
				
			</div>
        );
    }
}