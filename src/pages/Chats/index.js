import React, { Component } from "react";
import Navbar from "../../common/Headers";
import Chat from "./Chat";
class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <Chat />
      </React.Fragment>
    );
  }
}

export default Chats;
