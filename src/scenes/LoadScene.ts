import { CST } from "../CST";

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: CST.SCENES.LOAD });
  }

  loadImages() {
    this.load.setPath("./assets/image");

    for (let prop in CST.IMAGE) {
      this.load.image(CST.IMAGE[prop], CST.IMAGE[prop]);
    }
  }
  loadAudio() {
    this.load.setPath("./assets/audio");

    for (let prop in CST.AUDIO) {
      this.load.audio(CST.AUDIO[prop], CST.AUDIO[prop]);
    }
  }

  preload() {

    // Load all assets
    this.load.tilemapTiledJSON('mappy', './assets/maps/lvl1.json')
    this.load.spritesheet('bat', "./assets/sprite/32x32bat.png", {frameWidth: 32, frameHeight: 32})
    this.load.multiatlas(
      "playersheet",
      "./assets/sprite/player/player.json",
      "./assets/sprite/player"
    );
    //this.load.atlas("ninja", './assets/sprite/ninjagirl.png', './assets/sprite/ninjagirl_atlas.json')

    this.loadImages();
    this.loadAudio();


    // Make Loading Bar

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff"
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", value => {
      percentText.setText(value * 100 + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
      console.log(value);
    });

    this.load.on("fileprogress", file => {
      assetText.setText("Loading asset: " + file.key);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }

  init() {}
  create() {
    this.scene.start(CST.SCENES.MENU);
  }
}
