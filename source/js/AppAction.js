'use strict';

var AppDispatcher = require('./AppDispatcher');
var Utils         = require('./Utils');
var Config        = require('./config');
var io            = require('socket.io-client');

var AppAction = {
  socket: null,

  initWebSocket: function(){
    var self = this;
    console.log('Start connect web socket');
    self.socket = io.connect(Config.dispatch);
    self.socket.on('connect', self.websocketConnected);
    self.socket.on('reconnecting', self.websocketDisconnected);
    self.socket.on('disconnect', self.websocketClosed);
    self.socket.on('getTokenCC', self.gotTokenCC);
    self.socket.on('CCLogin', self.login);
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
    this.socket.emit('getTokenCC', params);
  },

  gotTokenCC: function(data){
    console.log('Got token CC');
    if(data && data.code){
      this.socket.emit('CCLogin', data.token);
      AppDispatcher.dispatch({
        type: 'got-token-cc',
        token: data.token
      });
    }
  },

  login: function(data){
    console.log('Logining....');
    if(data && data.statusCode){
      AppDispatcher.dispatch({
        type: "set-state",
        state: "map"
      });
    }
  }
}

module.exports = AppAction;