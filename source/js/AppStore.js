'use strict';

var assign        = require('object-assign');
var EventEmitter  = require('events').EventEmitter;
var Immutable     = require('immutable');
var AppDispatcher = require('./AppDispatcher');
var Utils         = require('./Utils');
var listEvent     = Utils.events;
var listIcon        = Utils.iconOnMap;
var Config        = require('./config');
var Immutable     = require('immutable');
var _             = require('lodash');
var async         = require('async');
var update        = require('react-addons-update');

/*-------------Immutable -------------*/
var Setting = Immutable.Record({
  fleetId: 'quang',
  token: '',
  state: 'login'
});

var ListDrv = Immutable.List.of();
var DrvInfo = Immutable.Record({
  phone       : '',
  fleetId     : '',
  userId      : '',
  status      : '',
  vehicleType : '',
  plateNumber : '',
  name        : '',
  lat         : 0,
  lng         : 0
});


var setting = new Setting();
var listDrvIndex = {};
var listMarkerByPhone = {};
var mapGlobal;

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

  setMapToSetting: function(map){
    mapGlobal = map;
  },

  getSetting: function(){
    return setting.toJS();
  },

  getListDrv: function(){
    return ListDrv.toJS();
  },

  dispatcherCallback: function(payload){
    var self = this;
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
          listMarkerByPhone[payload.phone].setMap(null);
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
      if(data.status){
        drvInfo['status'] = data.status;
        listMarkerByPhone[drvInfo.phone].setIcon(listIcon[drvInfo['status']]);
      }
      ListDrv = ListDrv.update(listDrvIndex[data.phone], function(){return drvInfo});
    }else{
      var drvInfo = new DrvInfo({
        fleetId     : data.fleetId,
        status      : data.status,
        phone       : data.phone,
        userId      : data.userId,
        vehicleType : data.vehicle.vehicleType,
        plateNumber : data.vehicle.plateNumber,
        name        : data.firstName ? data.firstName+' '+data.lastName : data.lastName,
        lat         : data.loc.coordinates[1],
        lng         : data.loc.coordinates[0]
      });
      ListDrv = ListDrv.push(drvInfo.toJS());
      listDrvIndex[data.phone] = ListDrv.size -1;
      createMarker(drvInfo.toJS());
    }
  }

  if(cb) return cb();
}

function initListDrv(data){
  async.forEachLimit(data, 100, function(drvInfo, cb){
    getDataDriver(drvInfo, cb);
  }, function(){});
}

function createMarker(drvInfo){
  var contentString = '<div class="infoWindowContent"><p class="iw_driver">'+drvInfo.name+'/ '+drvInfo.phone+'</p><p class="iw_vehicle">'+drvInfo.vehicleType+'/ '+drvInfo.plateNumber+'</p></div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var marker = new google.maps.Marker({
    position: {lat: drvInfo.lat, lng: drvInfo.lng},
    map: mapGlobal,
    icon: listIcon[drvInfo.status],
    title: drvInfo.name
  });

  marker.addListener('click', function() {
    infowindow.open(mapGlobal, marker);
  });

  listMarkerByPhone[drvInfo.phone] = marker;
}

function updateLocationDrv(data){
  if(data.length === 3 && typeof listDrvIndex[data[2]] !== 'undefined'){
    var drvInfo = ListDrv.get(listDrvIndex[data[2]]);
    drvInfo['lat'] = data[0];
    drvInfo['lng'] = data[1];
    ListDrv = ListDrv.update(listDrvIndex[data[2]], function(){return drvInfo});
    listMarkerByPhone[data[2]].setPosition({lat: data[0], lng: data[1]});
  }
}

AppStore.dispatchToken = AppDispatcher.register(AppStore.dispatcherCallback.bind(AppStore));

module.exports = AppStore;