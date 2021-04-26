import m from "mithril";
import config from "@/config";
import Phaser from "phaser";

export default class GameView {
    oncreate() {
        this.game = new Phaser.Game(config);

        document.addEventListener('keydown', e => {
            if(e.key === 'Escape') this.togglePause();
        })
    }

    view() {
        return (
            <div class='container'>
                <div id="game-frame" class="main-center">
				
                </div>
                <div class='escape-menu'>

                </div>
            </div>
        );
    }
}