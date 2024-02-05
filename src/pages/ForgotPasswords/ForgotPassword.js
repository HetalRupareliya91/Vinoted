import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Logo2 from "../../assets/img/logo(2).png";
import mainImg from "../../assets/img/winery_login.png";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import http from "../../config/http";
class ForgotPassword extends Component {
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

      user: {
        email: "",
        type: "Supplier",
      },
      errors: {
        email: "",
      },
      errorClass: {
        email: "",
      },
      fields: {},
    };
  }

  validateForm = () => {
    let fields = this.state.user;
    let errors = {};
    let errorClass = {};
    let formIsValid = true;
    if (!fields.email) {
      formIsValid = false;
      errors["email"] = "*Please enter your Email.";
      errorClass["email"] = "is-invalid";
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
    }, 4000);
  }
  handleChange = (e) => {
    let stateNew = { ...this.state };
    stateNew.user[e.target.name] = e.target.value;
    stateNew.errorClass[e.target.name] = "";
    stateNew.errors[e.target.name] = "";
    this.setState(stateNew);
  };

  login = () => {
    if (this.validateForm()) {
      if (this.state.outer_bar === true) {
        this.setState({ outer_bar: false });
      }
      this.setState({ loader: true });
      let formData = new FormData();
      for (const [key, value] of Object.entries(this.state.user)) {
        formData.append(key, value);
      }
      http.post("auth/forgot-password", formData)
        .then((response) => {
          if (response.code === 200) {
            let stateNew = { ...this.state };
            stateNew.outer_bar = true;
            stateNew.open = true;
            stateNew.loader = false;

            stateNew.snackbar.message = response.data.message;
            stateNew.snackbar.status = "success";
            stateNew.user.email = "";
            this.setState(stateNew);
            setTimeout(() => {
              this.props.history.push("/");
            }, 2000);
          } else if (response.code === 422) {
            let stateNew = { ...this.state };
            stateNew.outer_bar = true;
            // stateNew.open = true;
            stateNew.loader = false;
            if (response.errors) {
              stateNew.errors = response.errors;
              stateNew.errorClass.email = response.errors.email
                ? "is-invalid"
                : "";
            }
            stateNew.snackbar.message = response.message;
            stateNew.snackbar.status = "error";
            this.setState(stateNew);
          } else if (response.code === 400) {
            console.log(response);
            let stateNew = { ...this.state };
            stateNew.outer_bar = true;
            stateNew.open = true;
            stateNew.loader = false;
            stateNew.snackbar.message = response.message;
            stateNew.snackbar.status = "error";
            this.setState(stateNew);
          } else if (response.code === 401) {
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

  render() {
    return (
      <React.Fragment>
        {this.state.loader && <Loader />}
        {this.state.outer_bar && (
          <Snackbar open={this.state.open} message={this.state.snackbar} />
        )}

        <main className="py-3 d-flex align-items-center min-vh-100 py-md-0">
          <div className="container">
            <div className="card login-card">
              <div className="row no-gutters">
                <div className="col-md-6">
                  <img
                    src={mainImg}
                    alt="login"
                    className="login-card-img titlesection"
                  />
                </div>
                <div className="col-md-6">
                  <div className="card-body forgot-pass">
                    <div className="brand-wrapper">
                      <img src={Logo2} alt="logo" className="logo" />
                    </div>

                    <p className="login-card-description for-pass">
                      Forgot Password
                    </p>
                    <form action="#!">
                      <div className="form-group">
                        <label htmlFor="email" className="form-control-label">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className={
                            "form-control " + this.state.errorClass.email
                          }
                          placeholder="example@gmail.com"
                          onChange={this.handleChange}
                        />
                        {this.state.errors.email && (
                          <p className="error-class">
                            {this.state.errors.email}
                          </p>
                        )}
                      </div>
                      <br></br>
                      <br></br>
                      <input
                        name="login"
                        id="login"
                        className="mb-4 btn btn-block login-btn"
                        type="button"
                        value="Submit"
                        onClick={this.login}
                      />
                    </form>
                    <div className="form-group or-div">
                      <p>Or</p>
                    </div>
                    <div className="mb-4 form-group extra-div">
                      <p>
                        I am already a member!!
                        <Link to="/">
                          <span className="click-here">&nbsp;Click here</span>
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(ForgotPassword);
