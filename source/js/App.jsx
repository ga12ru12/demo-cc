'use strict';

var React       = require('react');
var ReactIntl   = require('react-intl');
var IntlMixin   = ReactIntl.IntlMixin;
var AppAction   = require('./AppAction');
var AppStore    = require('./AppStore');
var Utils       = require('./Utils');
var Login       = require('./components/Login');
var Map         = require('./components/Map');

var App = React.createClass({
  mixins: [IntlMixin],

  getInitialState: function(){
    return AppStore.getState();
  },

  onChange: function() {
    this.setState(AppStore.getState());
  },

  componentDidMount: function(){
    AppAction.initWebSocket();
    AppStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function(){
    AppStore.removeChangeListener(this.onChange);
  },

  render: function(){
    console.log(this.state);
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