export const RADIUS = 56;
const IMAGE_RADIUS = 48;
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
    if (selected) {
      this.setTint(0x222222);
    } else {
      this.clearTint();
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
