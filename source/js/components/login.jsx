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

  },

  componentDidMount: function(){

  },

  componentWillUnmount: function(){

  },

  login: function(){
    AppAction.getTokenCC({
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue()
    });
  },

  render: function(){
    return (
      <div class="login-div">
        <form>
          <Input type="text" label="Username" ref="username" placeholder="Please enter username" />
          <Input type="password" label="Password" ref="password" placeholder="Please enter password" />
          <ButtonInput bsStyle="primary" onClick={this.login} />
        </form>
      </div>
    );
  }
});

module.exports = Login;