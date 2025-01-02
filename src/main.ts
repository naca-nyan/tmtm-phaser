import { Game, Types } from "phaser";

import "./style.css";
import { MainGame } from "./scenes/MainGame.ts";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 900,
  height: 1600,
  parent: "app",
  backgroundColor: "#028af8",
  physics: {
    default: "matter",
    matter: {
      gravity: { x: 0, y: 2 },
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
