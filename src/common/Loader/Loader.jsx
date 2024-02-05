import React, { Component } from "react";
class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="loader3">
        <span></span>
        <span></span>
      </div>
    );
  }
}

export default Loader;
