import { PlusOutlined } from "@ant-design/icons";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import React, { Component } from "react";
import { Col, Form, Row } from "react-bootstrap";
import ReactQuill from "react-quill";
import { withRouter } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import http from "../../config/http";
import Profile from "../Profiles";

// const dateFormat = "YYYY/MM/DD";
// const timeFormat = "h:mm:ss A";

class AddProduct extends Component {
	constructor(props) {
		super(props);
		this.wines = [
			{ name: "Red", code: "Red" },
			{ name: "Rose", code: "Rose" },
			{ name: "White", code: "White" },
			{ name: "Sparkling", code: "Sparkling" },
			{ name: "Sweet", code: "Sweet" },
			{ name: "Other", code: "Other" },
		];
		this.status = [
			{ name: "Active", code: "Active" },
			{ name: "Inactive", code: "Inactive" },
		];
		this.state = {
			selectedCountry: null,
			selectedWineType: null,
			selectedStatus: {},
			text: "",
			countries: [],
			fileList: [],
			fileList1: [],
			loader: false,
			outer_bar: false,
			open: false,
			snackbar: {
				message: "",
				status: "",
			},
			data: {
				image: "",
			},
			previewVisible: false,
			previewVisible1: false,
			previewImage: "",
			productData: {
				title: "",
				slug: "",
				status: "",
				type: "",
				// company_name: "",
				year: "",
				price: "",
				country: "",
				region: "",
				alcohol: "",
				image: "",
				description: "",
				gallery: "",
			},
			errors: {
				title: "",
				slug: "",
				status: "",
				image: "",
				type: "",
				// company_name: "",
				year: "",
				price: "",
				country: "",
				region: "",
				alcohol: "",
				description: "",
				gallery: "",
			},
			errorClass: {
				title: "",
				slug: "",
				image: "",
				status: "",
				type: "",
				// company_name: "",
				year: "",
				price: "",
				country: "",
				region: "",
				alcohol: "",
				description: "",
				gallery: "",
			},
			fields: {
				title: "",
				// company_name: "",
				year: "",
				price: "",

				region: "",
				alcohol: "",
				image: "",
				description: "",
			},
		};
	}
	chooseImage = () => {
		// document.getElementById("get_file").onclick = function () {
		document.getElementById("image").click();
		// };
	};

	onFileChange = e => {
		let stateNew = { ...this.state };
		stateNew.data[e.target.name] = e.target.files[0];
		stateNew.fields[e.target.name] = e.target.files[0];
		stateNew.productData[e.target.name] = e.target.files[0];
		stateNew.fields.image = "test";
		stateNew.remove = true;
		this.setState(stateNew);
		this.handleImgChange(e);
	};
	handleImgChange = e => {
		var data = { ...this.state.data };
		data.image = URL.createObjectURL(e.target.files[0]);
		this.setState({ data });
	};
	validateForm = () => {
		let fields = this.state.fields;
		let errors = {};
		let errorClass = {};
		let formIsValid = true;

		if (!fields.title) {
			formIsValid = false;
			errors["title"] = "*Please enter tasting title.";
			errorClass["title"] = "is-invalid";
		}
		// if (!fields.image) {
		//   formIsValid = false;
		//   errors["title"] = "*Please select image.";
		//   errorClass["title"] = "is-invalid";
		// }
		// if (!fields.company_name) {
		//   formIsValid = false;
		//   errors["company_name"] = "*Please enter Company Name.";
		//   errorClass["company_name"] = "is-invalid";
		// }
		if (!fields.year) {
			formIsValid = false;
			errors["year"] = "*Please enter vintage.";
			errorClass["year"] = "is-invalid";
		}
		if (!fields.price) {
			formIsValid = false;
			errors["price"] = "*Please enter your price.";
			errorClass["price"] = "is-invalid";
		}
		if (!fields.country) {
			formIsValid = false;
			errors["country"] = "*Please select Country.";
			errorClass["country"] = "is-invalid";
		}
		// if (!fields.alcohol) {
		//   formIsValid = false;
		//   errors["alcohol"] = "*Please select alcohol.";
		//   errorClass["alcohol"] = "is-invalid";
		// }
		if (!fields.region) {
			formIsValid = false;
			errors["region"] = "*Please select region.";
			errorClass["region"] = "is-invalid";
		}
		if (!fields.description) {
			formIsValid = false;
			errors["description"] = "*Please write a wine description.";
			errorClass["description"] = "is-invalid";
		}

		// if (!fields.image) {
		//   formIsValid = false;
		//   errors["image"] = "*Please select Image.";
		//   errorClass["image"] = "is-invalid";
		// }

		this.setState({
			errors: errors,
			errorClass,
		});

		return formIsValid;
	};

