import Button from "@material-ui/core/Button";
import { Password } from "primereact/password";
import React, { Component } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import auth from "../../config/AuthHelper";
import http from "../../config/http";
import Profile from "../Profiles";
class ChangePassword extends Component {
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
      errorClass: {
        current_password: "",
        password: "",
        password_confirmation: "",
      },
      errors: {
        current_password: "",
        password: "",
        password_confirmation: "",
      },
      data: { current_password: "", password: "", password_confirmation: "" },
      fields: { current_password: "", password: "", password_confirmation: "" },
    };
  }

  validateForm = () => {
    let fields = this.state.fields;
    let errors = {};
    let errorClass = {};
    let formIsValid = true;
    if (!fields.current_password) {
      formIsValid = false;
      errors["current_password"] = "*Please enter your Current Password.";
      errorClass["current_password"] = "is-invalid";
    }
    if (!fields.password_confirmation) {
      formIsValid = false;
      errors["password_confirmation"] =
        "*Please enter your Confirmation Password.";
      errorClass["password_confirmation"] = "is-invalid";
    }
    if (!fields.password) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
      errorClass["password"] = "is-invalid";
    }
    this.setState({
      errors: errors,
      errorClass,
    });
    return formIsValid;
  };

  componentDidMount() {
    let stateNew = { ...this.state };
    stateNew.loader = true;
    this.setState(stateNew);
    setTimeout(() => {
      stateNew.loader = false;
      this.setState(stateNew);
    }, 3000);
  }

  updatePassword = () => {
    console.log(this.state.data);
    if (this.validateForm()) {
      if (this.state.outer_bar === true) {
        this.setState({ outer_bar: false });
      }
      this.setState({ loader: true });
      let formData = new FormData();
      formData.append("current_password", this.state.data.current_password);
      formData.append("password", this.state.data.password);
      formData.append(
        "password_confirmation",
        this.state.data.password_confirmation
      );
      http.post("auth/change-password", formData).then((response) => {
        if (response.code === 200) {
          let stateNew = { ...this.state };
          stateNew.outer_bar = true;
          stateNew.open = true;
          stateNew.loader = false;
          stateNew.value1 = "";
          stateNew.value2 = "";
          stateNew.value3 = "";
          stateNew.snackbar.message = response.data.message;
          stateNew.snackbar.status = "success";
          stateNew.displayPosition = false;
          auth.clearJWT();
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
          this.setState(stateNew);
        } else if (response.code === 422) {
          let stateNew = { ...this.state };
          stateNew.outer_bar = true;
          // stateNew.open = true;
          stateNew.loader = false;
          if (response.errors) {
            stateNew.errors = response.errors;
            stateNew.errorClass.current_password = response.errors
              .current_password
              ? "is-invalid"
              : "";
            stateNew.errorClass.password = response.errors.password
              ? "is-invalid"
              : "";
            stateNew.errorClass.password_confirmation = response.errors
              .password_confirmation
              ? "is-invalid"
              : "";
          }
          stateNew.snackbar.message = response.message;
          stateNew.snackbar.status = "error";
          this.setState(stateNew);
        } else if (response.code === 400) {
          let stateNew = { ...this.state };
          stateNew.outer_bar = true;
          stateNew.open = true;
          stateNew.loader = false;
          stateNew.snackbar.message = response.message;
          stateNew.snackbar.status = "error";
          this.setState(stateNew);
        }
      });
    } else {
    }
  };
  handleChange = (e) => {
    let stateNew = { ...this.state };
    stateNew.data[e.target.name] = e.target.value;
    stateNew.fields[e.target.name] = e.target.value;
    stateNew.errorClass[e.target.name] = "";
    stateNew.errors[e.target.name] = "";
    this.setState(stateNew);
  };
  render() {
    return (
      <React.Fragment>
        {this.state.loader && <Loader />}
        {this.state.outer_bar && (
          <Snackbar open={this.state.open} message={this.state.snackbar} />
        )}
        <div className="home_page">
          <div className="mx-5 mt-3" style={{ height: "100vh" }}>
            <div className="row">
              <div className="pr-0 col-lg-3 col-md-4">
                <Profile />
              </div>
              <div className="pr-0 col-lg-9 col-md-8">
                <div className="addProductForm">
                  <div className="p-4">
                    <h4 className="text-light">Change Password</h4>
                    <hr style={{ backgroundColor: "grey" }} />
                    <Row>
                      <Col>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label className="text-light">
                            Current Password
                          </Form.Label>
                          <Password
                            style={{ width: "100%" }}
                            value={this.state.value1}
                            onChange={this.handleChange}
                            name="current_password"
                            toggleMask
                          />
                          {this.state.errors.current_password && (
                            <p className="error-class-add-event">
                              {this.state.errors.current_password}
                            </p>
                          )}
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label className="text-light">
                            New Password
                          </Form.Label>
                          <Password
                            style={{ width: "100%" }}
                            value={this.state.value2}
                            onChange={this.handleChange}
                            name="password"
                            toggleMask
                          />
                          {this.state.errors.password && (
                            <p className="error-class-add-event">
                              {this.state.errors.password}
                            </p>
                          )}
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label className="text-light">
                            Confirm New Password
                          </Form.Label>
                          <Password
                            style={{ width: "100%" }}
                            value={this.state.value3}
                            onChange={this.handleChange}
                            name="password_confirmation"
                            toggleMask
                          />
                          {this.state.errors.password_confirmation && (
                            <p className="error-class-add-event">
                              {this.state.errors.password_confirmation}
                            </p>
                          )}
                        </Form.Group>
                        <Button
                          onClick={this.updatePassword}
                          variant="contained"
                          className="update-password-btn"
                        >
                          Update Password
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ChangePassword);
