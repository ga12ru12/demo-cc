'use strict';

var assign        = require('object-assign');
var EventEmitter  = require('events').EventEmitter;
var Immutable     = require('immutable');
var AppDispatcher = require('./AppDispatcher');
var Utils         = require('./Utils');
var Config        = require('./config');
var Immutable     = require('immutable');

var CHANGE_EVENT  = 'change';

var Setting = Immutable.Record({
  fleetId: '1111',
  token: '',
  state: 'login'
});

var setting = new Setting();

var AppStore = assign({}, EventEmitter.prototype, {

  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getSetting: function(){
    return setting.toJS();
  },

  dispatcherCallback: function(payload){
    switch(payload.type) {
      case 'web-socket-connected':
        this.emitChange();
        break;

      case 'web-socket-disconnected':
        this.emitChange();
        break;

      case 'web-socket-closed':
        this.emitChange();
        break;

      case "got-token-cc":
        setting = setting.set('token', payload.token);
        break;

      case "set-state":
        setting = setting.set('state', payload.state);
        this.emitChange();
        break;

      case "new-driver-login":

        break;
    }
  }
});

AppStore.dispatchToken = AppDispatcher.register(AppStore.dispatcherCallback.bind(AppStore));

module.exports = AppStore;