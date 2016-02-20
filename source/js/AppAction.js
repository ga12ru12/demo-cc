'use strict';

var AppDispatcher = require('./AppDispatcher');
var Utils         = require('./Utils');
var Config        = require('./config');
var io            = require('socket.io-client');

var socket = null;
var AppAction = {

  initWebSocket: function(){
    var self = this;
    console.log('Start connect web socket');
    socket = io.connect(Config.dispatch);
    socket.on('connect', self.websocketConnected);
    socket.on('reconnecting', self.websocketDisconnected);
    socket.on('disconnect', self.websocketClosed);
    socket.on('getTokenCC', self.gotTokenCC);
    socket.on('CCLogin', self.login);
    socket.on('nd', self.newDrvLogin);
  },

  websocketConnected: function(){
    console.log('Websocket is connected.');
    AppDispatcher.dispatch({
      type: 'web-socket-connected'
    });
  },

  websocketClosed: function(){
    console.log('Websocket was closed.');
    AppDispatcher.dispatch({
      type: 'web-socket-closed'
    });
  },

  websocketDisconnected: function(){
    console.log('Websocket is disconnected.');
    AppDispatcher.dispatch({
      type: 'web-socket-disconnected'
    });
  },

  getTokenCC: function(params){
    console.log('Getting token CC....');
    socket.emit('getTokenCC', params);
  },

  gotTokenCC: function(data){
    console.log('Got token CC');
    if(data && data.code){
      socket.emit('CCLogin', data.token);
      AppDispatcher.dispatch({
        type: 'got-token-cc',
        token: data.token
      });
    }
  },

  login: function(data){
    console.log('Logining....');
    if(data && data.statusCode === 200){
      AppDispatcher.dispatch({
        type: "set-state",
        state: "map"
      });
    }
  },

  newDrvLogin: function(data){
    console.log('New Drive login: '+data.phone);
    AppDispatcher.dispatch({
      type: "new-driver-login",
      data: data
    });
  }
}

module.exports = AppAction;