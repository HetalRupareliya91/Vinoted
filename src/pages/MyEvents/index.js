import React, { Component } from "react";
import Navbar from "../../common/Headers";
import MyEvent from "./MyEvent";
class MyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <MyEvent />
      </React.Fragment>
    );
  }
}

export default MyEvents;
