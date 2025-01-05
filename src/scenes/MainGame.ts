import { BORDER, HEIGHT, WIDTH } from "../contants.ts";
import {
  Ball,
  KINDS as BALL_KINDS,
  RADIUS as BALL_RADIUS,
} from "../components/Ball.ts";
import { BallLines } from "../components/BallLines.ts";
import { ScoreText } from "../components/ScoreText.ts";
import { TimerText } from "../components/TimerText.ts";
import { DialogText } from "../components/DialogText.ts";

export const BALL_MAX = 45;
export const INITIAL_TIME = 60;

export class MainGame extends Phaser.Scene {
  scoreText!: ScoreText;
  timerText!: TimerText;
  dialogText!: DialogText;
  state: "ready" | "in game" | "game over" | "wait for restart" = "ready";

  balls: Set<Ball> = new Set();
  dragging: Ball[] = [];
  ballLines!: BallLines;
  ballTimer!: Phaser.Time.TimerEvent;

  bgm!: ReturnType<typeof this.sound.add>;

  constructor() {
    super("MainGame");
  }

  preload() {
    BALL_KINDS.forEach((kind) => this.load.image(kind, `assets/${kind}.png`));
    this.load.audio("drop", "assets/sounds/drop.mp3");
    this.load.audio("spot", "assets/sounds/spot.mp3");
    this.load.audio("honey-lemon", "assets/sounds/honey-lemon.mp3");
    this.load.audio("countdown-ready", "assets/sounds/countdown-ready.mp3");
    this.load.audio("countdown-end", "assets/sounds/countdown-end.mp3");
  }

  makeBall() {
    if (this.balls.size > BALL_MAX) return;
    const x = WIDTH / 2 + Phaser.Math.Between(-100, 100);
    const y = 100 + Phaser.Math.Between(-50, 50);
    const kind = BALL_KINDS[Phaser.Math.Between(0, BALL_KINDS.length - 1)];
    const ball = new Ball(this.matter.world, x, y, kind);
    this.balls.add(ball);
  }

  dragStart(ball: Ball) {
    ball.selected();
    this.dragging = [ball];
    this.ballLines.setFollow(this.dragging);
    this.sound.play("drop");
  }
  dragEnter(target: Ball) {
    if (this.dragging.length === 0) return;
    const top = this.dragging[this.dragging.length - 1];
    if (top.kind !== target.kind) return;
    if (top.distance(target) > BALL_RADIUS * 3.42) return;
    if (top === target) return;
    const prev = this.dragging[this.dragging.length - 2];
    if (prev && prev === target) {
      this.dragging.pop()?.selected(false);
      this.ballLines.setFollow(this.dragging);
      return;
    }
    if (this.dragging.includes(target)) return;
    target.selected();
    this.dragging.push(target);
    this.ballLines.setFollow(this.dragging);
    this.sound.play("drop");
  }
  dragEnd() {
    if (this.dragging.length >= 3) {
      this.dragging.forEach((b) => {
        this.balls.delete(b);
        b.destroy();
      });
      this.scoreText.addScore(Math.pow(this.dragging.length, 3) * 43);
      this.scoreText.setChainIfMax(this.dragging.length);
      this.sound.play("spot");
    } else {
      this.dragging.forEach((b) => b.selected(false));
    }
    this.ballLines.clear();
  }

  create() {
    this.state = "ready";
    this.scoreText = new ScoreText(this, 60, 60);
    this.timerText = new TimerText(this, WIDTH - 60, 130, INITIAL_TIME);
    this.dialogText = new DialogText(this, "Ready...");

    this.add.rectangle(0, 0, WIDTH, 270, 0x1cb7eb)
      .setOrigin(0).depth = 2;
    const shadow = this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x666666, 0.2)
      .setOrigin(0);
    this.matter.world.setBounds(BORDER, 0, WIDTH - BORDER * 2, HEIGHT - BORDER);

    this.ballLines = new BallLines(this);

    type P = Phaser.Input.Pointer;
    this.input.on("dragstart", (_: P, b: Ball) => this.dragStart(b));
    this.input.on("dragenter", (_: P, _b: Ball, t: Ball) => this.dragEnter(t));
    this.input.on("dragend", () => this.dragEnd());

    this.ballTimer = this.time.addEvent({
      delay: 33,
      callback: () => this.makeBall(),
      loop: true,
    });

    this.timerText.onComplete(() => {
      this.state = "game over";
      this.gameover();
    });

    if (!this.bgm) {
      this.bgm = this.sound.add("honey-lemon", { volume: 0.1, loop: true });
    }
    this.sound.play("countdown-ready");
    this.time.addEvent;
    this.time.addEvent({
      delay: 2100,
      callback: () => {
        if (!this.bgm.isPlaying) this.bgm.play();
        this.timerText.start();
        this.balls.forEach((b) => b.disable(false));
        shadow.destroy();
        this.dialogText.set("Go!", 500);
        this.state = "in game";
      },
    });
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);
    this.ballLines.update();
    if (this.state !== "in game") this.balls.forEach((b) => b.disable());
  }

  gameover() {
    this.ballTimer.remove();
    this.matter.world.setBounds(0, 0, 0, 0, 0, false, false, false, false);
    this.dialogText.set("Time up!");
    this.ballLines.clear();
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.state = "wait for restart";
        this.dialogText.set("Tap to retry!");
        this.sound.play("drop");
        this.input.once("pointerdown", () => {
          this.sound.play("spot");
          this.balls.forEach((b) => b.destroy());
          this.balls.clear();
          this.scene.start("MainGame");
        });
      },
    });
  }
}
