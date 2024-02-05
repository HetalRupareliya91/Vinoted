import React, { Component } from "react";
import Navbar from "./Header";
class Headers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
      </React.Fragment>
    );
  }
}

export default Headers;
