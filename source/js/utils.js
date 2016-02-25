'use strict'

module.exports = {
  events:{
    CHANGE_STATE_EVENT: 'change_state',
    CHANGE_DRV_EVENT: 'change_drv',
    CHANGE_BOOKING_EVENT: 'change_booking'
  },
  iconOnMap:{
    "bookOff"     : './img/driverGray.png',
    "bookIn"      : './img/driverGreen.png',
    "offered"     : './img/driverPurple.png',
    "booked"      : './img/driverYellow.png',
    "arrived"     : './img/driverOrange.png',
    "engaged"     : './img/driverRed.png',
    "droppedOff"  : './img/driverRedDrop.png'
  },
  classListDrv:{
    "bookOff"     : 'gray',
    "bookIn"      : 'green',
    "offered"     : 'purple',
    "booked"      : 'yellow',
    "arrived"     : 'orange',
    "engaged"     : 'red',
    "droppedOff"  : 'red-drop'
  }
}