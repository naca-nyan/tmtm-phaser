export const RADIUS = 56;
const IMAGE_RADIUS = 48;
const SCALE = RADIUS / IMAGE_RADIUS;
export const KINDS = [
  "twitter",
  "insta",
  "youtube",
  "discord",
  "facebook",
] as const;
export type Kind = typeof KINDS[number];

export class Ball extends Phaser.Physics.Matter.Image {
  readonly kind!: Kind;
  private tween?: Phaser.Tweens.Tween;
  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    kind: Kind,
  ) {
    const frame = undefined;
    const options = {};
    super(world, x, y, kind, frame, options);
    this.scene.add.existing(this);
    this.scale = RADIUS / IMAGE_RADIUS;
    this.kind = kind;
    this.setCircle(RADIUS);
    this.setInteractive({ draggable: true, dropZone: true });
  }

  distance(b: Ball) {
    return Phaser.Math.Distance.Between(this.x, this.y, b.x, b.y);
  }

  selected(selected = true) {
    const tweenConfig = {
      targets: this,
      duration: 200,
      scale: SCALE * 1.12,
      ease: Phaser.Math.Easing.Elastic.Out,
    };
    if (this.tween) this.tween.destroy();

    if (selected) {
      this.setTint(0x222222);
      this.tween = this.scene.tweens.add(tweenConfig);
    } else {
      this.clearTint();
      this.tween = this.scene.tweens.add({ ...tweenConfig, scale: SCALE });
    }
  }

  disable(disable = true) {
    if (disable) {
      this.disableInteractive();
      this.setTint(0x666666);
    } else {
      this.setInteractive();
      this.clearTint();
    }
  }

  override destroy(fromScene?: boolean): void {
    this.tween?.destroy();
    this.scene.add.particles(this.x, this.y, this.kind, {
      quantity: 5,
      lifespan: 500,
      speed: { random: [0, 100] },
      scale: { start: 1, end: 0, ease: Phaser.Math.Easing.Expo.Out },
      blendMode: Phaser.BlendModes.ADD,
    }).explode();
    super.destroy(fromScene);
  }
}
