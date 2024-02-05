import { Tabs } from "antd";
import React, { Component } from "react";
import { FaPercent, FaRegEdit } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import winebottle from "../../../Assets/small_wine@2x.png";
import Navigationbar from "../../Navbar/Navbar";
import Profile from "../../Profile/Profile";

const { TabPane } = Tabs;

class WineDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    this.setState({ data: this.props.location.state.winedetail });
  }

  render() {
    return (
      <div className="home_page">
        <Navigationbar />

        <div className="mx-5 mt-3">
          <div className="row">
            <div className="col-lg-3 col-md-4 pr-0">
              <Profile />
            </div>
            <div className="col-lg-9 col-md-8">
              <div className="winedetailpage">
                <h1 className="text-light">{this.state.data.title}</h1>
                <h5 className="text-light">
                  {this.state.data.color} | {this.state.data.type}
                </h5>
                <p className="text-light my-0 font-weight-light">
                  <MdDateRange className="text-danger" /> {this.state.data.date}
                </p>

                <p className="text-light my-0 font-weight-light">
                  <IoLocationOutline className="text-danger" />{" "}
                  {this.state.data.venue} | {this.state.data.country} |{" "}
                  {this.state.data.status}
                </p>
                <p className="text-light my-0 font-weight-light">
                  <FaPercent size={11} className="text-danger" />{" "}
                  {this.state.data.alcohol}
                </p>

                <div className="my-4">
                  <img
                    src={winebottle}
                    // src={this.state.data.img}
                    style={{
                      // border: "3px solid #ffffff",
                      borderRadius: "15px",
                    }}
                    width="250"
                    alt="image.jpg"
                  />
                </div>
                <h2 className="text-light">{this.state.data.price}</h2>
                <p
                  className="text-light text font-weight-light text-justify"
                  style={{ fontSize: "12px" }}
                >
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text.
                </p>

                <button className="eventdetailbtn rounded-pill">
                  <FaRegEdit className="mb-1" /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WineDetail;
