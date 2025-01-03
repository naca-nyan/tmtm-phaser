export class TimerText extends Phaser.GameObjects.Text {
  private duration!: number;
  private startTime = 0;
  over = false;
  started = false;
  constructor(scene: Phaser.Scene, x: number, y: number, duration: number) {
    const style = {
      fontSize: 70,
      fontFamily: `"Impact", monospace`,
      color: "white",
    };
    super(scene, x, y, duration.toFixed(1), style);
    this.duration = duration;
    this.scene.add.existing(this);
    this.setOrigin(1, 0);
    this.depth = 3;
  }
  start(time: number) {
    this.startTime = time;
    this.started = true;
  }
  override update(time: number): void {
    if (!this.started) return;
    const elapsed = (time - this.startTime) / 1000;
    const remaining = this.duration - elapsed;
    this.over = !(remaining > 0);
    const countdown = Math.max(remaining, 0).toFixed(1);
    this.setText(countdown);
  }
}
