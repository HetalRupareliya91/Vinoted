import React, { Component } from "react";
import NotAuthenticated from "./NotAuthenticated";
class NotAuthenticateds extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <NotAuthenticated />
      </React.Fragment>
    );
  }
}

export default NotAuthenticateds;
