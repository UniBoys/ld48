import m from "mithril";
import MainMenuView from "@/views/mainmenu";
import GameView from "@/views/game";

export default class Application {

    start() {
		this.render();
    }

    render() {
        m.route(document.body, '/', {
            '/': MainMenuView,
            '/sp': GameView
        });
    }
}