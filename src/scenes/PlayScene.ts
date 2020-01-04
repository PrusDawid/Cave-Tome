import { CST } from "./../CST";
import { PlayerSprite } from "../PlayerSprite";
export class PlayScene extends Phaser.Scene {
  player!: PlayerSprite;
  bats!: Phaser.Physics.Arcade.Group;
  backLayer!: Phaser.GameObjects.TileSprite;
  mainLayer!: Phaser.Tilemaps.StaticTilemapLayer;
  lastSide!: string;
  liveBar!: Phaser.GameObjects.Text;
  pointBar!: Phaser.GameObjects.Text;
  constructor() {
    super({ key: CST.SCENES.PLAY });
  }

  endgame(win: boolean) {
    let status = win || false;
    let text = status ? "YOU WON! CONGRATULATIONS" : "YOU DIED! TRY AGAIN";
    status
      ? this.sound.add(CST.AUDIO.WIN)
      : this.sound.add(CST.AUDIO.GAME_OVER);

    let endtext = this.make.text({
      x: 250,
      y: 220,
      text: text,
      style: {
        font: "24px monospace",
        fill: "#ffffff"
      }
    });
    endtext.setScrollFactor(this.cameras.main.x, this.cameras.main.y);

    this.time.delayedCall(1000, () => {
      this.sound.removeByKey(CST.AUDIO.BAT_SOUND);
      this.sound.removeByKey(CST.AUDIO.MOTIVE);
      this.scene.start(CST.SCENES.MENU);
    });
  }
  bat_create() {
    let cont: boolean = true;
    let x = 0;
    let y = 0;
    while (cont) {
      switch (Phaser.Math.Between(0, 1)) {
        case 0:
          x = Phaser.Math.Between(0, this.game.renderer.width);
          break;
        case 1:
          y = Phaser.Math.Between(0, this.game.renderer.height);
          break;
      }
      console.log(x, y);
      //@ts-ignore
      if (typeof this.mainLayer.getTileAt(x, y) != "null") {
        cont = false;
      }
    }

    this.bats.add(this.physics.add.sprite(x, y, "bat").play("bat_idle"));
  }

