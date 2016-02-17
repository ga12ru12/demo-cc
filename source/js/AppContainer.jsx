'use strict';

var React       = require('react');
var ReactIntl   = require('react-intl');
var IntlMixin   = ReactIntl.IntlMixin;
var App         = require('./App');
var AppStore    = require('./AppStore');

function initState(){
  return {Locale: AppStore.getLocale()};
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
    AppStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this.onChange);
  },

  render: function(){
    return (
      <App locales={this.state.Locale.locales} formats={this.state.Locale.formats} messages={this.state.Locale.messages} />
    );
  }
});

module.exports = AppContainer;