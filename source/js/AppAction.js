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
    socket.on('getListDrvOnl', self.initListDrv);
    socket.on('nd', self.newDrvLogin);
    socket.on('d', self.updateDrv);
    socket.on('f1', self.updateLocationDrv);
    socket.on('offline', self.drvLogout)
  },

  websocketConnected: function(){
    console.log('Websocket is connected.');
    if(localStorage.getItem("token"))
      socket.emit('CCLogin', localStorage.getItem("token"));
    AppDispatcher.dispatch({
      type: 'web-socket-connected'
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
      localStorage.setItem("token", data.token);
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

  setMapToSetting : function(map){
    AppDispatcher.dispatch({
      type: "set-map",
      map: map
    });
  },

  loadDrvToMap: function(){
    socket.emit('getListDrvOnl');
  },

  initListDrv: function(data){
    console.log('Init list Driver: ');
    if(data.code){
      AppDispatcher.dispatch({
        type: "init-list-drv",
        data: data.listDrv
      });
    }
  },

  newDrvLogin: function(data){
    console.log('New Drive login: '+data.phone);
    AppDispatcher.dispatch({
      type: "new-driver-login",
      data: data
    });
  },

  updateDrv: function(data){
    console.log('Update Drv Info: '+data.param.phone);
    AppDispatcher.dispatch({
      type: "new-driver-login",
      data: data.param
    });
  },

  updateLocationDrv: function(data){
    console.log('Update location drv');
    console.log(data);
    AppDispatcher.dispatch({
      type: 'update-location-drv',
      data: data
    });
  },

  drvLogout: function(phone){
    console.log('Drv logout: '+phone);
    AppDispatcher.dispatch({
      type: 'drv-logout',
      phone: phone
    });
  }
}

module.exports = AppAction;