import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { addUser } from "../../actions/addUser";
import Logo2 from "../../assets/img/logo(2).png";
import mainImg from "../../assets/img/winery_login.png";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
// import checkAuth from "../../config/authenticate";
import auth from "../../config/AuthHelper";
import http from "../../config/http";
import { PREFIX } from "../../config/routes";
import store from "../../store";
import Uploadcsv from "../CsvFile/Uploadcsv";

class AuthLogin extends Component {
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
				type: "Supplier",
			},
			errors: {
				email: "",
				password: "",
			},
			errorClass: {
				email: "",
				password: "",
			},
			fields: {},
		};
	}

	componentDidMount() {
		// checkAuth.check_user();
		let stateNew = { ...this.state };
		stateNew.loader = true;
		this.setState(stateNew);
		setTimeout(() => {
			stateNew.loader = false;
			this.setState(stateNew);
		}, 2000);
	}
	handleChange = (e) => {
		let stateNew = { ...this.state };
		stateNew.user[e.target.name] = e.target.value;
		stateNew.errorClass[e.target.name] = "";
		stateNew.errors[e.target.name] = "";
		this.setState(stateNew);
	};

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

			http.post("auth/login", formData).then((response) => {
				if (response.code === 200) {
					let stateNew = { ...this.state };
					stateNew.outer_bar = true;
					stateNew.open = true;
					stateNew.loader = false;
					stateNew.snackbar.message = response.data.message;
					stateNew.snackbar.status = "success";
					this.setState(stateNew);
					store.dispatch(addUser(response.data.data));
					auth.authenticate(response.data.data);

					if (auth.isAuthenticated().user.email_verified_at) {
						window.location.href = PREFIX;
					} else {
						this.props.history.push("/verify-email");
					}
				} else if (response.code === 422) {
					if (this.state.open === true) {
						this.setState({ open: false });
					}
					let stateNew = { ...this.state };
					stateNew.outer_bar = true;
					stateNew.loader = false;
					if (response.errors) {
						stateNew.errors = response.errors;
						stateNew.errorClass.email = response.errors.email
							? "is-invalid"
							: "";
						stateNew.errorClass.password = response.errors.password
							? "is-invalid"
							: "";
					}
					stateNew.snackbar.message = response.message;
					stateNew.snackbar.status = "error";
					this.setState(stateNew);
				} else if (response.code === 426) {
					let stateNew = { ...this.state };
					stateNew.outer_bar = true;
					stateNew.open = true;
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
				} else if (response.code === 401) {
					let stateNew = { ...this.state };
					stateNew.outer_bar = true;
					stateNew.open = true;
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
									<div className="card-body">
										<div className="brand-wrapper">
											<img src={Logo2} alt="logo" className="logo" />
										</div>
										<p className="login-card-description">Welcome back!</p>
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
											<div className="mb-4 form-group">
												<label
													htmlFor="password"
													className="form-control-label"
												>
													Password
												</label>
												<input
													type="password"
													name="password"
													id="password"
													className={
														"form-control " + this.state.errorClass.password
													}
													placeholder="***********"
													onChange={this.handleChange}
												/>
												{this.state.errors.password && (
													<p className="error-class">
														{this.state.errors.password}
													</p>
												)}
											</div>
											<div className="mb-4 form-group forgot-password-div">
												<Link
													to="/forget-password"
													className="forgot-password-link"
												>
													Forgot password?
												</Link>
											</div>
											<input
												name="login"
												id="login"
												className="mb-4 btn btn-block login-btn"
												type="button"
												value="Login"
												onClick={this.login}
											/>
											<div className="form-group or-div">
												<p>Or</p>
											</div>
											<div className="mb-4 form-group extra-div">
												<p>
													Need an account!!
													<Link to="/sign-up">
														<span className="click-here">
															&nbsp;Register here
														</span>
													</Link>
												</p>
											</div>
										</form>
									</div>
								</div>
								<div></div>
							</div>
						</div>
					</div>
				</main>
			</React.Fragment>
		);
	}
}

export default withRouter(AuthLogin);
