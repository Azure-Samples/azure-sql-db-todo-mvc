import Phaser from 'phaser';
import ImgStar from './assets/redcube.png'

export class Starfield extends Phaser.Scene {

    constructor() {
        super({ key: 'Starfield', active: true });
        this.stars;
        this.distance = 300;
        this.speed = 200;
        this.max = 500;  // use 500 for star-small, and 100 for larger images
        this.xx = [];
        this.yy = [];
        this.zz = [];
    }

    preload() {
        this.load.image('star', ImgStar);
    }

    create() {
        //  Do this, otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = false;
        this.stars = this.add.blitter(0, 0, 'star');

        for (let i = 0; i < this.max; i++) {
            this.xx[i] = Math.floor(Math.random() * window.innerWidth) - window.innerWidth / 2;
            this.yy[i] = Math.floor(Math.random() * window.innerHeight) - window.innerHeight / 2;
            this.zz[i] = Math.floor(Math.random() * 1700) - 100;
            let perspective = this.distance / (this.distance - this.zz[i]);
            let x = window.innerWidth / 2 + this.xx[i] * perspective;
            let y = window.innerHeight / 2 + this.yy[i] * perspective;
            this.stars.create(x, y);
        }
    }

    update(time, delta) {
        for (let i = 0; i < this.max; i++) {
            let perspective = this.distance / (this.distance - this.zz[i]);
            let x = window.innerWidth / 2 + this.xx[i] * perspective;
            let y = window.innerHeight / 2 + this.yy[i] * perspective;
            this.zz[i] += this.speed * (delta / 1000);
            if (this.zz[i] > 300) { this.zz[i] -= 600; }
            let bob = this.stars.children.list[i];
            bob.x = x;
            bob.y = y;
        }
    }

}