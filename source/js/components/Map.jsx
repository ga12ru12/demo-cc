'use strict'

var React           = require('react');
var ReactGoogleMaps = require('react-google-maps');
var ReactIntl       = require('react-intl');
var IntlMixin       = ReactIntl.IntlMixin;
var AppAction       = require('../AppAction');
var AppStore        = require('../AppStore');

var GoogleMap = ReactGoogleMaps.GoogleMap;
var Marker = ReactGoogleMaps.Marker;

var reactBootstrap  = require('react-bootstrap');

var Map = React.createClass({

  mixins: [IntlMixin],

  getInitialState: function(){
    return {};
  },

  onChange: function(){

  },

  componentDidMount: function(){
    AppStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function(){
    AppStore.removeChangeListener(this.onChange);
  },

  render: function(){
    var center = {lat: 21.031983, lng: 105.851410};
    return (
      <section className="map-div">
        <GoogleMap defaultZoom={15} defaultCenter={center}>
          <Marker
            defaultPosition={center}
            title="Hà Lội"/>
        </GoogleMap>
      </section>
    )
  }
});

module.exports = Map;