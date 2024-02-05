import React, { Component } from "react";
import Navbar from "../../common/Headers";
import SingleProductDetail from "./SingleProductDetail";
class SingleProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <SingleProductDetail />
      </React.Fragment>
    );
  }
}

export default SingleProductDetails;
