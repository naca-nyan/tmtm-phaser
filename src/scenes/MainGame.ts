import { Scene } from "phaser";

export class MainGame extends Scene {
  msg_text!: Phaser.GameObjects.Text;
  constructor() {
    super("MainGame");
  }
  create() {
    this.msg_text = this.add.text(
      400,
      300,
      "This is the Main Game",
    );
    this.msg_text.setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
}
