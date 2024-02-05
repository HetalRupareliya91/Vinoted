import React, { Component } from "react";
import Navbar from "../../common/Headers";
import MultiSelectDemo from "./MultiSelectDemo";
class Tests extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <MultiSelectDemo />
      </React.Fragment>
    );
  }
}

export default Tests;
