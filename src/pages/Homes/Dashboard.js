import { Button } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import { Flag } from "@material-ui/icons";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Loader from "../../common/Loader/Loader";
import Table from "../../common/Tables/Table";
import auth from "../../config/AuthHelper";
import http from "../../config/http";
import { decode } from "../../config/utils";
import Profile from "../Profiles";
import { PREFIX } from "../../config/routes";

class Dashboard extends Component {
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

			resource: "events",
			columns: [
				{ field: "id", headerName: "ID", width: 10 },
				{ field: "name", headerName: "Tasting name", width: 170 },
				{ field: "date", headerName: "Date", width: 130 },
				{ field: "state", headerName: "City & State", width: 170 },
				{ field: "status", headerName: "Status", width: 100 },
			],
			data: [
				{
					id: 0,
					title: "My Tastings",
					subtitle: "View all tastings.",
					color: "#B8419C",
					link: "/my-events",
				},
				{
					id: 1,
					title: "Chat",
					subtitle: "Powerful way to communicate",
					color: "#10CA93",
					link: "/chats",
				},
				{
					id: 2,
					title: "",
					subtitle: "Total Wines",
					link: "/my-products",
					color: "#00AFEF",
				},
				{
					id: 3,
					title: "",
					subtitle: "Notes Feedback Report",
					color: "#457B9D",
					link: "/feedbacks",
				},
			],
			myproduct: [],
		};
	}

	componentWillMount() {
		const { user } = this.props.match.params;
		if (user) {
			const decodedUserId = parseInt(decode(user));
			if (decodedUserId !== auth.isAuthenticated().user.id) {
				let formData = new FormData();
				formData.append("token", localStorage.getItem("pushToken"));
				formData.append("topic", "user_id_" + auth.isAuthenticated().user.id);
				http.post("/auth/logout", formData).then(response => {
					if (response.code === 200) {
						auth.clearJWT();
						auth.clearFCM();
					}
				});
			}
			window.location.href = PREFIX;
		}
	}

	dataRefresh = () => {
		let stateNew = { ...this.state };
		this.setState(stateNew);
		http.get("supplier/products").then(response => {
			stateNew.myproduct = response.data.data.page.data;
			this.setState(stateNew);
		});
	};

	componentDidMount() {
		let stateNew = { ...this.state };
		stateNew.loader = true;
		this.setState(stateNew);
		http.get("supplier/products").then(response => {
			stateNew.myproduct = response.data.data.page.data;

			this.setState(stateNew);
		});

		http.get("supplier/home").then(response => {
			const { accessCode, accessUserCount, product_count, rating_count } =
				response.data.data;
			stateNew.data[2].title = product_count;
			stateNew.data[3].title = rating_count;
			stateNew.accessCode = accessCode;
			stateNew.accessUserCount = accessUserCount;
			stateNew.loader = false;
			this.setState(stateNew);
		});
	}
	editProduct = id => {
		// this.props.history.push("/edit-product/" + id);
		this.props.history.push("/product-detail/" + id);
	};
	redirect = url => {
		this.props.history.push(url);
	};

	onProductDetail = id => {
		this.props.history.push("/product-detail/" + id);
	};
	onHide = name => {
		this.setState({
			[`${name}`]: false,
		});
	};

	renderFooter(name) {
		return (
			<div>
				<Button
					variant="contained"
					onClick={() => this.onHide(name)}
					className="p-button-text"
				>
					No
				</Button>
				<Button
					variant="contained"
					onClick={() => this.deleteProduct()}
					autoFocus
					className="modal-delete-action"
				>
					Delete
				</Button>
			</div>
		);
	}

	deleteProduct = id => {
		if (this.state.outer_bar === true) {
			this.setState({ outer_bar: false });
		}
		this.setState({ loader: true });
		http
			.delete("supplier/products/" + this.state.position.id)
			.then(response => {
				if (response.code === 200) {
					let stateNew = { ...this.state };
					stateNew.outer_bar = true;
					stateNew.open = true;
					stateNew.loader = false;
					stateNew.deleteProductDialog = false;
					stateNew.snackbar.message = response.data.message;
					stateNew.snackbar.status = "success";
					stateNew.displayResponsive = false;
					this.setState(stateNew);
					this.dataRefresh();
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

	onDelete = (name, position) => {
		let state = {
			[`${name}`]: true,
		};

		if (position) {
			state = {
				...state,
				position,
			};
		}
		this.setState(state);
	};

	render() {
		return (
			<React.Fragment>
				{this.state.loader && <Loader />}
				<br></br>

				<div className="container">
					<div className="row">
						<div className="pr-0 col-md-3 profile-outer-card">
							<Profile />
						</div>
						<div className="col-md-9 widget-cards-div">
							<div className="container">
								<div className="row">
									{this.state.data.map((el, id) => {
										return (
											<div
												onClick={() => this.redirect(el.link)}
												key={el.id}
												className={
													id === 3
														? "col-md-2dot4 card-outer-div remove-card"
														: "col-md-2dot4 card-outer-div"
												}
											>
												<div key={el.id} className={"card-counter a" + id}>
													<p className="my-0 text-light main-title">
														{el.title}
													</p>
													<p className="my-0 text-light card-subtitle">
														{el.subtitle}
													</p>
												</div>
											</div>
										);
									})}
									<div className={"col-md-2dot4 card-outer-div"}>
										<div className={"card-counter a3"}>
											<p className="my-0 text-light main-title">Access Code</p>
											<p className="my-0 text-light card-subtitle">
												{this.state.accessCode}
											</p>
										</div>
									</div>
									<div className={"col-md-2dot4 card-outer-div"}>
										<div className={"card-counter a4"}>
											<p className="my-0 text-light main-title">Code Counter</p>
											<p className="my-0 text-light card-subtitle">
												{this.state.accessUserCount}
											</p>
										</div>
									</div>
									<div className="pr-0 col-md-12 main-table-outer-div">
										<Card className="dashboard-events-table">
											<Table
												resource={this.state.resource}
												columns={this.state.columns}
												tablename="Events"
											/>
										</Card>
									</div>
									<Divider />
									<div className="pr-0 col-md-12 main-after-table-card">
										<Card className="profile-card-dashboard-product">
											<CardContent>
												<h6 className="text-light">My Portfolio</h6>
												<div className="container">
													<div className="row">
														{this.state.myproduct.map((el, id) => {
															return (
																<React.Fragment>
																	<div
																		style={{ cursor: "default" }}
																		key={el.id}
																		className="col-md-4"
																	>
																		<Card
																			style={{ cursor: "default" }}
																			key={el.id}
																			className="dashboard-p-card"
																		>
																			<CardActionArea
																				style={{ cursor: "default" }}
																			>
																				{el.Imagesrc && (
																					<img
																						src={el.Imagesrc}
																						className="py-1 product-image-dashboard"
																						alt="wineimage"
																					/>
																				)}
																				{!el.Imagesrc && (
																					<img
																						src="https://www.vinoted-admin.com/images/no-image.png"
																						className="py-1 product-image-dashboard"
																						alt="wineimage"
																					/>
																				)}
																				<CardContent>
																					<Typography
																						className="dashboard-pname"
																						gutterBottom
																						variant="h5"
																						component="h2"
																					>
																						{el.title}&nbsp;&nbsp;
																						<Chip
																							className="product-type-dash"
																							label={el.type}
																							color="secondary"
																						/>
																					</Typography>
																					{/* <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                            className="dashboard-desc"
                                            id="pdesc"
                                          >
                                            {ReactHtmlParser(el.description)}
                                          </Typography> */}
																					<Typography
																						variant="body2"
																						color="textSecondary"
																						component="p"
																						className="dashboard-desc"
																					>
																						<Flag /> {el.country}
																					</Typography>
																					<br></br>
																					<Button
																						className="dash-edit-action"
																						variant="contained"
																						onClick={() =>
																							this.editProduct(el.id)
																						}
																					>
																						Edit
																					</Button>
																					&nbsp;&nbsp;&nbsp;
																					<Button
																						className="dash-delete-action"
																						variant="contained"
																						onClick={() =>
																							this.onDelete(
																								"displayResponsive",
																								el
																							)
																						}
																					>
																						Delete
																					</Button>
																				</CardContent>
																				<div className="container">
																					<div className="row"></div>
																				</div>
																			</CardActionArea>
																		</Card>
																	</div>
																</React.Fragment>
															);
														})}
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
									<Dialog
										header="Delete Confirmation"
										visible={this.state.displayResponsive}
										onHide={() => this.onHide("displayResponsive")}
										breakpoints={{ "960px": "75vw" }}
										style={{ width: "50vw" }}
										footer={this.renderFooter("displayResponsive")}
									>
										<p>Are you sure you want to delete this Wine?</p>
									</Dialog>
									<Divider />
									<Divider />
									<Divider />
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	user: state.root.user,
});

export default connect(mapStateToProps, null)(withRouter(Dashboard));
