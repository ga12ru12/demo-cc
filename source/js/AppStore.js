'use strict';

var assign        = require('object-assign');
var EventEmitter  = require('events').EventEmitter;
var Immutable     = require('immutable');
var AppDispatcher = require('./AppDispatcher');
var Utils         = require('./Utils');
var Config        = require('./config');

var AppStore = assign({}, EventEmitter.prototype, {

  state: 'login',

  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getState: function(){
    return this.state;
  }

});