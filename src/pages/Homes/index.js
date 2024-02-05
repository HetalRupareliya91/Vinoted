import React, { Component } from "react";
import Navbar from "../../common/Headers";
import Dashboard from "./Dashboard";
class Homes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Navbar />
        <Dashboard />
      </div>
    );
  }
}

export default Homes;
