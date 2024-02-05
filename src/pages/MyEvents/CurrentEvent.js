import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
class CurrentEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      outer_bar: false,
      open: false,
      snackbar: {
        message: "",
        status: "",
      },
    };
  }

  render() {
    let events = [];
    events = this.props.eventData;
    return (
      <React.Fragment>
        {this.state.loader && <Loader />}
        {this.state.outer_bar && (
          <Snackbar open={this.state.open} message={this.state.snackbar} />
        )}
        <div className="row">
          {events.length > 0 && (
            <React.Fragment>
              {events.map((el, id) => {
                return (
                  <div className="col-md-4 mt-4">
                    <Card
                      title={el.name}
                      subTitle={el.date}
                      footer={
                        <span>
                          <Button
                            onClick={() => this.editEvent(el)}
                            className="card-save-action"
                            label="Edit"
                            icon="pi pi-check"
                          />
                          <Button
                            className="card-save-action"
                            label="Delete"
                            icon="pi pi-times"
                            onClick={() => this.deleteEvent(el)}
                            className="p-button-danger p-ml-2"
                          />
                        </span>
                      }
                      header={
                        <React.Fragment>
                          {el.Imagesrc && (
                            <img
                              variant="top"
                              src={el.Imagesrc}
                              className="event-images"
                            />
                          )}
                          {!el.Imagesrc && (
                            <img
                              variant="top"
                              src="https://www.thewinetobuy.com/wp-content/uploads/2016/06/dummy-wine-bottle.jpg"
                              className="event-images"
                            />
                          )}
                        </React.Fragment>
                      }
                    >
                      <p className="p-m-0" style={{ lineHeight: "1.5" }}>
                        {el.country_name} |
                        <span className="text-success">&nbsp;{el.status}</span>
                      </p>
                    </Card>
                  </div>
                );
              })}
            </React.Fragment>
          )}
          {events.length === 0 && (
            <React.Fragment>
              <div className="container not-found">
                <div className="row">
                  <div class="fof">
                    <h1>No events Found</h1>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(CurrentEvent);
