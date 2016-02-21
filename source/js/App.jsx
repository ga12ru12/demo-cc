'use strict';

var React       = require('react');
var ReactIntl   = require('react-intl');
var IntlMixin   = ReactIntl.IntlMixin;
var AppAction   = require('./AppAction');
var AppStore    = require('./AppStore');
var Utils       = require('./Utils');
var listEvent   = Utils.events;
var Login       = require('./components/Login');
var Map         = require('./components/Map');

var App = React.createClass({
  mixins: [IntlMixin],

  getInitialState: function(){
    return AppStore.getSetting();
  },

  onChange: function() {
    this.setState(AppStore.getSetting());
  },

  componentDidMount: function(){
    AppAction.initWebSocket();
    AppStore.addChangeListener(listEvent.CHANGE_STATE_EVENT, this.onChange);
  },

  componentWillUnmount: function(){
    AppStore.removeChangeListener(listEvent.CHANGE_STATE_EVENT, this.onChange);
  },

  render: function(){
    if(this.state.state === 'login')
      return (
        <Login />
      );
    if(this.state.state === 'map')
      return (
        <Map />
      );
  }
});

module.exports = App;