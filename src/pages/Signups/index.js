import React, { Component } from "react";
import Signup from "./Signup";
class Signups extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Signup />
      </React.Fragment>
    );
  }
}

export default Signups;
