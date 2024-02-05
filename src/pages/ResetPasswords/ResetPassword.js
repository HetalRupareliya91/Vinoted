import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../../Assets/logo(1).png";
import Logo2 from "../../Assets/logo(2).png";
import "./Resetpassword.css";

class Resetpassword extends Component {
  render() {
    return (
      <div>
        <div className="signup_page row m-0" style={{ height: "100%" }}>
          <div className="col-lg-7 col-md-7 titlesection">
            <img
              src={Logo}
              width="300"
              className="logoimage"
              alt="logo_image.png"
            />
          </div>

          <div className="col-lg-5 col-md-5">
            <div className="resetpasswordform">
              {/* <h2 className='py-4'>vnoted</h2> */}
              <img src={Logo2} className="py-4" alt="logo1_img" />

              <h3 className="py-3">Reset Password</h3>
              <Form className="formcontrol" style={{ paddingBottom: "157px" }}>
                <div className="col-12 input-effect">
                  <input className="effect-16" type="password" placeholder="" />
                  <label className="fontfamily">New Password</label>
                  <span className="focus-border"></span>
                </div>

                <div className="col-12 input-effect">
                  <input className="effect-16" type="password" placeholder="" />
                  <label className="fontfamily">Confirm Password</label>
                  <span className="focus-border"></span>
                </div>

                <button className="rounded-pill fontfamily py-2 my-2 submitbtn">
                  Save Password
                </button>
                <div className="text-center text-muted">or</div>
                <div
                  className="text-danger text-center"
                  style={{ paddingTop: "5px" }}
                >
                  <p>
                    I am already a member !! <Link to="./"> Click here</Link>
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Resetpassword;
