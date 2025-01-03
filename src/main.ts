import { Game, Types } from "phaser";

import "./style.css";
import { MainGame } from "./scenes/MainGame.ts";
import { HEIGHT, WIDTH } from "./contants.ts";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: "app",
  backgroundColor: "#028af8",
  physics: {
    default: "matter",
    matter: {
      debug: import.meta.env.MODE === "development",
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    MainGame,
  ],
};

export default new Game(config);
