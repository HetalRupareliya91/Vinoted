import React, { Component } from "react";
import Navbar from "../../common/Headers";
import EditProduct from "./EditProduct";
class EditProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <EditProduct />
      </React.Fragment>
    );
  }
}

export default EditProducts;
