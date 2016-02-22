'use strict';

var assign        = require('object-assign');
var EventEmitter  = require('events').EventEmitter;
var Immutable     = require('immutable');
var AppDispatcher = require('./AppDispatcher');
var Utils         = require('./Utils');
var listEvent     = Utils.events;
var Config        = require('./config');
var Immutable     = require('immutable');
var _             = require('lodash');
var async         = require('async');

/*-------------Immutable -------------*/
var Setting = Immutable.Record({
  fleetId: '1111',
  token: '',
  state: 'login'
});

var ListDrv = Immutable.List.of();
var DrvInfo = Immutable.Record({
  phone     : '',
  fleetId   : '',
  userId    : '',
  status    : '',
  lat       : 0,
  lng       : 0
});


var setting = new Setting();
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

  getListDrv: function(){
    return ListDrv.toJS();
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

      case 'init-list-drv':
        initListDrv(payload.data);
        this.emitChange(listEvent.CHANGE_DRV_EVENT);
        break;

      case "new-driver-login":
        getDataDriver(payload.data);
        this.emitChange(listEvent.CHANGE_DRV_EVENT);
        break;

      case 'update-location-drv':
        updateLocationDrv(payload.data);
        this.emitChange(listEvent.CHANGE_DRV_EVENT);
        break;

      case "drv-logout":
        if(typeof listDrvIndex[payload.phone] !== 'undefined'){
          ListDrv = ListDrv.delete(listDrvIndex[payload.phone]);
          delete listDrvIndex[payload.phone];
          this.emitChange(listEvent.CHANGE_DRV_EVENT);
        }
        break;
    }
  }
});

function getDataDriver(data, cb){
  if(data && data.phone){
    if(typeof listDrvIndex[data.phone] !== 'undefined'){
      var drvInfo = ListDrv.get(listDrvIndex[data.phone]);
      if(data.status) drvInfo = drvInfo.set('status', data.status);
      ListDrv = ListDrv.update(listDrvIndex[data.phone], function(){return drvInfo});
    }else{
      var drvInfo = new DrvInfo({
        fleetId : data.fleetId,
        status  : data.status,
        phone   : data.phone,
        userId  : data.userId,
        lat     : data.loc.coordinates[1],
        lng     : data.loc.coordinates[0]
      });
      ListDrv = ListDrv.push(drvInfo);
      listDrvIndex[data.phone] = ListDrv.size -1;
    }
  }
  if(cb) return cb();
}

function initListDrv(data){
  async.forEachLimit(data, 100, function(drvInfo, cb){
    getDataDriver(drvInfo, cb);
  }, function(){});
}

function updateLocationDrv(data){
  if(data.length === 3 && typeof listDrvIndex[data[2]] !== 'undefined'){
    var drvInfo = ListDrv.get(listDrvIndex[data[2]]);
    drvInfo = drvInfo.set('lat', data[0]);
    drvInfo = drvInfo.set('lng', data[1]);
    ListDrv = ListDrv.update(listDrvIndex[data[2]], function(){return drvInfo});
  }
}

AppStore.dispatchToken = AppDispatcher.register(AppStore.dispatcherCallback.bind(AppStore));

module.exports = AppStore;