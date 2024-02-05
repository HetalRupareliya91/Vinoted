import { Component } from "react";
import GMap from "./GoogleMap";
class Maps extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <GMap />;
  }
}

export default Maps;
