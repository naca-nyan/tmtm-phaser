import { BORDER, HEIGHT, WIDTH } from "../contants.ts";
import {
  Ball,
  KINDS as BALL_KINDS,
  RADIUS as BALL_RADIUS,
} from "../components/Ball.ts";
import { BallLines } from "../components/BallLines.ts";
import { ScoreText } from "../components/ScoreText.ts";

export const BALL_MAX = 60;
export const INITIAL_TIME = 60;

export class MainGame extends Phaser.Scene {
  scoreText!: ScoreText;
  countdownText!: Phaser.GameObjects.Text;
  state: "in game" | "game over" | "wait for restart" = "in game";

  lastCreated = 0;
  balls: Set<Ball> = new Set();
  dragging: Set<Ball> = new Set();
  prev!: Ball;
  ballLines!: BallLines;
  constructor() {
    super("MainGame");
  }

  preload() {
    BALL_KINDS.forEach((kind) => this.load.image(kind, `assets/${kind}.png`));
    this.load.audio("drop", "assets/sounds/drop.mp3");
    this.load.audio("spot", "assets/sounds/spot.mp3");
  }

  makeBall() {
    const [x, y] = [
      WIDTH / 2 + Phaser.Math.Between(-100, 100),
      100 + Phaser.Math.Between(-50, 50),
    ];
    const kind = BALL_KINDS[Phaser.Math.Between(0, BALL_KINDS.length - 1)];
    const ball = new Ball(this.matter.world, x, y, kind);
    return ball;
  }

  dragStart(ball: Ball) {
    ball.selected();
    this.prev = ball;
    this.dragging = new Set([ball]);
    this.ballLines.addFollow(ball);
    this.sound.play("drop");
  }
  dragEnter(target: Ball) {
    if (this.dragging.has(target)) return;
    if (this.prev.kind !== target.kind) return;
    if (this.prev.distance(target) > BALL_RADIUS * 3.42) return;
    target.selected();
    this.dragging.add(target);
    this.ballLines.addFollow(target);
    this.sound.play("drop");
    this.prev = target;
  }
  dragEnd() {
    if (this.dragging.size >= 3) {
      this.dragging.forEach((b) => {
        this.balls.delete(b);
        b.destroy();
      });
      this.scoreText.addScore(Math.pow(this.dragging.size, 3) * 99);
      this.scoreText.setChainIfMax(this.dragging.size);
      this.sound.play("spot");
    } else {
      this.dragging.forEach((b) => b.selected(false));
    }
    this.ballLines.clear();
  }

  create() {
    this.state = "in game";
    this.scoreText = new ScoreText(this, 60, 60);
    this.countdownText = this.add.text(WIDTH - 60, 130, "", {
      fontSize: 70,
      fontFamily: `Impact, monospace`,
      color: "white",
    });
    this.countdownText.setOrigin(1, 0);
    this.countdownText.depth = 3;

    this.add.rectangle(WIDTH / 2, 135, WIDTH, 270, 0x1cb7eb).depth = 2;
    this.matter.world.setBounds(
      BORDER,
      0,
      WIDTH - BORDER * 2,
      HEIGHT - BORDER,
    );
    this.ballLines = new BallLines(this);

    type P = Phaser.Input.Pointer;
    this.input.on("dragstart", (_: P, b: Ball) => this.dragStart(b));
    this.input.on("dragenter", (_: P, _b: Ball, t: Ball) => this.dragEnter(t));
    this.input.on("dragend", () => this.dragEnd());
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);
    this.ballLines.update();
    this.scoreText.update();
    if (time - this.lastCreated > 10 && this.balls.size < BALL_MAX) {
      this.lastCreated = time;
      const b = this.makeBall();
      this.balls.add(b);
    }
    const remaining = INITIAL_TIME - (time - this.time.startTime) / 1000;
    const countdown = remaining > 0 ? remaining.toFixed(1) : "Time up!";
    this.countdownText.setText(countdown);
    if (remaining <= 0 && this.state === "in game") {
      this.matter.world.setBounds(0, 0, 0, 0, 0, false, false, false, false);
      this.balls.forEach((b) => {
        b.setTint(0x666666);
        this.input.disable(b);
        this.ballLines.clear();
      });
      this.state = "game over";
    }
    if (remaining <= -2 && this.state === "game over") {
      this.state = "wait for restart";
      this.add.text(WIDTH / 2, HEIGHT / 2 + 100, "Tap to restart!", {
        fontSize: 80,
        fontFamily: `"Impact", monospace`,
      }).setOrigin();
      this.input.once("pointerdown", () => {
        this.scene.start("MainGame");
        this.balls.forEach((b) => b.destroy());
        this.balls.clear();
      });
    }
  }
}
