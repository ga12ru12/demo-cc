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

  componentDidMount: function(){
    AppAction.loadDrvToMap();
    AppStore.addChangeListener(listEvent.CHANGE_STATE_EVENT, this.onChangeState);
    AppStore.addChangeListener(listEvent.CHANGE_DRV_EVENT, this.onChangeDrv);
  },

  componentWillUnmount: function(){
    AppStore.addChangeListener(listEvent.CHANGE_STATE_EVENT, this.onChangeState);
    AppStore.removeChangeListener(listEvent.CHANGE_DRV_EVENT, this.onChangeDrv);
  },

  render: function(){
    //var center = {lat: 21.031983, lng: 105.851410};
    var center = {lat: 16.070201, lng: 108.2113353};
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
            {
              this.state.listDrv.map(function(drv, index){
                return(
                  <Marker
                    key             ={'marker_'+index}
                    ref             ={'marker_'+index}
                    defaultPosition ={{lat: drv.lat, lng: drv.lng}}
                    icon            ={listIcon[drv.status]}
                    title           ={drv.phone}/>
                )

              })
            }
            </GoogleMap>
          }
        />

      </section>
    )
  }
});

module.exports = Map;