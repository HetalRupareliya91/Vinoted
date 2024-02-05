import React, { Component } from "react";
import Navbar from "../../common/Headers";
import EventSommList from "./EventSommList";
class EventSommLists extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <EventSommList />
      </React.Fragment>
    );
  }
}

export default EventSommLists;
