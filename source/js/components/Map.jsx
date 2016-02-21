'use strict'

var React           = require('react');
var ReactGoogleMaps = require('react-google-maps');
var ReactIntl       = require('react-intl');
var IntlMixin       = ReactIntl.IntlMixin;
var AppAction       = require('../AppAction');
var AppStore        = require('../AppStore');
var Utils       = require('./Utils');
var listEvent   = Utils.events;

var GoogleMapLoader = ReactGoogleMaps.GoogleMapLoader;
var GoogleMap       = ReactGoogleMaps.GoogleMap;
var Marker          = ReactGoogleMaps.Marker;

var reactBootstrap  = require('react-bootstrap');

var Map = React.createClass({

  mixins: [IntlMixin],

  getInitialState: function(){
    return {};
  },

  onChangeDrv: function(){

  },

  componentDidMount: function(){
    AppStore.addChangeListener(listEvent.CHANGE_DRV_EVENT, this.onChangeDrv);
  },

  componentWillUnmount: function(){
    AppStore.removeChangeListener(listEvent.CHANGE_DRV_EVENT, this.onChangeDrv);
  },

  render: function(){
    var center = {lat: 21.031983, lng: 105.851410};
    return (
      <section className="map-div">
        <GoogleMapLoader
          containerElement={
            <div
              style={{
                height: "100%",
              }}
            />
          }
          googleMapElement={
            <GoogleMap defaultZoom={15} defaultCenter={center}>
              <Marker
                defaultPosition={center}
                icon="./img/driverGreen.png"
                title="Hà Lội"/>
            </GoogleMap>
          }
        />

      </section>
    )
  }
});

module.exports = Map;