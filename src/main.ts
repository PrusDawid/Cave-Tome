/** @type {import ("../typings/phaser")} */

import { LoadScene } from "./scenes/LoadScene"
import { MenuScene } from "./scenes/MenuScene"
import { PlayScene } from "./scenes/PlayScene"
let game = new Phaser.Game({
    width: 800,
    height: 600,
    scene: [
        LoadScene, MenuScene, PlayScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
           gravity : {y : 200},
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT

    }
})