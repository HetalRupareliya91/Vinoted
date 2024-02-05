import React, { Component } from "react";
import VerifyEmail from "./VerifyEmail";
class VerifyEmails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <VerifyEmail />
      </React.Fragment>
    );
  }
}

export default VerifyEmails;
