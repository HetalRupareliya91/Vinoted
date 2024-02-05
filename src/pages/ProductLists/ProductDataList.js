import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

class Productlist extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  editProduct = (id) => {
    this.props.history.push("/edit-product/" + id);
  };
  render() {
    return (
      <div>
        <div className="row">
          {this.props.productData.length > 0 && (
            <React.Fragment>
              {this.props.productData.map((el, id) => {
                return (
                  <div className="col-md-4 mt-4">
                    <Card key={el.id} className="productCard">
                      <Card.Img
                        className="product-card-img"
                        variant="top"
                        src={el.Imagesrc}
                      />
                      <Card.Body>
                        <Link
                          to={{
                            pathname: "/wine-detail",
                            state: { winedetail: el },
                          }}
                        >
                          <Card.Title className="cardtitle my-0">
                            {el.title}
                          </Card.Title>
                        </Link>
                        <Card.Text
                          className="cardText"
                          style={{ color: "#1D3557", margin: "0 auto" }}
                        >
                          {el.type}| {el.alcohol}
                        </Card.Text>
                        <Card.Text className="cardText text-muted my-0">
                          {el.country} |{" "}
                          <span className="text-success">{el.status}</span>
                        </Card.Text>
                        <div className="row" style={{ marginTop: 4 }}>
                          <div className="col-md-6">
                            <div
                              onClick={() => this.editProduct(el.id)}
                              className="text-light rounded-pill mt-2 py-1 text-center cardText edit-product-btn"
                            >
                              Edit
                            </div>
                          </div>
                          <div className="col-md-6 price-tag-outer">
                            <h5 className="price-info-tag">
                              $&nbsp;{el.price}
                            </h5>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </React.Fragment>
          )}

          {this.props.productData.length === 0 && (
            <React.Fragment>
              <div className="container not-found">
                <div className="row">
                  <div className="fof">
                    <h1>No products Found</h1>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Productlist);
