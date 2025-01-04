import { HEIGHT, WIDTH } from "../contants.ts";

const xInit = WIDTH / 2;
const yInit = HEIGHT / 2 + 100;

const style = {
  fontSize: 80,
  fontFamily: `"Impact", sans-serif`,
  color: "white",
};

export class DialogText extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, text?: string) {
    super(scene, xInit, yInit, text ?? "", style);
    this.scene.add.existing(this);
    this.setOrigin();
    this.depth = 3;
    this.scene.tweens.add({
      targets: this,
      duration: 400,
      y: "- 20",
      alpha: 0.95,
      ease: Phaser.Math.Easing.Quadratic.Out,
      yoyo: true,
      loop: -1,
    });
  }
  set(text: string, duration = 0) {
    this.setText(text);
    if (duration > 0) {
      this.scene.time.addEvent({
        delay: duration,
        callback: () => this.setText(""),
      });
    }
  }
}
