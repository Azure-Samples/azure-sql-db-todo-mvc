import Phaser from 'phaser';

import ImgRub from './assets/rub.png';
import ImgEnd from './assets/end.png';
import ImgBlock from './assets/block.png';
import FontArcade from './assets/fonts/bitmap/arcade.png';
import FontArcadeXml from './assets/fonts/bitmap/arcade.xml';
const axios = require('axios');

export class Highscore extends Phaser.Scene {

    constructor() {
        super({ key: 'Highscore', active: true });
        this.playerText;
        this.headerText;
        this.rowsText = [];
        this.textRanks = [
            '1ST   ', '2ND   ', '3RD   ', '4TH   ', '5TH   ',
            '6TH   ', '7TH   ', '8TH   ', '9TH   ', '10TH  '
        ];
        this.textColors = [
            0xffffff, 0xff8200, 0xffff00, 0x00ff00, 0x00bfff,
            0xffffff, 0xff8200, 0xffff00, 0x00ff00, 0x00bfff
        ];
    }

    preload() {
        this.load.image('block', ImgBlock);
        this.load.image('rub', ImgRub);
        this.load.image('end', ImgEnd);
        this.load.bitmapFont('arcade', FontArcade, FontArcadeXml);
        global.ws.addEventListener('message', this.onmessage.bind(this));
    }

    create() {
        let loadingScreen = document.getElementById('loading-screen')
        if (loadingScreen) { // remove the loading screen
            loadingScreen.classList.add('transparent')
            this.time.addEvent({delay: 1000,callback: () => { loadingScreen.remove()}})
        }
        this.headerText = this.add.bitmapText(0, 260, 'arcade', 'RANK  SCORE   NAME').setTint(0xff00ff);
        this.headerText.setX(window.innerWidth / 2 - this.headerText.width / 2);

        if (this.scene.get('InputPanel') != null) { // only if DEBUG INPUT MODE is configured
            let tempFirst = this.add.bitmapText(0, 310, 'arcade', '1ST   99999').setTint(0xffffff);
            tempFirst.setX(window.innerWidth / 2 - this.headerText.width / 2);
            this.playerText = this.add.bitmapText(0, 310, 'arcade', '').setTint(0xffffff);
            this.playerText.setX(window.innerWidth / 2 - this.headerText.width / 2 + 14 * 32); // 14 spaces over times the character width of 32
            this.input.keyboard.enabled = false; //  Do this, otherwise this Scene will steal all keyboard input
            this.scene.launch('InputPanel');
            let panel = this.scene.get('InputPanel');
            panel.events.on('updateName', this.updateName, this); //  Listen to events from the Input Panel scene
            panel.events.on('submitName', this.submitName, this); //  Listen to events from the Input Panel scene
        } else {
            let tempFirst = this.add.bitmapText(0, 310, 'arcade', 'NO    SCORES   YET').setTint(0xffffff);
            tempFirst.setX(window.innerWidth / 2 - this.headerText.width / 2);
            this.rowsText.push(tempFirst);
            // FYI: we let the API server's websocket tell us when new scores are in - as a backup we could add a timer to call REST getLatestScores()
            this.getLatestScores();
        }
    }

    getLatestScores() {
        // call the REST API service and display them
        var apiServer = 'http://localhost:5000';  // default
        if (process.env.API_SERVER_URL != null) {
            console.warn('overriding the API server to be: '+ process.env.API_SERVER_URL);
            apiServer = process.env.API_SERVER_URL;
        }
        if (!apiServer.startsWith('http')) {  // add http if not already set
            apiServer = 'http://' + apiServer;
        }
        var self=this;
        axios.get(apiServer + '/scores/topten/')
        .then(function (response) {
            self.displayLatestScores(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    displayLatestScores(mylistJSON) { // expects a JSON Object
        const count = this.rowsText.length;
        for (let i = 0; i < count; i++) {
            var row = this.rowsText.pop();
            row.destroy();
        }
        var j = 0;
        // console.log('obj='+JSON.stringify(mylistJSON));
        for (var j = 0; j < mylistJSON.length; j++) {
            var dataj = mylistJSON[j];
            const fullString = this.textRanks[j] + dataj.score.toString().padEnd(8) + dataj.name;
            var bitmapTextRow = this.add.bitmapText(0, 310+50*j, 'arcade', fullString).setTint(this.textColors[j]);
            bitmapTextRow.setX(window.innerWidth / 2 - this.headerText.width / 2);
            this.rowsText.push(bitmapTextRow)
        }
    }

    updateName(name) {
        this.playerText.setText(name);
    }

    submitName() {
        if (this.scene.get('InputPanel') != null) {
            this.scene.stop('InputPanel');
            // TODO: we should still send a GET request for high scores paged to where your score is (even in DEBUG INPUT MODE)
            let secondText = this.add.bitmapText(0, 360, 'arcade', '2ND   40000   ANT').setTint(0xff8200);
            secondText.setX(window.innerWidth / 2 - this.headerText.width / 2);
            let thirdText = this.add.bitmapText(0, 410, 'arcade', '3RD   30000   .-.').setTint(0xffff00);
            thirdText.setX(window.innerWidth / 2 - this.headerText.width / 2);
            let fourthText = this.add.bitmapText(0, 460, 'arcade', '4TH   20000   BOB').setTint(0x00ff00);
            fourthText.setX(window.innerWidth / 2 - this.headerText.width / 2);
            let fifthText = this.add.bitmapText(0, 510, 'arcade', '5TH   10000   ZIK').setTint(0x00bfff);
            fifthText.setX(window.innerWidth / 2 - this.headerText.width / 2);
        } else {
            // nothing, never need to submit without the input panel
        }
    }

    onmessage(event) {
        // console.log('DEBUG, got the message:'+ event.data);
        if (event.data.startsWith('topten:')) {
            // console.log('DEBUG, got top ten');
            const mylist = event.data.replace('topten:','');
            var jsonObj = JSON.parse(mylist);
            this.displayLatestScores(jsonObj);
        }
        else if (event.data.startsWith('newscore:')) {
            // console.log('DEBUG, got new score');   
        }
        else {
            // ignore
        }
    }
}