  preload() {
    //Bat Animations
    this.anims.create({
      key: "bat_left",
      repeat: -1,
      frameRate: 10,
      frames: this.anims.generateFrameNumbers("bat", {
        frames: [12, 13, 14, 15]
      })
    });
    this.anims.create({
      key: "bat_right",
      repeat: -1,
      frameRate: 10,
      frames: this.anims.generateFrameNumbers("bat", {
        frames: [4, 5, 6, 7]
      })
    });
    this.anims.create({
      key: "bat_idle",
      repeat: -1,
      frameRate: 8,
      frames: this.anims.generateFrameNumbers("bat", {
        frames: [0, 1, 2, 3]
      })
    });

    // Player Animations
    this.anims.create({
      key: "walk_right",
      repeat: -1,
      frames: this.anims.generateFrameNames("playersheet", {
        start: 0,
        end: 29,
        zeroPad: 3,
        prefix: "right/Walk/0_Warrior_Walk_",
        suffix: ".png"
      })
    });
    this.anims.create({
      key: "walk_left",
      frames: this.anims.generateFrameNames("playersheet", {
        start: 0,
        end: 29,
        zeroPad: 3,
        prefix: "left/Walk/0_Warrior_Walk_",
        suffix: ".png"
      })
    });
    this.anims.create({
      key: "right_attack",
      frames: this.anims.generateFrameNames("playersheet", {
        start: 0,
        end: 14,
        zeroPad: 3,
        prefix: "right/Attack_1/0_Warrior_Attack_1_",
        suffix: ".png"
      })
    });
    this.anims.create({
      key: "left_attack",
      frames: this.anims.generateFrameNames("playersheet", {
        start: 0,
        end: 14,
        zeroPad: 3,
        prefix: "left/Attack_1/0_Warrior_Attack_1_",
        suffix: ".png"
      })
    });
    this.anims.create({
      key: "left_idle_blink",
      frames: this.anims.generateFrameNames("playersheet", {
        start: 0,
        end: 29,
        zeroPad: 3,
        prefix: "left/Idle Blinking/0_Warrior_Idle Blinking_",
        suffix: ".png"
      })
    });
    this.anims.create({
      key: "right_idle_blink",
      frames: this.anims.generateFrameNames("playersheet", {
        start: 0,
        end: 29,
        zeroPad: 3,
        prefix: "right/Idle Blinking/0_Warrior_Idle Blinking_",
        suffix: ".png"
      })
    });
  }
  create() {
    // Sound
    this.sound.play(CST.AUDIO.BAT_SOUND, { loop: true });

    // Player
    this.player = new PlayerSprite(
      this,
      50,
      200,
      "playersheet",
      "right/Idle/0_Warrior_Idle_001.png"
    );

    // Map
    let mappy = this.add.tilemap("mappy");

    let terrain = mappy.addTilesetImage("twilight-tiles", CST.IMAGE.TILES);
    console.log(this.cache.tilemap.get("mappy").data);

    //layers

    this.cameras.main.setBackgroundColor("#292929");

    this.backLayer = this.add
      .tileSprite(
        0,
        50,
        1120,
        this.game.renderer.height / 2,
        CST.IMAGE.PARALAX1
      )
      .setDepth(-1)
      .setScale(2)
      .setOrigin(0);

    this.mainLayer = mappy.createStaticLayer("top", [terrain], 0, 0);
    this.mainLayer.setScale(2);

    // Bats
    this.bats = this.physics.add.group({
      allowGravity: false
    });
    this.time.addEvent({
      delay: 3000,
      callback: this.bat_create,
      callbackScope: this,
      loop: true
    });

    // Physics

    this.physics.add.collider(this.mainLayer, this.player);
    this.physics.add.collider(this.mainLayer, this.bats);
    this.mainLayer.setCollisionByProperty({ collide: true });

    // Camera
    this.cameras.main.startFollow(this.player);

    // Bars
    this.liveBar = this.add.text(50, 100, "HP : 5", {
      font: "24px monospace",
      fill: "#ffffff",
    });
    this.liveBar.setScrollFactor(this.cameras.main.x);

    this.pointBar = this.add.text(50, 500, "POINTS : 0", {
        font: "24px monospace",
        fill: "#ffffff"
    });
    this.pointBar.setScrollFactor(this.cameras.main.x);
  }
  update(time: number, delta: number) {
    //delta 16.666 @ 60fps

    // Physics

    //@ts-ignore
    this.mainLayer.setTileIndexCallback([227], (e) => {
      this.mainLayer.setTileIndexCallback([227], null, this.player);
      if(e.texture.key != 'bat') {
        this.endgame(false);
      }

    }),
      this.player;
    this.mainLayer.setTileLocationCallback(67, 14, 3, 1, (e) => {
      this.mainLayer.setTileLocationCallback(67, 14, 3, 1, null, this.player);
      if(e.texture.key != 'bat') {
        this.endgame(true);
      }
    }),
      this.player;

    this.physics.world.addCollider(
      this.player,
      this.bats,
      (player: PlayerSprite, bat: Phaser.Physics.Arcade.Sprite) => {
        bat.destroy();
        this.bat_create();
        switch (cursors.space.isDown) {
          case true:
            player.addPoints(10);
            this.pointBar.setText("POINTS : " + player.checkPoints());
            break;

          default:
            player.lostHP(1);
            this.liveBar.setText("HP : " + player.checkHP());
            if (!player.checkAlive()) {
              console.log("died");
              this.endgame(false);
            }
            break;
        }
      }
    );

    // Bats Move

    for (let i = 0; i < this.bats.getChildren().length; i++) {
      this.physics.accelerateToObject(this.bats.getChildren()[i], this.player);
      this.bats.getChildren()[i].setActive(true);

      // Bats Animation Cotrol
      //@ts-ignore
      if (this.bats.getChildren()[i].body.velocity.x < 0) {
        //@ts-ignore
        this.bats.getChildren()[i].play("bat_left", true);
      }
      //@ts-ignore
      if (this.bats.getChildren()[i].body.velocity.x > 0) {
        //@ts-ignore
        this.bats.getChildren()[i].play("bat_right", true);
      }
      //@ts-ignore
      if (this.bats.getChildren()[i].body.velocity.x == 0) {
        //@ts-ignore
        this.bats.getChildren()[i].play("bat_idle", true);
      }
    }

    // Control Player
    let cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.player.setVelocityX(-128);
      this.player.anims.play("walk_left", true);
      this.lastSide = "left";
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(128);
      this.player.anims.play("walk_right", true);
      this.lastSide = "right";
      //@ts-ignore
    } else if (cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-220);
      this.sound.play("jump.wav")
    } else if (cursors.space.isDown) {
      if (this.lastSide == "right") {
        this.player.anims.play("right_attack", true);
      } else if (this.lastSide == "left") {
        this.player.anims.play("left_attack", true);
      }
    } else {
      if (this.lastSide == "right") {
        this.player.setVelocityX(0);
        this.player.anims.play("right_idle_blink", true);
      } else if (this.lastSide == "left") {
        this.player.setVelocityX(0);
        this.player.anims.play("left_idle_blink", true);
      }
    }

    // Sound Control
    this.player.once("animationstart", () => {
      if (
        this.player.anims.currentAnim.key == "left_attack" ||
        this.player.anims.currentAnim.key == "right_attack"
      ) {
        this.sound.play(CST.AUDIO.SWORD_SWING);
      }
      // if (this.player.anims.currentAnim.key == 'walk_left' || this.player.anims.currentAnim.key == 'walk_right' ) {
      //     this.sound.play(CST.AUDIO.PLAYER_STEP)
      // }
    });

    // Camera
    this.backLayer.tilePositionX = this.cameras.main.scrollX * 0.02;
  }
}
