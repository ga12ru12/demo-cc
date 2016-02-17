'use strict';

var AppDispatcher = require('./AppDispatcher');
var Utils         = require('./Utils');
var Config        = require('./config');
var io            = require('socket.io-client');

var AppAction = {
  initWebSocket: function(){
    console.log('Start connect web socket');

  }
}

module.exports = AppAction;