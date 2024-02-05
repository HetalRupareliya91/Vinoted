import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import React, { Component } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaEdit, FaThList, FaUserEdit, FaTrash } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { withRouter } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import http from "../../config/http";
import Profile from "../Profiles";
class MyEvents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			myEvents: [],
			displayResponsive: false,
			deleteData: {},
			loader: false,
			basicFirst: "",
			basicRows: "",

			totalRecords: "",
			outer_bar: false,
			open: false,
			snackbar: {
				message: "",
				status: "",
			},
		};
	}

	callback(key) {
		console.log(key);
	}

	dataRefresh = () => {
		let stateNew = { ...this.state };
		stateNew.loader = true;
		this.setState(stateNew);
		http.get("supplier/events?page=0").then((response) => {
			stateNew.myEvents = response.data.data.page.data;
			stateNew.totalRecords = response.data.data.page.total;
			stateNew.basicFirst = response.data.data.page.current_page;
			stateNew.basicRows = response.data.data.page.per_page;
			stateNew.loader = false;
			this.setState(stateNew);
		});
	};

	componentDidMount() {
		this.dataRefresh();
	}

	onHide = (name) => {
		this.setState({
			[`${name}`]: false,
		});
	};

	deleteEvent = () => {
		if (this.state.outer_bar === true) {
			this.setState({ outer_bar: false });
		}
		this.setState({ loader: true });
		http
			.delete("supplier/events/" + this.state.position.id)
			.then((response) => {
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
				}
			});
	};

	editEvent = (data) => {
		this.props.history.push({
			pathname: "/event-details/" + data.id,
			state: { eventData: data },
		});
	};

	eventChange = (event) => {
		let $ = require("jquery");
		if (event === "presentevents") {
			$("#presentevents").addClass("presentevents-event-class");
			$("#futureevents").removeClass("futureevents-event-class");
			$("#pastevents").removeClass("pastevents-event-class");
		}
		if (event === "futureevents") {
			$("#futureevents").addClass("futureevents-event-class");
			$("#presentevents").removeClass("presentevents-event-class");
			$("#pastevents").removeClass("pastevents-event-class");
		}
		if (event === "pastevents") {
			$("#pastevents").addClass("pastevents-event-class");
			$("#presentevents").removeClass("presentevents-event-class");
			$("#futureevents").removeClass("futureevents-event-class");
		}

		let stateNew = { ...this.state };
		stateNew.loader = true;
		this.setState(stateNew);
		http.get("supplier/events?type=" + event).then((response) => {
			stateNew.myEvents = response.data.data.page.data;
			stateNew.loader = false;
			this.setState(stateNew);
		});
	};

	onClick(name, position) {
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
	}

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
					onClick={() => this.deleteEvent()}
					autoFocus
					className="modal-delete-action"
				>
					Delete
				</Button>
			</div>
		);
	}

	onBasicPageChange = (event) => {
		let stateNew = { ...this.state };
		let page = event.page;
		page = page + 1;
		stateNew.loader = true;
		this.setState(stateNew);
		http.get("supplier/events?page=" + page).then((response) => {
			stateNew.totalRecords = response.data.data.page.total;
			stateNew.basicFirst = response.data.data.page.current_page;
			stateNew.basicRows = response.data.data.page.per_page;
			stateNew.myEvents = response.data.data.page.data;
			stateNew.loader = false;
			this.setState(stateNew);
		});
	};

	newEvent = () => {
		this.props.history.push("/new-event");
	};

	eventSearch = (e) => {
		let stateNew = { ...this.state };
		stateNew.loader = true;
		this.setState(stateNew);
		http.get("supplier/events?search=" + e.target.value).then((response) => {
			stateNew.myEvents = response.data.data.page.data;
			stateNew.loader = false;
			this.setState(stateNew);
		});
	};

	sommList = (data) => {
		localStorage.setItem("en", data.name);
		this.props.history.push("/event-sommelier-list?event_id=" + data.id);
	};

	render() {
		// const { key } = this.state;

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
						<div className="pr-0 col-md-8">
							<div className="row">
								<div className="col-md-2">
									<h5 style={{ color: "white" }}>My Tastings</h5>
								</div>

								<div className="col-md-10">
									<div className="p-grid p-fluid">
										<div className="p-md-4">
											<div className="p-inputgroup">
												<span className="p-input-icon-right">
													<i className="pi pi-search" />
													<InputText
														className="search-bar-events"
														placeholder="Search"
														onChange={this.eventSearch}
													/>
												</span>
											</div>
										</div>

										<div className="col-md-4 button-group-outer-div">
											<ButtonGroup
												variant="contained"
												color="primary"
												aria-label="contained primary button group"
												className="event-group"
											>
												<Button
													id="presentevents"
													onClick={(event) => this.eventChange("presentevents")}
												>
													Current Tastings
												</Button>
												<Button
													id="futureevents"
													onClick={(event) => this.eventChange("futureevents")}
												>
													Upcoming Tastings
												</Button>
												<Button
													id="pastevents"
													onClick={(event) => this.eventChange("pastevents")}
												>
													Past Tastings
												</Button>

												<Button
													className="new-event-action"
													variant="contained"
													onClick={this.newEvent}
												>
													Add Tasting
												</Button>
											</ButtonGroup>
										</div>
									</div>
								</div>
								<Dialog
									header="Delete Confirmation"
									visible={this.state.displayResponsive}
									onHide={() => this.onHide("displayResponsive")}
									breakpoints={{ "960px": "75vw" }}
									style={{ width: "50vw" }}
									footer={this.renderFooter("displayResponsive")}
								>
									<p>Are you sure you want to delete this Event?</p>
								</Dialog>
								<div className="col-md-12">
									<div className="row">
										{this.state.myEvents.length > 0 && (
											<React.Fragment>
												{this.state.myEvents.map((el, index) => {
													return (
														<div key={index} className="mt-4 col-md-4">
															<Card
																title={el.name}
																footer={
																	<span
																		style={{
																			display: "flex",
																			flexFlow: "row wrap",
																			justifyContent: "space-evenly",
																		}}
																	>
																		<Tooltip title="Edit" aria-label="add">
																			<FaUserEdit
																				style={{ marginLeft: 0 }}
																				className="card-save-action"
																				onClick={() => this.editEvent(el)}
																			/>
																		</Tooltip>
																		<Tooltip title="Delete" aria-label="add">
																			<FaTrash
																				style={{ marginLeft: 0 }}
																				className="card-delete-action"
																				onClick={() =>
																					this.onClick("displayResponsive", el)
																				}
																			/>
																		</Tooltip>
																		<Tooltip title="List" aria-label="add">
																			<FaThList
																				style={{ marginLeft: 0 }}
																				className="card-list-action "
																				onClick={() => this.sommList(el)}
																			/>
																		</Tooltip>
																		<Tooltip title="Delete" aria-label="add">
																			<FaEdit
																				style={{ marginLeft: 0 }}
																				className="card-delete-action"
																				onClick={() =>
																					this.props.history.push(
																						`/edit/event/product-order/${el.id}`
																					)
																				}
																			/>
																		</Tooltip>
																	</span>
																}
																header={
																	<React.Fragment>
																		{el.Imagesrc && (
																			<img
																				alt="test1"
																				variant="top"
																				src={el.Imagesrc}
																				className="event-images"
																			/>
																		)}
																		{!el.Imagesrc && (
																			<img
																				alt="testw2"
																				variant="top"
																				src="https://www.thewinetobuy.com/wp-content/uploads/2016/06/dummy-wine-bottle.jpg"
																				className="event-images"
																			/>
																		)}
																	</React.Fragment>
																}
															>
																<p className="my-0  event font-weight-light">
																	<MdDateRange className="text-danger" />
																	&nbsp;
																	{el.date.split(" ")[0]}
																	<AiOutlineClockCircle className="ml-2 text-danger" />{" "}
																	&nbsp;
																	{el.date.split(" ")[1]}
																</p>

																<p
																	className="p-m-0 event-second-paragraph"
																	style={{
																		lineHeight: "1.5",
																	}}
																>
																	{el.country_name} |
																	<span className="text-success">
																		&nbsp;{el.status}
																	</span>
																</p>
																<br></br>
																<hr className="hr-line"></hr>
															</Card>
														</div>
													);
												})}
											</React.Fragment>
										)}
										{this.state.myEvents.length === 0 && (
											<React.Fragment>
												<div className="container not-found">
													<div className="row">
														<div class="fof">
															<h1>No tastings Found</h1>
														</div>
													</div>
												</div>
											</React.Fragment>
										)}
									</div>
								</div>
								<div className="container pagination-class-global">
									<div className="row">
										<br></br>
										<Paginator
											className="event-pagination-class"
											first={this.state.basicFirst - 1}
											rows={this.state.basicRows}
											totalRecords={this.state.totalRecords}
											onPageChange={this.onBasicPageChange}
										></Paginator>
									</div>
								</div>

								<br></br>
							</div>
						</div>
					</div>
				</div>
				<br></br>
			</React.Fragment>
		);
	}
}

export default withRouter(MyEvents);
