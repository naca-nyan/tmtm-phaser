export const RADIUS = 48;
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

  override destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}
