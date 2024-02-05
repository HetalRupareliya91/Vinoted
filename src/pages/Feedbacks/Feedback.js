import Card from "@material-ui/core/Card";
import React, { Component } from "react";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import Table from "../../common/Tables/Table";
import Profile from "../Profiles";
class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: "",
      columns: [
        { field: "id", headerName: "ID", width: 10 },
        { field: "product.title", headerName: "Product name", width: 130 },
        { field: "taste", headerName: "Taste", width: 130 },
        { field: "nose", headerName: "Nose", width: 170 },
        { field: "finish", headerName: "Finish", width: 170 },
        { field: "color", headerName: "Color", width: 170 },
        { field: "alcohol", headerName: "Alcohol", width: 170 },
        { field: "description", headerName: "Description", width: 100 },
      ],
    };
  }
  render() {
    return (
      <React.Fragment>
        {this.state.loader && <Loader />}
        {this.state.outer_bar && (
          <Snackbar open={this.state.open} message={this.state.snackbar} />
        )}
        <br></br>
        <div className="container">
          <div className="row">
            <div className="col-md-3 pr-0 profile-outer-card">
              <Profile />
            </div>
            <div className="col-md-9 pr-0">
              <Card className="dashboard-events-table">
                <Table
                  resource={"eventproductratings"}
                  columns={this.state.columns}
                  tablename="Feedback"
                />
              </Card>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Feedback;
