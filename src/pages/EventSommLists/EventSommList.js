import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "primereact/button";
import React, { Component } from "react";
import { Form } from "react-bootstrap";
import {MultiSelect} from "react-multi-select-component";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import Table from "../../common/Tables/Table";
import http from "../../config/http";
import Profile from "../Profiles";
class EventSommList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: "",
      columns: [
        // { field: "id", headerName: "ID", width: 10 },
        { field: "users.name", headerName: "User name", width: 130 },
        { field: "users.email", headerName: "Email", width: 170 },
        { field: "users.job_title", headerName: "Job Title", width: 170 },
        { field: "users.company", headerName: "Company", width: 170 },
        { field: "AcceptedAt", headerName: "Accepted Date", width: 170 },
        { field: "status", headerName: "Status", width: 100 },
      ],
      eventName: "",
      eventData: {},
      openModal: false,
      selectedSommieliers: [],
      sommeliersOptions: [],
      maxWidth: "md",
      loader: false,
      outer_bar: false,
      open: false,
      snackbar: {
        message: "",
        status: "",
      },
    };
  }
  componentDidMount() {
    let event_id = window.location.href.split("?event_id=")[1];
    let stateNew = { ...this.state };
    stateNew.loader = true;
    let sommeliers = [];
    let products = [];
    this.setState(stateNew);
    http.get("supplier/eventrequests?event_id=" + event_id).then((response) => {
      stateNew.myEvents = response.data.data.page.data;
      stateNew.loader = false;
      stateNew.resource = "eventrequests?event_id=" + event_id;
      this.setState(stateNew);
    });
    http.get("supplier/events/" + event_id).then((response) => {
      stateNew.eventData = response.data.data.page;
      if (response.data.data.page.products.length === 0) {
        stateNew.selectedProducts = [];
        stateNew.eventData.products = [];
      } else {
        response.data.data.page.products.forEach((element) => {
          products.push({ label: element.title, value: element.id });
        });
        stateNew.selectedProducts = products;
      }
      stateNew.eventData.postcode = response.data.data.page.postcode;

      if (response.data.data.page.eventrequests.length === 0) {
        stateNew.selectedSommieliers = [];
        stateNew.eventData.sommeliers = [];
      } else {
        response.data.data.page.eventrequests.forEach((element) => {
          sommeliers.push({
            label: element.users.name,
            value: element.user_id,
          });
        });
        stateNew.selectedSommieliers = sommeliers;
      }
      this.setState(stateNew);
    });
    http.get("supplier/sommeliers").then((response) => {
      let sommeliersOptions = [];
      response.data.data.page.data.forEach((element) => {
        sommeliersOptions.push({ label: element.name, value: element.id });
      });
      stateNew.sommeliersOptions = sommeliersOptions;
      this.setState(stateNew);
    });
  }
  setSelected1 = (e) => {
    let stateNew = { ...this.state };

    stateNew.selectedSommieliers = e;
    this.setState(stateNew);
  };
  handleOpen = () => {
    this.setState({ openModal: true });
  };
  handleClose = () => {
    this.setState({ openModal: false });
  };
  editEvent = () => {
    let event_id = window.location.href.split("?event_id=")[1];
    if (this.state.outer_bar === true) {
      this.setState({ outer_bar: false });
    }
    this.setState({ loader: true });
    let formData = new FormData();
    for (const [key, value] of Object.entries(this.state.eventData)) {
      if (key === "date") {
        formData.append("date", this.state.eventData.date);
      } else if (
        key === "products" &&
        typeof this.state.selectedProducts !== "undefined"
      ) {
        this.state.selectedProducts.forEach((element, key) => {
          formData.append(`products[${key}]`, element.value);
        });
      } else if (
        key === "eventrequests" &&
        typeof this.state.selectedSommieliers !== "undefined"
      ) {
        this.state.selectedSommieliers.forEach((element, key) => {
          formData.append(`sommeliers[${key}]`, element.value);
        });
      } else if (key === "Imagesrc" && this.state.fileList) {
        this.state.fileList.forEach((element) => {
          if (element.originFileObj) {
            formData.append("image", element.originFileObj);
          } else {
            delete ["Imagesrc"];
          }
        });
      } else if (key === "slug") {
        formData.append(
          "slug",
          this.state.eventData.name.toLowerCase().replace(" ", "_")
        );
      } else if (key === "Imagesrc") {
        delete [key];
      } else if (key === "is_send") {
        delete [key];
      } else if (key === "is_started") {
        delete [key];
      } else if (key === "eventrequests") {
        delete [key];
      } else if (key === "deleted_at") {
        delete [key];
      } else if (key === "created_at") {
        delete [key];
      } else if (key === "updated_at") {
        delete [key];
      } else if (key === "id") {
        delete [key];
      } else if (key === "user_id") {
        delete [key];
      } else if (key === "address_2") {
        delete [key];
      } else if (key === "status") {
        formData.append("status", this.state.eventData.status);
      } else if (key === "country_code") {
        formData.append("country_code", this.state.eventData.country_code);
      } else if (key === "description") {
        formData.append("_method", "PUT");
        formData.append("description", this.state.eventData.description);
      } else {
        formData.append(key, value);
      }
    }

    formData.append(
      "latitude",
      JSON.parse(localStorage.getItem("event_latLng")).lat
    );
    formData.append(
      "longitude",
      JSON.parse(localStorage.getItem("event_latLng")).lng
    );

    http.post("supplier/events/" + event_id, formData).then((response) => {
      if (response.code === 200) {
        console.log(response);
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.open = true;

        stateNew.loader = false;
        stateNew.snackbar.message = response.data.message;
        stateNew.snackbar.status = "success";
        stateNew.openModal = false;
        this.setState(stateNew);
        window.location.reload(false);
      } else if (response.code === 422) {
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.loader = false;
        stateNew.snackbar.message = response.message;
        stateNew.snackbar.status = "error";
        this.setState(stateNew);
      }
    });
  };
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
            <div className="pr-0 col-md-3 profile-outer-card">
              <Profile />
            </div>
            <div className="pr-0 col-md-9">
              <Card className="dashboard-events-table">
                <Button
                  onClick={this.handleOpen}
                  className="invite-more-action"
                  variant="contained"
                >
                  Invite More Sommeliers
                </Button>
                <Table
                  resource={
                    "eventrequests?event_id=" +
                    window.location.href.split("?event_id=")[1]
                  }
                  columns={this.state.columns}
                  tablename="Sommeliers"
                  eventName={this.state.eventName}
                />
              </Card>
              <Dialog
                onClose={this.handleClose}
                aria-labelledby="customized-dialog-title"
                open={this.state.openModal}
                fullWidth={true}
                maxWidth={this.state.maxWidth}
              >
                <DialogTitle
                  id="customized-dialog-title"
                  onClose={this.handleClose}
                  className="more-invite-somm-header"
                >
                  Invite More Sommeliers
                </DialogTitle>
                <DialogContent className="more-invite-somm" dividers>
                  <Form.Group
                    className="somm-multi-select"
                    controlId="exampleForm.ControlSelect1"
                  >
                    <Form.Label className="text-light">
                      Choose Sommeliers
                    </Form.Label>
                    <MultiSelect
                      options={this.state.sommeliersOptions}
                      value={this.state.selectedSommieliers}
                      onChange={this.setSelected1}
                      labelledBy="Select sommeliers"
                    />
                  </Form.Group>
                </DialogContent>
                <DialogActions className="more-invite-somm-footer">
                  <Button
                    className="save-changes-action"
                    autoFocus
                    onClick={this.editEvent}
                    color="red"
                  >
                    Save changes
                  </Button>
                  <Button
                    className="close-changes-action"
                    autoFocus
                    onClick={this.handleClose}
                    color="red"
                  >
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EventSommList;
