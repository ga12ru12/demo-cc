'use strict';

var React       = require('react');
var ReactIntl   = require('react-intl');
var IntlMixin   = ReactIntl.IntlMixin;
var AppAction   = require('./AppAction');
var AppStore    = require('./AppStore');
var Utils       = require('./Utils');
var Login       = require('./Login');

var App = React.createClass({
  mixins: [IntlMixin],

  getInitialState: function(){
    return AppStore.getState();
  },

  componentDidMount: function(){
    AppAction.initWebSocket();
  },

  render: function(){
    return (
      <Login />
    );
  }
});