import React, { Component } from "react";
import Navbar from "../../common/Headers";
import ProductList from "./ProductList";
class ProductLists extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <ProductList />
      </React.Fragment>
    );
  }
}

export default ProductLists;
