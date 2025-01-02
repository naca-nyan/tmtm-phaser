import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }
  preload() {
    this.load.setBaseURL("https://labs.phaser.io");

    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("logo", "assets/sprites/phaser3-logo.png");
    this.load.image("red", "assets/particles/red.png");
  }

  create() {
    this.add.image(400, 300, "sky");

    const particles = this.add.particles(0, 0, "red", {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    const logo = this.matter.add.image(400, 100, "logo");

    logo.setVelocity(1, 1);
    logo.setBounce(0.99999);
    this.matter.world.setBounds(0, 0, 900, 1600);

    particles.startFollow(logo);
    this.input.once("pointerdown", () => {
      this.scene.start("MainGame");
    });
  }
}
