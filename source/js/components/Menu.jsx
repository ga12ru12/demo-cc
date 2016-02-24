'use strict'

var React           = require('react');
var ReactIntl       = require('react-intl');
var IntlMixin       = ReactIntl.IntlMixin;
var AppAction       = require('../AppAction');
var AppStore        = require('../AppStore');
var Utils           = require('../Utils');
var listEvent       = Utils.events;


var reactBootstrap  = require('react-bootstrap');

var Menu = React.createClass({

  mixins: [IntlMixin],

  getInitialState: function(){
    return {

    };
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

  }
});