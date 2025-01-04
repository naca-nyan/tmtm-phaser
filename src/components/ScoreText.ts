const style = {
  fontSize: 65,
  fontFamily: `"Impact", sans-serif`,
  color: "white",
};

export class ScoreText extends Phaser.GameObjects.Text {
  private score = 0;
  private maxChain = 0;
  private tween!: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "", style);
    this.scene.add.existing(this);
    this.depth = 3;
    this.tween = this.newTween();
  }

  private newTween(from = 0, to = 0) {
    return this.scene.tweens.addCounter({
      from: from,
      to: to,
      duration: 500,
      onUpdate: (tween) => this.updateScore(tween.getValue(), this.maxChain),
    });
  }

  private updateScore(score: number, chain: number): void {
    const scoreDisplay = Math.floor(score);
    const chainDisplay = Math.floor(chain);
    this.setText([
      `Score: ${scoreDisplay.toLocaleString()}`,
      `Chain: ${chainDisplay}`,
    ]);
  }

  addScore(score: number) {
    let from = this.score;
    this.score += score;
    if (this.tween.isPlaying()) {
      from = this.tween.getValue();
      this.tween.destroy();
    }
    this.tween = this.newTween(from, this.score);
  }

  setChainIfMax(chain: number) {
    this.maxChain = Math.max(this.maxChain, chain);
    if (!this.tween.isPlaying()) {
      this.updateScore(this.score, this.maxChain);
    }
  }
}
