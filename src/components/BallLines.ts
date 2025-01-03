import { Ball } from "./Ball.ts";
import GameObjects = Phaser.GameObjects;
type Options = Phaser.Types.GameObjects.Graphics.Options;
export class BallLines extends GameObjects.Graphics {
  private balls: Ball[] = [];
  constructor(scene: Phaser.Scene) {
    const width = 10;
    const color = 0xFFFFFF;
    const options: Options = {
      lineStyle: { width, color },
    };
    super(scene, options);
    this.scene.add.existing(this);
    this.depth = 1;
  }
  addFollow(ball: Ball) {
    this.balls.push(ball);
  }
  override clear(): this {
    super.clear();
    this.balls.length = 0;
    return this;
  }
  override update(): void {
    super.clear();
    for (const ball of this.balls) {
      this.lineTo(ball.x, ball.y).stroke();
    }
    for (const ball of this.balls) {
      this.fillCircle(ball.x, ball.y, 4).stroke();
    }
  }
}
