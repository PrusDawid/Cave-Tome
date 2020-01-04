export class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
    private hp: number
    private points: number

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.setScale(0.3);
        scene.physics.world.enableBody(this);
        this.setImmovable(true);
        this.setSize(180, 250);
        this.setOffset(140,100)
        this.hp = 5;
        this.points = 0
    }
    addHP(i: integer) {
        this.hp += i;
    }
    lostHP(i: integer) {
        this.hp -= i;
    }
    checkHP() {
        return this.hp
    }
    addPoints(i: integer) {
        this.points += i;
    }
    lostPoints(i: integer) {
        this.points -= i;
    }
    checkPoints() {
        return this.points
    }
    checkAlive() {
        if(this.hp <= 0) {
            return false
        }
        return true
    }
    

}