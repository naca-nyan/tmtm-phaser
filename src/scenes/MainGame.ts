import { Scene } from "phaser";
const WIDTH = 900;
const HEIGHT = 1600;
const BORDER = 100;

export class MainGame extends Scene {
  lastCreated = 0;
  constructor() {
    super("MainGame");
  }
  preload() {
    this.load.setBaseURL("/");
    this.load.image("twitter", "assets/twitter.png");
  }

  makeBall() {
    const [x, y] = [Phaser.Math.Between(BORDER + 10, WIDTH - BORDER - 10), 100];
    const ball = this.matter.add.image(x, y, "twitter");
    ball.setCircle(32);
    return ball;
  }

  create() {
    this.matter.world.setBounds(
      BORDER,
      0,
      WIDTH - BORDER * 2,
      HEIGHT - BORDER * 2,
    );

    this.input.addListener("pointerdown", () => {
      this.makeBall();
    });
  }
  override update(time: number, _delta: number): void {
    if (time - this.lastCreated > 1000) {
      this.lastCreated = time;
      this.makeBall();
    }
  }
}
