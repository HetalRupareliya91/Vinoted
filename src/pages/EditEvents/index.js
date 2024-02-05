import React, { Component } from "react";
import Navbar from "../../common/Headers";
import EditEvent from "./EditEvent";
class EditEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <EditEvent />
      </React.Fragment>
    );
  }
}

export default EditEvents;
