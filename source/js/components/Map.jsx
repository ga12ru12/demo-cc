'use strict'

var React           = require('react');
var ReactGoogleMaps = require('react-google-maps');
var ReactIntl       = require('react-intl');
var IntlMixin       = ReactIntl.IntlMixin;
var AppAction       = require('../AppAction');
var AppStore        = require('../AppStore');
var Utils           = require('../Utils');
var listEvent       = Utils.events;

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

  },

  componentWillUnmount: function(){

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