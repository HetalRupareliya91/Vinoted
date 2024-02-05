import React, { Component } from "react";
import Navbar from "../../common/Headers";
import AddProduct from "./AddProduct";
class AddProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <AddProduct />
      </React.Fragment>
    );
  }
}

export default AddProducts;
