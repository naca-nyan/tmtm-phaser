import { Game, Types } from "phaser";

import { MainGame } from "./scenes/MainGame.ts";
import { MainMenu } from "./scenes/MainMenu.ts";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "app",
  backgroundColor: "#028af8",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 200 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    MainMenu,
    MainGame,
  ],
};

export default new Game(config);
