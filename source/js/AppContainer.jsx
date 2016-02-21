'use strict';

var React       = require('react');
var ReactIntl   = require('react-intl');
var IntlMixin   = ReactIntl.IntlMixin;
var App         = require('./App');
var AppStore    = require('./AppStore');
var Utils       = require('./Utils');
var listEvent   = Utils.events;

function initState(){
  return {};
}

var AppContainer = React.createClass({
  mixins: [IntlMixin],

  getInitialState: function() {
    return initState();
  },

  onChange: function() {
    this.setState(initState());
  },

  componentDidMount: function() {
    AppStore.addChangeListener(listEvent.CHANGE_STATE_EVENT, this.onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(listEvent.CHANGE_STATE_EVENT, this.onChange);
  },

  render: function(){
    return (
      <App />
    );
  }
});

module.exports = AppContainer;