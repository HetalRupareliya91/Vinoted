import Button from "@material-ui/core/Button";
import React, { Component } from "react";
import ReactHtmlParser from "react-html-parser";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { withRouter } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import http from "../../config/http";
import Profile from "../Profiles";
class EventDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: {},
    };
  }

  componentDidMount() {
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    let stateNew = { ...this.state };
    stateNew.loader = true;
    this.setState(stateNew);
    http
      .get("supplier/events/" + url.pathname.split("s/")[1])
      .then((response) => {
        stateNew.loader = false;
        if (response.data.data.page) {
          stateNew.events = response.data.data.page;
        }
        this.setState(stateNew);
      });
  }

  onEdit = () => {
    this.props.history.push("/edit-event/" + this.state.events.id);
  };

  render() {
    let date = "";
    if (typeof this.state.events.date !== "undefined") {
      date = this.state.events.date;
    }
    return (
      <React.Fragment>
        {this.state.loader && <Loader />}
        <div className="eventDetailPage" style={{ backgroundColor: "#181F39" }}>
          <div className="mx-5 mt-3">
            <div className="row ">
              <div className="col-lg-3 col-md-3 pr-0">
                <Profile />
              </div>
              <div className="col-lg-9 col-md-9 ">
                <div className="pl-4 pb-5">
                  <h1 className="text-light">{this.state.events.name}</h1>
                  <h5 className="text-light">{this.state.events.owner}</h5>
                  <p className="text-light my-0 font-weight-light">
                    <MdDateRange className="text-danger" />
                    &nbsp;
                    {date.split(" ")[0]}
                    <AiOutlineClockCircle className=" ml-2 text-danger" />{" "}
                    &nbsp;
                    {date.split(" ")[1]}
                  </p>
                  <p className="text-light my-0 font-weight-light">
                    <IoLocationOutline className="text-danger" />{" "}
                    {this.state.events.country_name} |{" "}
                    {this.state.events.status}
                  </p>

                  <div className="my-4">
                    <React.Fragment>
                      {this.state.events.Imagesrc && (
                        <img
                          src={this.state.events.Imagesrc}
                          className="event-detail-img"
                          width="450"
                          alt="image.jpg"
                        />
                      )}
                      {!this.state.events.Imagesrc && (
                        <img
                          src="https://www.thewinetobuy.com/wp-content/uploads/2016/06/dummy-wine-bottle.jpg"
                          className="event-detail-img"
                          width="450"
                          alt="image.jpg"
                        />
                      )}
                    </React.Fragment>
                  </div>
                  <div className=" col-md-6 render-html-text">
                    {ReactHtmlParser(this.state.events.description)}
                  </div>
                  <br></br>
                  <Button
                    onClick={this.onEdit}
                    variant="contained"
                    className="eventdetailbtn rounded-pill"
                  >
                    <FaRegEdit className="mb-1" />
                    &nbsp; Edit Tasting
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(EventDetail);
