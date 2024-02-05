import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import React, { Component } from "react";
import ReactHtmlParser from "react-html-parser";
import { BsFlagFill } from "react-icons/bs";
import { FaPoundSign, FaRegEdit } from "react-icons/fa";
import { IoLocationOutline, IoPeopleOutline } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { withRouter } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import http from "../../config/http";
import Profile from "../Profiles";
class SingleProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: {},
    };
  }
  componentDidMount() {
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    let stateNew = { ...this.state };
    stateNew.loader = true;
    this.setState(stateNew);
    http
      .get("supplier/products/" + url.pathname.split("l/")[1])
      .then((response) => {
        stateNew.loader = false;
        if (response.data.data.page) {
          stateNew.products = response.data.data.page;
        }
        this.setState(stateNew);
      });
  }

  onEdit = () => {
    this.props.history.push("/edit-product/" + this.state.products.id);
  };
  render() {
    return (
      <React.Fragment>
        {this.state.loader && <Loader />}
        <br></br>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <Profile />
            </div>
            <div className="col-md-8">
              <div className="pb-5 pl-4">
                <h1 className="text-light">{this.state.products.title}</h1>
                <h5 className="text-light">{this.state.products.owner}</h5>
                <p className="my-0 text-light font-weight-light">
                  <MdDateRange className="text-danger" />
                  &nbsp;
                  {/* <Moment format="YYYY-MM-DD"> */}
                  {this.state.products.year} |{" "}
                  <FaPoundSign className="text-danger" />{" "}
                  {this.state.products.price}
                  {/* </Moment> */}
                  {/* <AiOutlineClockCircle className="ml-2  text-danger" /> &nbsp;
                  <Moment format="hh:mm:ss">{this.state.products.time}</Moment> */}
                </p>
                <p className="my-0 text-light font-weight-light">
                  <IoLocationOutline className="text-danger" />{" "}
                  {this.state.products.region} | {this.state.products.status}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Chip
                    size="small"
                    label={this.state.products.status}
                    clickable
                    color="green"
                    className="product-status"
                  />
                </p>

                <p className="my-0 text-light font-weight-light">
                  <IoPeopleOutline className="text-danger" />{" "}
                  {this.state.products.alcohol} % |{" "}
                  <BsFlagFill className="text-danger" />{" "}
                  {this.state.products.country}
                </p>

                <div className="my-4">
                  <React.Fragment>
                    {this.state.products.Imagesrc && (
                      <img
                        src={this.state.products.Imagesrc}
                        className="event-detail-img"
                        width="450"
                        alt="image.jpg"
                      />
                    )}
                    {!this.state.products.Imagesrc && (
                      <img
                        src="https://www.thewinetobuy.com/wp-content/uploads/2016/06/dummy-wine-bottle.jpg"
                        className="event-detail-img"
                        width="450"
                        alt="image.jpg"
                      />
                    )}
                  </React.Fragment>
                </div>
                <div className="col-md-6 render-html-text">
                  {ReactHtmlParser(this.state.products.description)}
                </div>
                <br></br>
                <Button
                  onClick={this.onEdit}
                  variant="contained"
                  className="eventdetailbtn rounded-pill"
                >
                  <FaRegEdit className="mb-1" />
                  &nbsp; Edit Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SingleProductDetail);
