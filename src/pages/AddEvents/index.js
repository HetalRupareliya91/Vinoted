import React, { Component } from "react";
import Navbar from "../../common/Headers";
import AddEvent from "./AddEvent";
class AddEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <AddEvent />
      </React.Fragment>
    );
  }
}

export default AddEvents;
