import { HEIGHT, WIDTH } from "../contants.ts";

const xInit = WIDTH / 2;
const yInit = HEIGHT / 2 + 100;

export class DialogText extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene) {
    const style = {
      fontSize: 80,
      fontFamily: `"Impact", monospace`,
      color: "white",
    };
    super(scene, xInit, yInit, "", style);
    this.scene.add.existing(this);
    this.setOrigin();
    this.depth = 3;
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
  override update(time: number): void {
    this.setY(yInit + 10 * Math.sin(time / 200));
  }
}
