'use strict'

var React           = require('react');
var ReactGoogleMaps = require('react-google-maps');
var ReactIntl       = require('react-intl');
var IntlMixin       = ReactIntl.IntlMixin;
var AppAction       = require('../AppAction');
var AppStore        = require('../AppStore');
var Utils           = require('../Utils');
var listEvent       = Utils.events;
var listIcon        = Utils.iconOnMap;

var GoogleMapLoader = ReactGoogleMaps.GoogleMapLoader;
var GoogleMap       = ReactGoogleMaps.GoogleMap;
var Marker          = ReactGoogleMaps.Marker;

var reactBootstrap  = require('react-bootstrap');

var Map = React.createClass({

  mixins: [IntlMixin],

  map: null,

  getInitialState: function(){
    return {
      listDrv: []
    };
  },

  onChangeDrv: function(){
    this.setState({
      listDrv: AppStore.getListDrv()
    });
  },

  onChangeState: function(){

  },

  initMap: function(){
    this.map = new google.maps.Map(document.getElementById('map-div'), {
      center: {lat: 21.031983, lng: 105.851410},
      zoom: 15
    });
    AppStore.setMapToSetting(this.map);
  },

  componentDidMount: function(){
    var self = this;
    self.initMap();
    AppAction.loadDrvToMap();
    AppStore.addChangeListener(listEvent.CHANGE_STATE_EVENT, this.onChangeState);
    AppStore.addChangeListener(listEvent.CHANGE_DRV_EVENT, this.onChangeDrv);
  },

  componentWillUnmount: function(){
    AppStore.addChangeListener(listEvent.CHANGE_STATE_EVENT, this.onChangeState);
    AppStore.removeChangeListener(listEvent.CHANGE_DRV_EVENT, this.onChangeDrv);
  },

  render: function(){
    var center = {lat: 21.031983, lng: 105.851410};
    //var center = {lat: 16.070201, lng: 108.2113353};
    return (
      <section id="map-div"></section>
    )
  }
});

module.exports = Map;