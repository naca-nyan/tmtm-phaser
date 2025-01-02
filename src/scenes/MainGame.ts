import { Scene } from "phaser";

const WIDTH = 900;
const HEIGHT = 1300;
const BORDER = 100;
const BALL_RADIUS = 48;
const BALL_MAX = 60;

type Pointer = Phaser.Input.Pointer;
type Item = Phaser.Physics.Matter.Image;

const KINDS = ["twitter", "insta", "youtube", "discord", "facebook"] as const;

export class MainGame extends Scene {
  lastCreated = 0;
  balls: Set<Item> = new Set();
  dragging: Set<Item> = new Set();
  prev!: Item;
  graphics!: Phaser.GameObjects.Graphics;
  constructor() {
    super("MainGame");
  }
  preload() {
    this.load.setBaseURL("/");
    KINDS.forEach((kind) => this.load.image(kind, `assets/${kind}.png`));
    this.load.audio("drop", "assets/sounds/drop.mp3");
    this.load.audio("spot", "assets/sounds/spot.mp3");
  }

  makeBall() {
    const [x, y] = [
      WIDTH / 2 + Phaser.Math.Between(-100, 100),
      100 + Phaser.Math.Between(-50, 50),
    ];
    const kind = KINDS[Phaser.Math.Between(0, KINDS.length - 1)];
    const ball = this.matter.add.image(x, y, kind);
    ball.setCircle(BALL_RADIUS);
    ball.setInteractive({ draggable: true, dropZone: true });

    ball.on("dragstart", () => {
      this.matter.world.pause();
      ball.setTint(0x222222);
      this.prev = ball;
      this.dragging = new Set([ball]);
      this.sound.play("drop");
    });
    ball.on("dragenter", (_p: Pointer, target: Item) => {
      if (this.dragging.has(target)) return;
      if (this.prev.texture !== target.texture) return;
      if (
        Phaser.Math.Distance.Between(
          this.prev.x,
          this.prev.y,
          target.x,
          target.y,
        ) > BALL_RADIUS * 3.2
      ) return;
      target.setTint(0x222222);
      this.dragging.add(target);
      this.graphics.lineStyle(10, 0xFFFFFF).lineBetween(
        this.prev.x,
        this.prev.y,
        target.x,
        target.y,
      ).stroke();
      this.sound.play("drop");
      this.prev = target;
    });
    ball.on("dragend", () => {
      this.matter.world.resume();
      if (this.dragging.size >= 3) {
        this.dragging.forEach((b) => {
          this.balls.delete(b);
          b.destroy();
        });
        this.sound.play("spot");
      } else {
        this.dragging.forEach((b) => b.clearTint());
      }
      this.graphics.clear();
    });
    return ball;
  }

  create() {
    this.add.rectangle(WIDTH / 2, 135, WIDTH, 270, 0x1cb7eb).depth = 2;
    this.matter.world.setBounds(
      BORDER,
      0,
      WIDTH - BORDER * 2,
      HEIGHT - BORDER,
    );
    this.graphics = this.add.graphics();
    this.graphics.depth = 1;
  }
  override update(time: number, _delta: number): void {
    if (time - this.lastCreated > 10 && this.balls.size < BALL_MAX) {
      this.lastCreated = time;
      const b = this.makeBall();
      this.balls.add(b);
    }
  }
}
