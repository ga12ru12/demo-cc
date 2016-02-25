'use strict'

var React           = require('react');
var ReactIntl       = require('react-intl');
var IntlMixin       = ReactIntl.IntlMixin;
var AppAction       = require('../AppAction');
var AppStore        = require('../AppStore');
var Utils           = require('../Utils');
var listEvent       = Utils.events;
var listClassColor  = Utils.classListDrv;


var reactBootstrap  = require('react-bootstrap');

var Menu = React.createClass({

  mixins: [IntlMixin],

  getInitialState: function(){
    return {
      listDrv: []
    };
  },

  onChangeDrv: function(){
    this.setState({
      listDrv: AppStore.getListDrv()
    });
  },

  componentDidMount: function(){
    AppStore.addChangeListener(listEvent.CHANGE_DRV_EVENT, this.onChangeDrv);
  },


  componentWillUnmount: function(){
    AppStore.removeChangeListener(listEvent.CHANGE_DRV_EVENT, this.onChangeDrv);
  },

  render: function(){
    return(
      <div className="menu-div">
        <div className="content">
          <div className="total-div"><b>Total: </b><span className="total-drv">{this.state.listDrv.length}</span> drivers</div>
          <div className="list-drv-div">
            {this.state.listDrv.map(function(drvInfo, index){
              var classDrv = "drv-div ";
              classDrv += listClassColor[drvInfo.status];
              return <div className={classDrv}>{drvInfo.name}/ {drvInfo.plateNumber}</div>;
            })}
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Menu;