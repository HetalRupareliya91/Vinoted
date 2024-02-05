import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";

class PastEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          id: 0,
          title: "Sparkling Wines",
          img: "https://picsum.photos/id/237/300/150",
          date: "01 Jan,2021 | 10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 1,
          title: "Sparkling Wines",
          img: "https://picsum.photos/id/238/300/150",
          date: "01 Jan,2021 | 10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 2,
          title: "Sparkling Wines",
          img: "https://picsum.photos/id/239/300/150",
          date: "01 Jan,2021 | 10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 3,
          title: "Sparkling Wines",
          img: "https://picsum.photos/id/240/300/150",
          date: "01 Jan,2021 | 10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 4,
          title: "Sparkling Wines",
          img: "https://picsum.photos/id/241/300/150",
          date: "01 Jan,2021 | 10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 5,
          title: "Sparkling Wines",
          img: "https://picsum.photos/id/242/300/150",
          date: "01 Jan,2021 | 10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 6,
          title: "Sparkling Wines",
          img: "https://picsum.photos/id/243/300/150",
          date: "01 Jan,2021 | 10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
        {
          id: 7,
          title: "Sparkling Wines",
          img: "https://picsum.photos/id/244/300/150",
          date: "01 Jan,2021 | 10.00 PM",
          venue: "San Francisco",
          status: "status",
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <div className="row">
          {this.state.data.map((el, id) => {
            return (
              <div className="col-lg-3 col-md-6 mt-4">
                <Card key={el.id} className="eventCard">
                  <Card.Img variant="top" src={el.img} />
                  <Card.Body>
                    <Card.Title className="cardtitle">{el.title}</Card.Title>
                    <Card.Text
                      className="cardText"
                      style={{ color: "#1D3557", margin: "0 auto" }}
                    >
                      {el.date}
                    </Card.Text>
                    <Card.Text className="cardText text-muted my-0">
                      {el.venue} | <span className="text-success">Active</span>
                    </Card.Text>
                    <div
                      className="text-light rounded cardText text-center"
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

const viewmorebtn = {
  backgroundColor: "#1D3557",

  border: "none",
  padding: "0 35px",
};

export default PastEvents;