	componentDidMount() {
		let stateNew = { ...this.state };
		stateNew.loader = true;
		stateNew.selectedStatus.name = "Active";
		stateNew.selectedStatus.code = "Active";
		this.setState(stateNew);
		http.get("utilities/all").then(response => {
			let countries = [];
			response.data.data.countries.forEach(element => {
				countries.push({ name: element.name, code: element.code });
			});
			stateNew.countries = countries;
			stateNew.loader = false;
			this.setState(stateNew);
		});
	}

	onWineChange = e => {
		let stateNew = { ...this.state };
		stateNew.fields.type = "value";
		stateNew.selectedWineType = e.value;
		this.setState(stateNew);
	};

	onStatusChange = e => {
		this.setState({ selectedStatus: e.value });
	};
	handleEditorChange = value => {
		let stateNew = { ...this.state };
		stateNew.fields.description = value;
		stateNew.text = value;
		this.setState(stateNew);
	};
	onCountryChange = e => {
		let stateNew = { ...this.state };
		stateNew.fields.country = "value";
		stateNew.selectedCountry = e.value;
		this.setState(stateNew);
	};
	disabledDate(current) {
		return current && current > moment().endOf("day");
	}

	handlePreview = file => {
		let stateNew = { ...this.state };
		stateNew.formData.previewImage = file.url || file.thumbUrl;
		stateNew.formData.previewVisible = true;
		this.setState({ stateNew });
	};

	handleChange = e => {
		let stateNew = { ...this.state };
		stateNew.productData[e.target.name] = e.target.value;
		stateNew.fields[e.target.name] = e.target.value;
		stateNew.errorClass[e.target.name] = "";
		stateNew.errors[e.target.name] = "";
		this.setState(stateNew);
	};

	handleFileUploadChange = ({ fileList }) => this.setState({ fileList });

	handleFileUploadChange1 = ({ fileList }) => {
		let stateNew = { ...this.state };
		stateNew.fields.image = "test";
		stateNew.fileList1 = fileList;
		this.setState(stateNew);
	};

