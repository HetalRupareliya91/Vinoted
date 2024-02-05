import React, { Component } from "react";
import Profile from "./Profile";
class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Profile />
      </React.Fragment>
    );
  }
}

export default Profiles;
