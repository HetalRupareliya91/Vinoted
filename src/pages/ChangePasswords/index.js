import React, { Component } from "react";
import Navbar from "../../common/Headers";
import ChangePassword from "./ChangePassword";
class ChangePasswords extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <ChangePassword />
      </React.Fragment>
    );
  }
}

export default ChangePasswords;
