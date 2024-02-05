import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import auth from "../../config/AuthHelper";
class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  login = () => {
    this.props.history.push("login");
  };

  componentDidMount() {
    let counter = 4;
    if (auth.isAuthenticated()) {
      this.props.history.push("/not-found");
    } else {
      setInterval(() => {
        counter = counter - 1;
        if (this.state.counter <= 1) {
          this.props.history.push("login");
        } else {
          this.setState({ counter });
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
              <h2 class="h1">Sorry! This page is not found</h2>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(NotFound);
