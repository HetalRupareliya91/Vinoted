import React, { Component } from "react";
import AuthLogin from "./AuthLogin";

class Logins extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <AuthLogin />
      </>
    );
  }
}

export default Logins;
