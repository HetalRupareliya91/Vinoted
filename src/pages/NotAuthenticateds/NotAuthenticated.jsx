import Button from "@material-ui/core/Button";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import auth from "../../config/AuthHelper";
class NotAuthenticated extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  login = () => {
    this.props.history.push("/");
  };

  componentDidMount() {
    let counter = 4;
    if (auth.isAuthenticated()) {
      this.setState({ authDiv: true });
    } else {
      setInterval(() => {
        counter = counter - 1;
        if (this.state.counter <= 1) {
          this.props.history.push("/");
        } else {
          this.setState({ counter, authDiv: false });
        }
      }, 1000);
    }

    this.counter();

    var loop1,
      loop2,
      loop3,
      time = 30,
      i = 0,
      number,
      selector3 = document.querySelector(".thirdDigit"),
      selector2 = document.querySelector(".secondDigit"),
      selector1 = document.querySelector(".firstDigit");
    loop3 = setInterval(function () {
      "use strict";
      if (i > 40) {
        clearInterval(loop3);
        selector3.textContent = 4;
      } else {
        selector3.textContent = Math.random() * 9;
        i++;
      }
    }, time);
    loop2 = setInterval(function () {
      "use strict";
      if (i > 80) {
        clearInterval(loop2);
        selector2.textContent = 0;
      } else {
        selector2.textContent = Math.random() * 9;
        i++;
      }
    }, time);
    loop1 = setInterval(function () {
      "use strict";
      if (i > 100) {
        clearInterval(loop1);
        selector1.textContent = 1;
      } else {
        selector1.textContent = Math.random() * 9;
        i++;
      }
    }, time);
  }

  counter = () => {
    "use strict";
    return Math.floor(Math.random() * 9) + 1;
  };
  render() {
    return (
      <React.Fragment>
        {!this.state.authDiv && (
          <div class="error">
            <div class="container-floud">
              <div class="col-xs-12 ground-color text-center">
                <div class="container-error-404">
                  <div class="clip">
                    <div class="shadow">
                      <span class="digit thirdDigit"></span>
                    </div>
                  </div>
                  <div class="clip">
                    <div class="shadow">
                      <span class="digit secondDigit"></span>
                    </div>
                  </div>
                  <div class="clip">
                    <div class="shadow">
                      <span class="digit firstDigit"></span>
                    </div>
                  </div>
                  <div class="msg">
                    OH!<span class="triangle"></span>
                  </div>
                </div>
                <h2 class="h1">Sorry! You are not Logged in</h2>
                <h3>Redirecting in ...&nbsp;{this.state.counter}</h3>

                <Button onClick={this.login} variant="contained">
                  Login Back
                </Button>
              </div>
            </div>
          </div>
        )}
        {this.state.authDiv && (
          <section class="page_404">
            <div class="container">
              <div class="row">
                <div class="col-sm-12 ">
                  <div class="col-sm-10 col-sm-offset-1  text-center">
                    <div class="four_zero_four_bg">
                      <h1 class="text-center ">404</h1>
                    </div>

                    <div class="contant_box_404">
                      <h3 class="h2">Look like you're lost</h3>

                      <p>the page you are looking for not available!</p>

                      <Link to="/" class="link_404">
                        Go to Home
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(NotAuthenticated);
