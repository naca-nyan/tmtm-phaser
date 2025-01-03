export class ScoreText extends Phaser.GameObjects.Text {
  private score = 0;
  private maxChain = 0;

  private scoreDisplay = 0;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const style = {
      fontSize: 65,
      fontFamily: `"Impact", monospace`,
      color: "white",
    };
    super(scene, x, y, "", style);
    this.scene.add.existing(this);
    this.depth = 3;
  }
  addScore(score: number) {
    this.score += score;
  }

  setChainIfMax(chain: number) {
    this.maxChain = Math.max(this.maxChain, chain);
  }

  override update(): void {
    const delta = this.score - this.scoreDisplay;
    const amount = Math.ceil(delta / 3);
    this.scoreDisplay = Phaser.Math.MaxAdd(
      this.scoreDisplay,
      amount,
      this.score,
    );
    this.setText([
      `Score: ${this.scoreDisplay.toLocaleString()}`,
      `Chain: ${this.maxChain}`,
    ]);
  }
}
