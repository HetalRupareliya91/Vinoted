import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Logo2 from "../../assets/img/logo(2).png";
import mainImg from "../../assets/img/winery_login.png";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import auth from "../../config/AuthHelper";
import http from "../../config/http";
import { PREFIX } from "../../config/routes";

class Signup extends Component {
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
				password: "",
				password_confirmation: "",
				first_name: "",
				// last_name: "",
			},
			errors: {
				email: "",
				password: "",
				password_confirmation: "",
				first_name: "",
				// last_name: "",
			},
			errorClass: {
				email: "",
				password: "",
				password_confirmation: "",
				first_name: "",
				// last_name: "",
			},
			fields: {},
		};
	}
	validateForm = () => {
		let fields = this.state.user;
		let errors = {};
		let errorClass = {};
		let formIsValid = true;
		if (!fields.first_name) {
			formIsValid = false;
			errors["first_name"] = "*Please enter your First Name.";
			errorClass["first_name"] = "is-invalid";
		}
		// if (!fields.last_name) {
		//   formIsValid = false;
		//   errors["last_name"] = "*Please enter your Last Name.";
		//   errorClass["last_name"] = "is-invalid";
		// }
		if (!fields.email) {
			formIsValid = false;
			errors["email"] = "*Please enter your Email.";
			errorClass["email"] = "is-invalid";
		}
		if (!fields.password || fields.password.length < 8) {
			formIsValid = false;
			errors["password"] =
				"*Please enter a password with 8 or more characters.";
			errorClass["password"] = "is-invalid";
		}
		if (!fields.password_confirmation) {
			formIsValid = false;
			errors["password_confirmation"] = "*Please enter your Confirm Password.";
			errorClass["password_confirmation"] = "is-invalid";
		}
		if (fields.password !== fields.password_confirmation) {
			formIsValid = false;
			errors["password"] = "Password confirmation does not match.";
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
		const sessionDetails = JSON.parse(
			sessionStorage.getItem("vinoted_new_user_details")
		);
		if (sessionDetails) stateNew.user = sessionDetails;
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

	signup = () => {
		if (this.validateForm()) {
			if (this.state.outer_bar === true) this.setState({ outer_bar: false });
			sessionStorage.setItem(
				"vinoted_new_user_details",
				JSON.stringify(this.state.user)
			);
			//this.props.history.push("/subscribe");
		
			this.setState({ loader: true });
			let formData = new FormData();
			for (const [key, value] of Object.entries(this.state.user)) {
				formData.append(key, value);
			}
			console.log(this.state.user);
			http.post("supplier/signup", formData).then((response) => {
				if (response.code === 201) {
					let stateNew = { ...this.state };
					stateNew.outer_bar = true;
					stateNew.open = true;
					stateNew.loader = false;
					stateNew.snackbar.message = response.data.message;
					stateNew.snackbar.status = "success";
					this.setState(stateNew);
					auth.authenticate(response.data.data);
					debugger
					setTimeout(() => {
						//window.location.href = PREFIX;
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
						stateNew.errorClass.password = response.errors.password
							? "is-invalid"
							: "";
						stateNew.errorClass.password_confirmation = response.errors
							.password_confirmation
							? "is-invalid"
							: "";
						stateNew.errorClass.first_name = response.errors.first_name
							? "is-invalid"
							: "";
						stateNew.errorClass.last_name = response.errors.last_name
							? "is-invalid"
							: "";
					}
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
					stateNew.displayPosition = false;
					this.setState(stateNew);
				}
			});
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
									<div className="card-body signup-body">
										<div className="brand-wrapper">
											<img src={Logo2} alt="logo" className="logo" />
										</div>
										<p className="login-card-description signup-desc">
											Create your account!!
										</p>
										<form action="#!">
											<div className="row">
												<div className="form-group col-6">
													<label htmlFor="email" className="form-control-label">
														Company Name
													</label>
													<input
														defaultValue={this.state.user.first_name}
														type="text"
														name="first_name"
														id="first_name"
														className={
															"form-control " + this.state.errorClass.first_name
														}
														placeholder="David"
														onChange={this.handleChange}
													/>
													{this.state.errors.first_name && (
														<p className="error-class">
															{this.state.errors.first_name}
														</p>
													)}
												</div>
												{/* <div className="form-group col-6">
                          <label htmlFor="email" className="form-control-label">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            className={
                              "form-control " + this.state.errorClass.last_name
                            }
                            placeholder="Bake"
                            onChange={this.handleChange}
                          />
                          {this.state.errors.last_name && (
                            <p className="error-class">
                              {this.state.errors.last_name}
                            </p>
                          )}
                        </div> */}
												<div className="form-group col-6">
													<label htmlFor="email" className="form-control-label">
														Email Address
													</label>
													<input
														defaultValue={this.state.user.email}
														type="text"
														name="email"
														id="email"
														className={
															"form-control " + this.state.errorClass.email
														}
														placeholder="davidbake@gmail.com"
														onChange={this.handleChange}
													/>
													{this.state.errors.email && (
														<p className="error-class">
															{this.state.errors.email}
														</p>
													)}
												</div>
											</div>

											<div className="row">
												<div className="form-group col-6">
													<label htmlFor="email" className="form-control-label">
														Password
													</label>
													<input
														type="password"
														name="password"
														id="password"
														className={
															"form-control " + this.state.errorClass.password
														}
														placeholder="*********"
														onChange={this.handleChange}
													/>
													{this.state.errors.password && (
														<p className="error-class">
															{this.state.errors.password}
														</p>
													)}
												</div>
												<div className="form-group col-6">
													<label htmlFor="email" className="form-control-label">
														Confirm Password
													</label>
													<input
														type="password"
														name="password_confirmation"
														id="password_confirmation"
														className={
															"form-control " +
															this.state.errorClass.password_confirmation
														}
														placeholder="**********"
														onChange={this.handleChange}
													/>
													{this.state.errors.password_confirmation && (
														<p className="error-class">
															{this.state.errors.password_confirmation}
														</p>
													)}
												</div>
											</div>
											<input
												name="login"
												id="login"
												className="mb-4 btn btn-block login-btn"
												type="button"
												value="Register"
												onClick={this.signup}
											/>
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

export default withRouter(Signup);
