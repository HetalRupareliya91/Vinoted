import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

class OngoingEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          id: 0,
          title: "Sparkling Wines",
          owner: "Barbara Wine",
          img: "https://picsum.photos/id/237/300/150",
          date: "01 Jan,2021 ",
          time: "10.00 PM",
          venue: "San Francisco",
          status: "Active",
        },
        {
          id: 1,
          title: "Sparkling Wines",
          owner: "Barbara Wine",
          img: "https://picsum.photos/id/238/300/150",
          date: "01 Jan,2021",
          time: "10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 2,
          title: "Sparkling Wines",
          owner: "Barbara Wine",
          img: "https://picsum.photos/id/239/300/150",
          date: "01 Jan,2021",
          time: "10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 3,
          title: "Sparkling Wines",
          owner: "Barbara Wine",
          img: "https://picsum.photos/id/240/300/150",
          date: "01 Jan,2021",
          time: "10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 4,
          title: "Sparkling Wines",
          owner: "Barbara Wine",
          img: "https://picsum.photos/id/241/300/150",
          date: "01 Jan,2021",
          time: "10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 5,
          title: "Sparkling Wines",
          owner: "Barbara Wine",
          img: "https://picsum.photos/id/242/300/150",
          date: "01 Jan,2021",
          time: "10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 6,
          title: "Sparkling Wines",
          owner: "Barbara Wine",
          img: "https://picsum.photos/id/243/300/150",
          date: "01 Jan,2021",
          time: "10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 7,
          title: "Sparkling Wines",
          owner: "Barbara Wine",
          img: "https://picsum.photos/id/244/300/150",
          date: "01 Jan,2021",
          time: "10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <div className="row" style={{ width: "100%" }}>
          {this.state.data.map((el, id) => {
            return (
              <div className="col-lg-3 col-md-6 mt-4">
                <Card key={el.id} className="eventCard">
                  <Card.Img variant="top" src={el.img} />
                  <Card.Body>
                    <Link
                      to={{ pathname: "/event-details", state: { detail: el } }}
                    >
                      <Card.Title className="cardtitle">{el.title}</Card.Title>
                    </Link>
                    <Card.Text
                      className="cardText"
                      style={{ color: "#1D3557", margin: "0 auto" }}
                    >
                      {el.date} | {el.time}
                    </Card.Text>
                    <Card.Text className="cardText text-muted my-0">
                      {el.venue} | <span className="text-success">Active</span>
                    </Card.Text>
                    <div
                      className="text-light rounded text-center cardText"
                      style={{
                        backgroundColor: "#1D3557",
                        width: "35%",
                        float: "right",
                        position: "relative",
                        left: "21px",
                        bottom: "15px",
                      }}
                    >
                      <FaRegEdit className="mb-1" /> Edit
                    </div>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default OngoingEvents;
