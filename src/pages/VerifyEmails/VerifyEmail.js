import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Logo2 from "../../assets/img/logo(2).png";
import mainImg from "../../assets/img/winery_login.png";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import auth from "../../config/AuthHelper";
import http from "../../config/http";
import { PREFIX } from "../../config/routes";
class VerifyEmail extends Component {
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
				otp: "",
			},
			errors: {
				otp: "",
			},
			errorClass: {
				otp: "",
			},
			fields: {},
		};
	}

	validateForm = () => {
		let fields = this.state.user;
		let errors = {};
		let errorClass = {};
		let formIsValid = true;
		if (!fields.otp) {
			formIsValid = false;
			errors["otp"] = "*Please enter your OTP.";
			errorClass["otp"] = "is-invalid";
		}

		this.setState({
			errors: errors,
			errorClass,
		});
		return formIsValid;
	};

	componentDidMount() {
		if (
			auth.isAuthenticated() &&
			typeof auth.isAuthenticated().user.email_verified_at !== "object"
		)
			window.location.href = PREFIX;
		else {
			let stateNew = { ...this.state };
			stateNew.loader = true;
			this.setState(stateNew);
			setTimeout(() => {
				stateNew.loader = false;
				this.setState(stateNew);
			}, 4000);
		}
	}
	handleChange = (e) => {
		let stateNew = { ...this.state };
		stateNew.user[e.target.name] = e.target.value;
		stateNew.errorClass[e.target.name] = "";
		stateNew.errors[e.target.name] = "";
		this.setState(stateNew);
	};

	// componentWillMount() {
	// 	if (!auth.isAuthenticated()) {
	// 		window.location.href = "/sign-up";
	// 	} else {
	// 	}
	// }

	verifyEmail = () => {
		if (this.validateForm()) {
			if (this.state.outer_bar === true) {
				this.setState({ outer_bar: false });
			}
			this.setState({ loader: true });
			let formData = new FormData();
			formData.append("otp", this.state.user.otp);
			http.post("auth/verify-email", formData).then((response) => {
				if (response.code === 200) {
					let stateNew = { ...this.state };
					stateNew.outer_bar = true;
					stateNew.open = true;
					stateNew.loader = false;
					stateNew.snackbar.message = response.data.message;
					stateNew.snackbar.status = "success";
					stateNew.user.otp = "";
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
						stateNew.errorClass.otp = response.errors.otp ? "is-invalid" : "";
					}
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

	resendOTP = () => {
		if (this.state.outer_bar === true) {
			this.setState({ outer_bar: false });
		}
		this.setState({ loader: true });
		let formData = new FormData();
		formData.append("email", auth.isAuthenticated().user.email);
		http.post("auth/resend/otp", formData).then((response) => {
			if (response.code === 200) {
				let stateNew = { ...this.state };
				stateNew.outer_bar = true;
				stateNew.open = true;
				stateNew.loader = false;
				stateNew.snackbar.message = response.data.message;
				stateNew.snackbar.status = "success";
				stateNew.user.otp = "";
				this.setState(stateNew);
			} else if (response.code === 422) {
				let stateNew = { ...this.state };
				stateNew.outer_bar = true;
				// stateNew.open = true;
				stateNew.loader = false;
				if (response.errors) {
					stateNew.errors = response.errors;
					stateNew.errorClass.otp = response.errors.otp ? "is-invalid" : "";
				}
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
			} else if (response.code === 400) {
				let stateNew = { ...this.state };
				stateNew.outer_bar = true;
				stateNew.open = true;
				stateNew.loader = false;
				stateNew.snackbar.message = response.message;
				stateNew.snackbar.status = "error";
				this.setState(stateNew);
			} else {
				let stateNew = { ...this.state };
				stateNew.outer_bar = true;
				stateNew.open = true;
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
											Email Verification
										</p>
										<p>
											Please enter the 6 digit code sent to<br></br>
											<span className="email-verify-text">
												{this.state.user.email ? this.state.user.email : ""}
											</span>
											{/* <span className="email-verify-text">ac88@gmail.com</span> */}
										</p>
										<form action="#!">
											<div className="form-group">
												<label htmlFor="otp" className="form-control-label">
													otp
												</label>
												<input
													type="otp"
													name="otp"
													id="otp"
													className={
														"form-control " + this.state.errorClass.otp
													}
													placeholder="123456"
													onChange={this.handleChange}
												/>
												{this.state.errors.otp && (
													<p className="error-class">{this.state.errors.otp}</p>
												)}
											</div>

											<div className="mb-4 form-group forgot-password-div">
												<a
													onClick={this.resendOTP}
													className="forgot-password-link"
												>
													Resend OTP
												</a>
											</div>
											<input
												name="login"
												id="login"
												className="mb-4 btn btn-block login-btn"
												type="button"
												value="Submit"
												onClick={this.verifyEmail}
											/>
										</form>
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

export default withRouter(VerifyEmail);
