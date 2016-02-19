'use strict';

var React           = require('react');
var ReactDOM        = require('react-dom');
var Config          = require('./config');
var AppContainer    = require('./AppContainer');

//log information for debug
  console.info("The QUp CC Information");
  console.info("  WebServer:", Config.webserver);
  console.info("  Amazon WS:", Config.aws);
  console.info("  Dispatch :", Config.dispatch);
  console.info("  Locale   :", Config.locale);
  console.info("  Version  :", Config.version);

$(function(){
  ReactDOM.render( React.createElement(AppContainer), document.getElementById('loading') );
});