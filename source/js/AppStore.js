'use strict';

var assign        = require('object-assign');
var EventEmitter  = require('events').EventEmitter;
var Immutable     = require('immutable');
var AppDispatcher = require('./AppDispatcher');
var Utils         = require('./Utils');
var listEvent     = Utils.events;
var Config        = require('./config');
var Immutable     = require('immutable');

/*-------------Immutable -------------*/
var Setting = Immutable.Record({
  fleetId: '1111',
  token: '',
  state: 'login'
});

var ListDrv = Immutable.List();
var DrvInfo = Immutable.Record({
  phone: '',
  fleetId: '',
  status: ''
});


var setting = new Setting();
var listDrv = new ListDrv();
var listDrvIndex = {};

var AppStore = assign({}, EventEmitter.prototype, {

  emitChange: function(CHANGE_EVENT){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(CHANGE_EVENT, callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(CHANGE_EVENT, callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getSetting: function(){
    return setting.toJS();
  },

  dispatcherCallback: function(payload){
    switch(payload.type) {
      case 'web-socket-connected':
        this.emitChange(listEvent.CHANGE_STATE_EVENT);
        break;

      case 'web-socket-disconnected':
        this.emitChange(listEvent.CHANGE_STATE_EVENT);
        break;

      case 'web-socket-closed':
        this.emitChange(listEvent.CHANGE_STATE_EVENT);
        break;

      case "got-token-cc":
        setting = setting.set('token', payload.token);
        break;

      case "set-state":
        setting = setting.set('state', payload.state);
        this.emitChange(listEvent.CHANGE_STATE_EVENT);
        break;

      case "new-driver-login":
        getDataDriver(payload.data);
        this.emitChange(listEvent.CHANGE_DRV_EVENT);
        break;
    }
  }
});

function getDataDriver(data){
  if(data && data.phone){
    var drvInfo = new DrvInfo(data);
    listDrv.push(drvInfo);
    listDrvIndex[data.phone] = listDrv.count() -1;
  }

  console.log(listDrv.toJS());
}

AppStore.dispatchToken = AppDispatcher.register(AppStore.dispatcherCallback.bind(AppStore));

module.exports = AppStore;