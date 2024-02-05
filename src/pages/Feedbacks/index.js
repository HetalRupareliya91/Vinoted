import React, { Component } from "react";
import Navbar from "../../common/Headers";
import Feedback from "./Feedback";
class Feedbacks extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <Feedback />
      </React.Fragment>
    );
  }
}

export default Feedbacks;
