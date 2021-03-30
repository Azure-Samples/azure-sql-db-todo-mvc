import Phaser from 'phaser';
const path = require('path');

import { InputPanel } from './inputPanelScene'
import { Starfield } from './starfieldScene'
import { Highscore } from './highscoreScene'
const WebSocket = require('isomorphic-ws');
const uuidv1 = require('uuid/v1');

// ----------------------------------------------------------------------------
// THE GAME
// ----------------------------------------------------------------------------
var defaultScenes = [Starfield, Highscore];
if (process.env.DEBUG_INPUT === 'true') {
  console.warn('ENV: debug input = ' + process.env.DEBUG_INPUT);
  defaultScenes = [Starfield, Highscore, InputPanel];
}

let config = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  backgroundColor: '#290d0d',
  scene: defaultScenes
};
let game = new Phaser.Game(config);
game.events.off('hidden', game.onHidden, game, false); // not sure this is needed but trying to make sure game doesn't stop
game.events.off('visible', game.onVisible, game, false); 

// provide websockets to scenes that care

var apiServerWebsocket = 'ws://localhost:5000';  // default
if (process.env.API_SERVER_WEBSOCKET_URL != null) {
  console.warn('ENV: overriding the API websocket server to be: '+ process.env.API_SERVER_WEBSOCKET_URL);
  apiServerWebsocket = process.env.API_SERVER_WEBSOCKET_URL;
}
const clientId = uuidv1();
let webSocketURL = apiServerWebsocket + '/notifications/' + clientId;
if (!webSocketURL.startsWith('ws')) {  // add ws if not already set
  webSocketURL = 'ws://' + webSocketURL;
}

global.ws = new WebSocket(webSocketURL);
global.ws.onopen = function open() {console.log('connected to ' + webSocketURL);};
global.ws.onclose = function close() {console.log('disconnected from ' + webSocketURL);};
global.ws.onmessage = function incoming(event) {
  // console.log('DEBUG, got ws message: ' + event.data); //https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
};