	addProduct = () => {
		if (this.validateForm()) {
			if (this.state.selectedWineType === null) {
				if (this.state.outer_bar === true) {
					this.setState({ outer_bar: false });
				}
				let stateNew = { ...this.state };
				stateNew.outer_bar = true;
				stateNew.open = true;
				stateNew.snackbar.message = "Please select category";
				stateNew.snackbar.status = "error";
				this.setState(stateNew);
			} else {
				if (this.state.outer_bar === true) {
					this.setState({ outer_bar: false });
				}
				this.setState({ loader: true });
				let formData = new FormData();

				for (const [key, value] of Object.entries(this.state.productData)) {
					// if (key === "gallery") {
					//   for (let i = 0; i < this.state.fileList.length; i++) {
					//     formData.append(
					//       `gallery[${i}]`,
					//       this.state.fileList[i].originFileObj
					//     );
					//   }
					// } else
					if (key === "slug") {
						formData.append(
							"slug",
							this.state.productData.title.toLowerCase().replace(" ", "_")
						);
					} else if (key === "image") {
						formData.append("image", this.state.productData.image);
					} else if (key === "type" && this.state.selectedWineType !== null) {
						formData.append("type", this.state.selectedWineType.code);
					} else if ( key === "alcohol" && this.state.alcohol !== null) {
						formData.append("alcohol", this.state.productData.alcohol);
					} else if (key === "status" && this.state.selectedStatus !== null) {
						formData.append("status", this.state.selectedStatus.code);
					} else if (key === "country" && this.state.selectedCountry !== null) {
						formData.append("country", this.state.selectedCountry.code);
					} else if (key === "description") {
						let desc = this.state.text;
						if (desc.search("color: rgb(255, 255, 255);")) {
							desc = desc.replace(
								"color: rgb(255, 255, 255);",
								"color: rgb(0,0,0);"
							);
						} else {
							desc = this.state.text;
						}
						formData.append("description", desc);
					} else {
						formData.append(key, value);
					}
				}

				console.log(formData.get("user_id", "<<<<product user id"));
				http.post("supplier/products", formData).then(response => {
					console.log(response, "<<<response");
					if (response.code === 200) {
						let stateNew = { ...this.state };
						stateNew.outer_bar = true;
						stateNew.open = true;
						stateNew.loader = false;
						console.log("response", response);
						stateNew.snackbar.message = response.data.message;
						stateNew.snackbar.status = "success";
						this.setState(stateNew);
						setTimeout(() => {
							this.props.history.push("/my-products");
						}, 3000);
					} else if (response.code === 422) {
						let stateNew = { ...this.state };
						stateNew.outer_bar = true;
						// stateNew.open = true;
						stateNew.loader = false;
						if (response.errors) {
							stateNew.errors = response.errors;
							stateNew.errorClass.title = response.errors.title
								? "is-invalid"
								: "";
							stateNew.errorClass.year = response.errors.year
								? "is-invalid"
								: "";
							stateNew.errorClass.type = response.errors.type
								? "is-invalid"
								: "";
							stateNew.errorClass.price = response.errors.price
								? "is-invalid"
								: "";
							// stateNew.errorClass.company_name = response.errors.company_name
							//   ? "is-invalid"
							//   : "";
							stateNew.errorClass.country = response.errors.country
								? "is-invalid"
								: "";
							stateNew.errorClass.region = response.errors.region
								? "is-invalid"
								: "";
							stateNew.errorClass.alcohol = response.errors.alcohol
								? "is-invalid"
								: "";
							stateNew.errorClass.gallery = response.errors.gallery
								? "is-invalid"
								: "";
							stateNew.errorClass.status = response.errors.status
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
		} else {
		}
	};

	handleYear = e => {
		console.log(e);
	};

	render() {
		const { fileList1, previewImage1, previewVisible1 } = this.state;
		// const uploadButton = (
		//   <div>
		//     <PlusOutlined />
		//     <div className="ant-upload-text">Upload</div>
		//   </div>
		// );

		const uploadButton1 = (
			<div>
				<PlusOutlined />
				<div className="ant-upload-text">Upload</div>
			</div>
		);

		return (
			<React.Fragment>
				{this.state.loader && <Loader />}
				{this.state.outer_bar && (
					<Snackbar open={this.state.open} message={this.state.snackbar} />
				)}
				<div className="home_page">
					<div className="pb-5 mx-5 mt-3">
						<div className="row">
							<div className="pr-0 col-lg-3 col-md-4">
								<Profile />
							</div>
							<div className="pr-0 col-lg-9 col-md-8">
								<div className="addProductForm">
									<div className="p-4">
										<h4 className="text-light">Add Wine</h4>
										<hr style={{ backgroundColor: "grey" }} />
										<Form>
											<Row>
												<Col>
													<Form.Group controlId="eventName">
														<Form.Label className="text-light">
															Producer
														</Form.Label>
														<Form.Control
															className={
																"form-control " + this.state.errorClass.title
															}
															onChange={this.handleChange}
															type="text"
															name="producer"
															placeholder="Producer"
														/>
														{this.state.errors.title && (
															<p className="error-class-add-event">
																{this.state.errors.title}
															</p>
														)}
													</Form.Group>
													<Form.Group controlId="eventName">
														<Form.Label className="text-light">
															Wine Name
														</Form.Label>
														<Form.Control
															className={
																"form-control " + this.state.errorClass.title
															}
															onChange={this.handleChange}
															type="text"
															name="title"
															placeholder="Wine Name"
														/>
														{this.state.errors.title && (
															<p className="error-class-add-event">
																{this.state.errors.title}
															</p>
														)}
													</Form.Group>

													<Form.Group controlId="formBasicStatus">
														<Form.Label className="text-light">
															Category
														</Form.Label>
														<Dropdown
															value={this.state.selectedWineType}
															options={this.wines}
															onChange={this.onWineChange}
															optionLabel="name"
															className={
																"form-control " + this.state.errorClass.type
															}
															placeholder="Category"
														/>
														{this.state.errors.type && (
															<p className="error-class-add-event">
																{this.state.errors.type}
															</p>
														)}
													</Form.Group>
													{/* <Form.Group controlId="eventName">
													<Form.Label className="text-light">
													Company Name
													</Form.Label>
													<Form.Control
													className={
														"form-control " +
														this.state.errorClass.company_name
													}
													onChange={this.handleChange}
													type="text"
													name="company_name"
													placeholder="Company name"
													/>
													{this.state.errors.company_name && (
													<p className="error-class-add-event">
														{this.state.errors.company_name}
													</p>
													)}
												</Form.Group> */}
													<Form.Group controlId="eventName">
														<Form.Label className="text-light">
															Region
														</Form.Label>
														<Form.Control
															className={
																"form-control " + this.state.errorClass.region
															}
															onChange={this.handleChange}
															type="text"
															name="region"
															placeholder="Region"
														/>
														{this.state.errors.region && (
															<p className="error-class-add-event">
																{this.state.errors.region}
															</p>
														)}
													</Form.Group>
													{/* <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className="text-light">
                              Wine Gallery
                            </Form.Label>
                            <Upload
                              listType="picture-card"
                              fileList={fileList}
                              onPreview={this.handlePreview}
                              onChange={this.handleFileUploadChange}
                            >
                              {fileList.length >= 15 ? null : uploadButton}
                            </Upload>
                            <Modal
                              visible={previewVisible}
                              footer={null}
                              onCancel={this.handleCancel}
                            >
                              <img
                                alt="example"
                                style={{ width: "100%" }}
                                src={previewImage}
                              />
                            </Modal>
                          </Form.Group> */}
													<Form.Group controlId="exampleForm.ControlTextarea1">
														{this.state.data.image && (
															<React.Fragment>
																<img
																	value={this.state.data.image}
																	className="profileimage"
																	alt="a"
																	onClick={() =>
																		window.open(this.state.data.image, "_blank")
																	}
																	src={this.state.data.image}
																/>
															</React.Fragment>
														)}
														{!this.state.data.image && (
															<img
																className="profileimage"
																alt="a"
																src="https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image-300x225.png"
															/>
														)}
														{this.state.errors.image && (
															<p className="error-class-add-event">
																{this.state.errors.image}
															</p>
														)}
														<p></p>
														<Button
															variant="contained"
															onClick={this.chooseImage}
														>
															Upload
														</Button>
														<input
															type="file"
															name="image"
															onChange={this.onFileChange}
															id="image"
															style={{ display: "none" }}
														/>
													</Form.Group>
												</Col>
												<Col>
													<Form.Group controlId="eventName">
														<Form.Label className="text-light">Vintage</Form.Label>
														<Form.Control
															className={
																"form-control " + this.state.errorClass.year
															}
															onChange={this.handleChange}
															type="text"
															name="year"
															placeholder="Vintage"
														/>
														{this.state.errors.year && (
															<p className="error-class-add-event">
																{this.state.errors.year}
															</p>
														)}
													</Form.Group>
													<Form.Group controlId="eventName">
														<Form.Label className="text-light">
															Price £
														</Form.Label>
														<Form.Control
															className={
																"form-control " + this.state.errorClass.price
															}
															onChange={this.handleChange}
															type="number"
															name="price"
															placeholder="Price"
														/>
														{this.state.errors.price && (
															<p className="error-class-add-event">
																{this.state.errors.price}
															</p>
														)}
													</Form.Group>

													<Form.Group controlId="country">
														<Form.Label className="text-light">
															Country
														</Form.Label>
														<Dropdown
															value={this.state.selectedCountry}
															options={this.state.countries}
															onChange={this.onCountryChange}
															optionLabel="name"
															className={
																"form-control " + this.state.errorClass.country
															}
															placeholder="Countries"
														/>
														{this.state.errors.country && (
															<p className="error-class-add-event">
																{this.state.errors.country}
															</p>
														)}
													</Form.Group>

													<Form.Group controlId="eventName">
														<Form.Label className="text-light">
															Alcohol (%)
														</Form.Label>
														<Form.Control
															className={
																"form-control " + this.state.errorClass.alcohol
															}
															onChange={this.handleChange}
															type="number"
															name="alcohol"
															placeholder="Alcohol (%)"
														/>
														{/* {this.state.errors.alcohol && (
                              <p className="error-class-add-event">
                                {this.state.errors.alcohol}
                              </p>
                            )} */}
													</Form.Group>
												</Col>
											</Row>
											<Form.Group controlId="formBasicStatus">
												<Form.Label className="text-light">Status</Form.Label>
												<Dropdown
													value={this.state.selectedStatus}
													options={this.status}
													onChange={this.onStatusChange}
													optionLabel="name"
													className={
														"form-control " + this.state.errorClass.status
													}
													placeholder="Status"
												/>
												{this.state.errors.status && (
													<p className="error-class-add-event">
														{this.state.errors.status}
													</p>
												)}
											</Form.Group>
											<Form.Group controlId="formBasicEmail">
												<ReactQuill
													value={this.state.text}
													onChange={this.handleEditorChange}
												/>
												{this.state.errors.description && (
													<p className="error-class-add-event">
														{this.state.errors.description}
													</p>
												)}
											</Form.Group>
											<br></br>
											<Button
												onClick={this.addProduct}
												variant="contained"
												className="py-1 mt-4 rounded-pill submitbtn-event"
											>
												Create Wine
											</Button>
										</Form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(AddProduct);
