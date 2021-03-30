import Phaser from 'phaser';

export class InputPanel extends Phaser.Scene {

    constructor() {
        super({ key: 'InputPanel', active: false });
        this.chars = [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
            ['U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>']
        ];
        this.cursor = new Phaser.Math.Vector2();
        this.text;
        this.block;
        this.name = '';
        this.charLimit = 3;
    }

    create() {
        let text = this.add.bitmapText(130, 50, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-');
        text.setLetterSpacing(20);
        text.setInteractive();
        this.add.image(text.x + 430, text.y + 148, 'rub');
        this.add.image(text.x + 482, text.y + 148, 'end');
        this.block = this.add.image(text.x - 10, text.y - 2, 'block').setOrigin(0);
        this.text = text;
        this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
        this.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
        this.input.keyboard.on('keyup_UP', this.moveUp, this);
        this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
        this.input.keyboard.on('keyup_ENTER', this.pressKey, this);
        this.input.keyboard.on('keyup_SPACE', this.pressKey, this);
        this.input.keyboard.on('keyup', this.anyKey, this);
        text.on('pointermove', this.moveBlock, this);
        text.on('pointerup', this.pressKey, this);
        this.tweens.add({
            targets: this.block,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 350
        });
    }

    moveBlock(pointer, x, y) {
        let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
        let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
        let char = this.chars[cy][cx];
        this.cursor.set(cx, cy);
        this.block.x = this.text.x - 10 + (cx * 52);
        this.block.y = this.text.y - 2 + (cy * 64);
    }

    moveLeft() {
        if (this.cursor.x > 0) {
            this.cursor.x--;
            this.block.x -= 52;
        }
        else {
            this.cursor.x = 9;
            this.block.x += 52 * 9;
        }
    }

    moveRight() {
        if (this.cursor.x < 9) {
            this.cursor.x++;
            this.block.x += 52;
        }
        else {
            this.cursor.x = 0;
            this.block.x -= 52 * 9;
        }
    }

    moveUp() {
        if (this.cursor.y > 0) {
            this.cursor.y--;
            this.block.y -= 64;
        }
        else {
            this.cursor.y = 2;
            this.block.y += 64 * 2;
        }
    }

    moveDown() {
        if (this.cursor.y < 2) {
            this.cursor.y++;
            this.block.y += 64;
        }
        else {
            this.cursor.y = 0;
            this.block.y -= 64 * 2;
        }
    }

    anyKey(event) {
        let code = event.keyCode; //  Only allow A-Z . and -
        if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
            this.cursor.set(6, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
            this.cursor.set(7, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE) {
            this.cursor.set(8, 2);
            this.pressKey();
        }
        else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z) {
            code -= 65;
            let y = Math.floor(code / 10);
            let x = code - (y * 10);
            this.cursor.set(x, y);
            this.pressKey();
        }
        if (this.name.length === 3 && !(this.cursor.x === 8 && this.cursor.y === 2)) { // if all 3 characters input, limit to RUB or END
            this.cursor.set(9, 2);
            this.block.x = this.text.x - 10 + (9 * 52);
            this.block.y = this.text.y - 2 + (2 * 64);
        }
    }

    pressKey() {
        let x = this.cursor.x;
        let y = this.cursor.y;
        this.block.x = this.text.x - 10 + (x * 52);
        this.block.y = this.text.y - 2 + (y * 64);
        let nameLength = this.name.length;
        if (x === 9 && y === 2 && nameLength > 0) {
            this.events.emit('submitName', this.name); //  Submit
        }
        else if (x === 8 && y === 2 && nameLength > 0) {
            this.name = this.name.substr(0, nameLength - 1); //  Rub
            this.events.emit('updateName', this.name);
        }
        else if (this.name.length < this.charLimit) {
            this.name = this.name.concat(this.chars[y][x]); //  Add
            this.events.emit('updateName', this.name);
        }
    }
}