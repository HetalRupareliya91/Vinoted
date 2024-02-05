import { Tabs } from "antd";
import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Navigationbar from "../Navbar/Navbar";
import Profile from "../Profile/Profile";
import Productlist from "./Productlist/Productlist";
import "./Products.css";

const { TabPane } = Tabs;

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  callback(key) {
    console.log(key);
  }

  render() {
    const { key } = this.state;
    return (
      <div className="home_page">
        <Navigationbar />

        <div className="mx-5 mt-3">
          <div className="row">
            <div className="col-lg-3 col-md-4 pr-0">
              <Profile />
            </div>
            <div className="col-lg-9 col-md-8 pr-0">
              <div className="products">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <h5 className="text-light">My Products</h5>
                  <div className="mx-4">
                    <Form>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Search" />
                      </Form.Group>
                    </Form>
                  </div>
                </div>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab="Name" key="1">
                    <Productlist />
                  </TabPane>
                  <TabPane tab="Type" key="2">
                    {/* <UpcomingEvents /> */}
                  </TabPane>
                  <TabPane tab="Year" key="3">
                    {/* <PastEvents /> */}
                  </TabPane>
                  <TabPane tab="Country" key="4">
                    {/* <PastEvents /> */}
                  </TabPane>
                  <TabPane tab="Sort By" key="5"></TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Products;
