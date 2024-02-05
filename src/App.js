import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let new_latlng = { lat: 10.2545, lng: 10.2525 };
    localStorage.setItem("profile_latLng", JSON.stringify(new_latlng));
  }

  render() {
    return <div className="App"></div>;
  }
}

export default App;
