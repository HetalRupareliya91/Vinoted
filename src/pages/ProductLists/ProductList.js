import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import http from "../../config/http";
import Uploadcsv from "../CsvFile/Uploadcsv";
import Profile from "../Profiles";
class ProductList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			myProducts: [],
			dummy: [],
			basicFirst: "",
			// basicFirst: "",
			basicRows: "",
			sort: "ASC",
			totalRecords: "",
			loader: false,
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

	editProduct = id => {
		this.props.history.push("/edit-product/" + id);
	};

	dataRefresh = () => {
		let stateNew = { ...this.state };
		stateNew.loader = true;
		this.setState(stateNew);
		http.get("supplier/products").then(response => {
			stateNew.totalRecords = response.data.data.page.total;
			stateNew.basicFirst = response.data.data.page.current_page;
			stateNew.basicRows = response.data.data.page.per_page;
			stateNew.myProducts = response.data.data.page.data;
			stateNew.loader = false;
			this.setState(stateNew);
		});
	};

	componentDidMount() {
		let stateNew = { ...this.state };
		stateNew.loader = true;
		this.setState(stateNew);
		http.get("supplier/products?page=0").then(response => {
			stateNew.totalRecords = response.data.data.page.total;
			stateNew.basicFirst = response.data.data.page.current_page;
			stateNew.basicRows = response.data.data.page.per_page;
			stateNew.myProducts = response.data.data.page.data;
			stateNew.loader = false;
			this.setState(stateNew);
		});
	}

	productChange = event => {
		let $ = require("jquery");
		let stateNew = { ...this.state };
		if (event === "title") {
			if (this.state.sort === "") {
				stateNew.sort = "ASC";
			} else if (this.state.sort === "ASC") {
				stateNew.sort = "DESC";
			} else if (this.state.sort === "DESC") {
				stateNew.sort = "ASC";
			}

			$("#title").addClass("title-event-class");
			$("#type").removeClass("type-event-class");
			$("#country").removeClass("country-event-class");
			$("#year").removeClass("year-event-class");
		}
		if (event === "type") {
			if (stateNew.sort === "") {
				stateNew.sort = "ASC";
			} else if (stateNew.sort === "ASC") {
				stateNew.sort = "DESC";
			} else if (stateNew.sort === "DESC") {
				stateNew.sort = "ASC";
			}

			$("#type").addClass("type-event-class");
			$("#title").removeClass("title-event-class");
			$("#country").removeClass("country-event-class");
			$("#year").removeClass("year-event-class");
		}
		if (event === "year") {
			if (stateNew.sort === "") {
				stateNew.sort = "ASC";
			} else if (stateNew.sort === "ASC") {
				stateNew.sort = "DESC";
			} else if (stateNew.sort === "DESC") {
				stateNew.sort = "ASC";
			}

			$("#year").addClass("year-event-class");
			$("#title").removeClass("title-event-class");
			$("#country").removeClass("country-event-class");
			$("#type").removeClass("type-event-class");
		}
		if (event === "country") {
			if (stateNew.sort === "") {
				stateNew.sort = "ASC";
			} else if (stateNew.sort === "ASC") {
				stateNew.sort = "DESC";
			} else if (stateNew.sort === "DESC") {
				stateNew.sort = "ASC";
			}

			$("#country").addClass("country-event-class");
			$("#title").removeClass("title-event-class");
			$("#type").removeClass("type-event-class");
			$("#year").removeClass("year-event-class");
		}

		stateNew.loader = true;
		this.setState({ stateNew });
		http
			.get("supplier/products?sort=" + event + "&sort_value=" + this.state.sort)
			.then(response => {
				stateNew.myProducts = response.data.data.page.data;
				stateNew.loader = false;
				this.setState(stateNew);
			});
	};

	onHide = name => {
		this.setState({
			[`${name}`]: false,
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

	onBasicPageChange = event => {
		let stateNew = { ...this.state };
		let page = event.page;
		page = page + 1;
		stateNew.loader = true;
		this.setState(stateNew);
		http.get("supplier/products?page=" + page).then(response => {
			stateNew.totalRecords = response.data.data.page.total;
			stateNew.basicFirst = response.data.data.page.current_page;
			stateNew.basicRows = response.data.data.page.per_page;
			stateNew.myProducts = response.data.data.page.data;
			stateNew.loader = false;
			this.setState(stateNew);
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

	searchProduct = e => {
		let stateNew = { ...this.state };
		stateNew.loader = true;
		this.setState(stateNew);
		http.get("supplier/products?search=" + e.target.value).then(response => {
			stateNew.myProducts = response.data.data.page.data;
			stateNew.loader = false;
			this.setState(stateNew);
		});
	};

	newProduct = () => {
		this.props.history.push("/new-product");
	};

	render() {
		return (
			<React.Fragment>
				{this.state.loader && <Loader />}
				<br></br>
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
				<div className="container">
					<div className="row">
						<div className="col-md-3 pr-0 profile-outer-card">
							<Profile />
						</div>
						<div className="col-md-9 pr-0">
							<div className="row">
								<div className="col-md-2" style={{ paddingRight: 0 }}>
									<h5 style={{ color: "white", fontSize: 16 }}>My Portfolio</h5>
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
														onChange={this.searchProduct}
													/>
												</span>
											</div>
										</div>

										<div className="col-md-4 button-group-outer-div">
											<ButtonGroup
												variant="contained"
												color="primary"
												aria-label="contained primary button group"
												className="product-group"
											>
												<Button
													id="title"
													onClick={event => this.productChange("title")}
												>
													Name
												</Button>
												<Button
													id="type"
													onClick={event => this.productChange("type")}
												>
													Type
												</Button>
												<Button
													id="year"
													onClick={event => this.productChange("year")}
												>
													Year
												</Button>
												<Button
													id="country"
													onClick={event => this.productChange("country")}
												>
													Country
												</Button>
												{/* <Button>Sort By</Button>&nbsp; */}
												<Button
													className="new-event-action"
													variant="contained"
													onClick={this.newProduct}
												>
													Add Wine
												</Button>

												{/* <input
                          className="new-event-action"
                          variant="contained"
                          onClick={this.newProduct}
                        /> */}
												<Uploadcsv />
											</ButtonGroup>
										</div>
									</div>
								</div>
								<div className="col-md-12">
									<div className="row">
										{this.state.myProducts.length > 0 && (
											<React.Fragment>
												{this.state.myProducts.map((el, id) => {
													console.log(el, "<<<el");
													return (
														<div className="col-md-4 mt-4">
															<Card key={el.id} className="productCard">
																{el.Imagesrc && (
																	<React.Fragment>
																		<Card.Img
																			className="product-card-img"
																			variant="top"
																			src={el.Imagesrc}
																		/>
																	</React.Fragment>
																)}
																{!el.Imagesrc && (
																	<React.Fragment>
																		<Card.Img
																			className="product-card-img"
																			variant="top"
																			src="https://www.vinoted-admin.com/images/no-image.png"
																		/>
																	</React.Fragment>
																)}
																<Card.Body className="card-body-product">
																	<Link
																		to={{
																			pathname: "/product-detail/" + el.id,
																			state: { winedetail: el },
																		}}
																	>
																		<Card.Title className="cardtitle my-0">
																			{el.title}
																		</Card.Title>
																	</Link>
																	<Card.Text
																		className="cardText"
																		style={{
																			color: "#1D3557",
																			margin: "0 auto",
																		}}
																	>
																		{el.type} &nbsp;
																		{el.alcohol != null && (
																			<span>|&nbsp;{el.alcohol} %</span>
																		)}
																	</Card.Text>
																	<Card.Text className="cardText text-muted my-0">
																		{el.country} |{" "}
																		<span className="text-success">
																			{el.status}
																		</span>
																	</Card.Text>

																	<div className="row" style={{ marginTop: 4 }}>
																		<Button
																			onClick={() => this.editProduct(el.id)}
																			variant="contained"
																			color="secondary"
																			className="edit-product-btn"
																		>
																			Edit
																		</Button>
																		&nbsp;&nbsp;&nbsp;&nbsp;
																		<Button
																			variant="contained"
																			onClick={() =>
																				this.onClick("displayResponsive", el)
																			}
																			color="secondary"
																			className="delete-product-btn"
																		>
																			Delete
																		</Button>{" "}
																		&nbsp;&nbsp;&nbsp;&nbsp;
																		<h5 className="price-info-tag">
																			£&nbsp;{el.price}
																		</h5>
																	</div>
																</Card.Body>
															</Card>
														</div>
													);
												})}
											</React.Fragment>
										)}

										{this.state.myProducts.length === 0 && (
											<React.Fragment>
												<div className="container not-found">
													<div className="row">
														<div class="fof">
															<h1>No wines Found</h1>
														</div>
													</div>
												</div>
											</React.Fragment>
										)}
									</div>

									<Paginator
										first={this.state.basicFirst - 1}
										rows={this.state.basicRows}
										totalRecords={this.state.totalRecords}
										// rowsPerPageOptions={[10, 20, 30]}
										onPageChange={this.onBasicPageChange}
									></Paginator>
									<br></br>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(ProductList);
