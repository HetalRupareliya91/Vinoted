import React, { Component } from "react";
import Navbar from "../../common/Headers";
import EventDetail from "./EventDetail";
class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <EventDetail />
      </React.Fragment>
    );
  }
}

export default EventDetails;
