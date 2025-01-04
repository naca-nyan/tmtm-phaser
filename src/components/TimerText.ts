const style = {
  fontSize: 70,
  fontFamily: `"Impact", sans-serif`,
  color: "white",
};

export class TimerText extends Phaser.GameObjects.Text {
  private tween!: Phaser.Tweens.Tween;
  constructor(scene: Phaser.Scene, x: number, y: number, duration: number) {
    super(scene, x, y, duration.toFixed(1), style);
    this.scene.add.existing(this);
    this.setOrigin(1, 0);
    this.depth = 3;
    this.tween = this.scene.tweens.addCounter({
      from: duration,
      to: 0,
      duration: duration * 1000,
      paused: true,
      onUpdate: (tween) => this.setText(tween.getValue().toFixed(1)),
    });
  }

  onComplete(f: () => void) {
    this.tween.on("complete", f);
  }

  start() {
    this.tween.play();
  }
}
