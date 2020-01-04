import { CST } from "../CST";
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: CST.SCENES.MENU });
  }
  init() {}
  create() {
    //Images

    this.add
      .image(0, 0, CST.IMAGE.MENU_BG)
      .setOrigin(0, 0)
      .setDepth(0);
    this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height * 0.2,
        CST.IMAGE.TITLE
      )
      .setDepth(1);
    let PlayButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2,
        CST.IMAGE.PLAY
      )
      .setDepth(1);
    let SettingsButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 100,
        CST.IMAGE.OPTIONS
      )
      .setDepth(1);

    let MadeByText = this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 250,
        "Created By: Dawid Prus",
        { fontSize: "26px", fill: "#fff" }
      )
      .setDepth(1);

    //Audio

    this.sound.pauseOnBlur = true;
    this.sound.play(CST.AUDIO.MOTIVE, {
      loop: true,
      volume: 0.5
    });

    //Interactive
    PlayButton.setInteractive();
    PlayButton.on("pointerover", e => {
      this.sound.play(CST.AUDIO.MENU_CLICK);
    });
    PlayButton.on("pointerup", e => {
      this.scene.start(CST.SCENES.PLAY);
    });
    SettingsButton.setInteractive();
    SettingsButton.on("pointerover", e => {
      this.sound.play(CST.AUDIO.MENU_CLICK);
    });
  }
}
