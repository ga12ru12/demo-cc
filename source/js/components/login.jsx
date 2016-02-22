'use strict';

var React       = require('react');
var ReactIntl   = require('react-intl');
var IntlMixin   = ReactIntl.IntlMixin;
var AppAction   = require('../AppAction');
var AppStore    = require('../AppStore');

var reactBootstrap = require('react-bootstrap');
var Input = reactBootstrap.Input;
var ButtonInput = reactBootstrap.ButtonInput;

var Login = React.createClass({
  mixins: [IntlMixin],

  getInitialState: function(){
    return {};
  },

  componentDidMount: function(){

  },

  componentWillUnmount: function(){

  },

  handleSubmit: function(){
    e.preventDefault();
    this.login();
  },

  login: function(){
    AppAction.getTokenCC({
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue(),
      fleetId: AppStore.getSetting().fleetId
    });
  },

  render: function(){
    return (
      <div className="login-div">
        <form onSubmit={this.handleSubmit}>
          <h2 className="title">Please sign in</h2>
          <Input type="text" label="Username" ref="username" placeholder="Please enter username" />
          <Input type="password" label="Password" ref="password" placeholder="Please enter password" />
          <ButtonInput bsStyle="primary" onClick={this.login} block>Sign in</ButtonInput>
        </form>
      </div>
    );
  }
});

module.exports = Login;