import { Scene } from "phaser";
import { BORDER, HEIGHT, WIDTH } from "../contants.ts";
import {
  Ball,
  KINDS as BALL_KINDS,
  RADIUS as BALL_RADIUS,
} from "../components/Ball.ts";

export const BALL_MAX = 60;
export const INITIAL_TIME = 60;

export class MainGame extends Scene {
  score = 0;
  scoreDisplay = 0;
  maxCombo = 0;
  maxComboDisplay = 0;
  scoreText!: Phaser.GameObjects.Text;
  countdownText!: Phaser.GameObjects.Text;
  state: "in game" | "game over" | "wait for restart" = "in game";

  lastCreated = 0;
  balls: Set<Ball> = new Set();
  dragging: Set<Ball> = new Set();
  prev!: Ball;
  graphics!: Phaser.GameObjects.Graphics;
  constructor() {
    super("MainGame");
  }
  preload() {
    this.load.setBaseURL(import.meta.env.BASE_URL);
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

    ball.on("dragstart", () => {
      this.matter.world.pause();
      ball.selected();
      this.prev = ball;
      this.dragging = new Set([ball]);
      this.sound.play("drop");
    });
    ball.on("dragenter", (_p: Phaser.Input.Pointer, target: Ball) => {
      if (this.dragging.has(target)) return;
      if (this.prev.kind !== target.kind) return;
      if (this.prev.distance(target) > BALL_RADIUS * 3.42) return;
      target.selected();
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
        this.score += Math.pow(this.dragging.size, 3);
        this.maxCombo = Math.max(this.maxCombo, this.dragging.size);
        this.sound.play("spot");
      } else {
        this.dragging.forEach((b) => b.selected(false));
      }
      this.graphics.clear();
    });
    return ball;
  }

  create() {
    this.state = "in game";
    this.score =
      this.scoreDisplay =
      this.maxCombo =
      this.maxComboDisplay =
        0;
    this.scoreText = this.add.text(30, 60, "", {
      fontSize: 70,
      fontFamily: "Serif",
      color: "white",
    });
    this.scoreText.depth = 3;
    this.countdownText = this.add.text(500, 140, "", {
      fontSize: 70,
      fontFamily: "Serif",
      color: "white",
      align: "right",
    });
    this.countdownText.depth = 3;

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
  override update(time: number, delta: number): void {
    super.update(time, delta);
    if (time - this.lastCreated > 10 && this.balls.size < BALL_MAX) {
      this.lastCreated = time;
      const b = this.makeBall();
      this.balls.add(b);
    }
    this.scoreDisplay = Phaser.Math.MaxAdd(
      this.scoreDisplay,
      Math.ceil((this.score - this.scoreDisplay) / 3) || 1,
      this.score,
    );
    this.maxComboDisplay = Phaser.Math.MaxAdd(
      this.maxComboDisplay,
      1,
      this.maxCombo,
    );
    this.scoreText.setText(
      `   Score: ${this.scoreDisplay.toLocaleString()}\nCombo: ${this.maxComboDisplay}`,
    );
    const remaining = INITIAL_TIME - (time - this.time.startTime) / 1000;
    const countdown = remaining > 0 ? remaining.toFixed(1) : "Time up!";
    this.countdownText.setText(countdown.padStart(11));
    if (remaining <= 0 && this.state === "in game") {
      this.matter.world.setBounds(0, 0, 0, 0, 0, false, false, false, false);
      this.balls.forEach((b) => {
        b.setTint(0x666666);
        if (!this.dragging.has(b)) this.input.disable(b);
      });
      this.state = "game over";
    }
    if (remaining <= -2 && this.state === "game over") {
      this.state = "wait for restart";
      this.add.text(WIDTH / 2, HEIGHT / 2, "Tap to restart!", {
        fontSize: 80,
        fontFamily: "Serif",
      }).setOrigin(0.5);
      this.input.once("pointerdown", () => {
        this.scene.start("MainGame");
        this.balls.clear();
      });
    }
  }
}
