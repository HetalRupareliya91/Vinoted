import Button from "@material-ui/core/Button";
import { DatePicker } from "antd";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import React, { Component } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { withRouter } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import http from "../../config/http";
import Profile from "../Profiles";
const dateFormat = "y/MM/DD";
// const timeFormat = "h:mm:ss A";

class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.status = [
      { name: "Publish", code: "Open" },
      { name: "Draft", code: "Hide" },
      { name: "Closed", code: "Closed" },
    ];

    this.state = {
      data: {
        image: "",
      },
      openSommeliers: false,
      latLng: {},
      sommeliersClicked: {
        All: false,
        Hospitality: false,
        Press: false,
        Importer: false,
      },
      text: "",
      address: "",
      end_time: "",
      map_url: "",
      fileList: [],
      date9: "",
      previewVisible: false,
      previewImage: "",
      loader: false,
      outer_bar: false,
      open: false,
      snackbar: {
        message: "",
        status: "",
      },
      selectedStatus: {},
      selectedCountry: null,
      selectedProducts: [],
      selectedSommieliers: [],
      products: [],
      sommeliers: [],
      fullSommeliers: [],
      countries: [],
      eventData: {
        name: "",
        address_1: "",
        event_end_time: "",
        description: "",
        date: "",
        latitude: "",
        longitude: "",
        image: "",
        country: "",
        state: "",
        country_code: "",
        city: "",
        status: "",
        postcode: "",
        products: [],
        sommeliers: [],
      },
      errors: {
        name: "",
        country: "",
        state: "",
        city: "",
        status: "",
        postcode: "",
        address_1: "",
        products: "",
        sommeliers: "",
        description: "",
        time: "",
        date: "",
      },
      errorClass: {
        name: "",
        country: "",
        state: "",
        city: "",
        status: "",
        postcode: "",
        time: "",
        products: "",
        sommeliers: "",
        address_1: "",
        description: "",
        date: "",
      },
      fields: {
        name: "",
        address_1: "",
        description: "",
        date: "",
        image: "",
        country_code: "",
        state: "",
        country_code: "",
        city: "",
        postcode: "",
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
    stateNew.eventData[e.target.name] = e.target.files[0];
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

    if (!fields.name) {
      formIsValid = false;
      errors["name"] = "*Please enter tasting name.";
      errorClass["name"] = "is-invalid";
    }
    if (!fields.description) {
      formIsValid = false;
      errors["description"] = "*Please enter Description.";
      errorClass["description"] = "is-invalid";
    }

    if (!fields.country_code) {
      formIsValid = false;
      errors["country_code"] = "*Please select Country.";
      errorClass["country_code"] = "is-invalid";
    }
    if (!fields.state) {
      formIsValid = false;
      errors["state"] = "*Please select state.";
      errorClass["state"] = "is-invalid";
    }
    if (!fields.city) {
      formIsValid = false;
      errors["city"] = "*Please select city.";
      errorClass["city"] = "is-invalid";
    }
    if (!fields.address_1) {
      formIsValid = false;
      errors["address_1"] = "*Please select Address.";
      errorClass["address_1"] = "is-invalid";
    }
    if (!fields.date) {
      formIsValid = false;
      errors["date"] = "*Please select Date&time.";
      errorClass["date"] = "is-invalid";
    }
    if (!fields.image) {
      formIsValid = false;
      errors["image"] = "*Please select Image.";
      errorClass["image"] = "is-invalid";
    }
    if (!fields.postcode) {
      formIsValid = false;
      errors["postcode"] = "*Please enter postcode.";
      errorClass["postcode"] = "is-invalid";
    }
    this.setState({
      errors: errors,
      errorClass,
    });

    return formIsValid;
  };

  disabledDate(current) {
    return current && current.valueOf() < Date.now();
  }

  componentDidMount() {
    let stateNew = { ...this.state };
    stateNew.loader = true;
    stateNew.selectedStatus.name = "Publish";
    stateNew.selectedStatus.code = "Open";
    this.setState(stateNew);
    const products = [];
    const sommeliers = [
      { label: "Select All Hospitality", value: -1 },
      { label: "Select All Press", value: -2 },
      { label: "Select All Importer", value: -3 },
    ];
    http.get("supplier/products").then(response => {
      response.data.data.page.data.forEach(element => {
        products.push({ label: element.title, value: element.id });
      });
      stateNew.products = products;
      this.setState(stateNew);
    });
    http.get("supplier/sommelierlist").then(response => {
      stateNew.fullSommeliers = response.data.data.page.data;
      response.data.data.page.data.forEach(element => {
        sommeliers.push({
          label: `${element.name} (${element.job_title}, ${element.company}${element.work_type ? ", " + element.work_type : ""
            })`,
          value: element.id,
        });
      });
      stateNew.sommeliers = sommeliers;
      stateNew.loader = false;
      this.setState(stateNew);
    });

    http.get("utilities/all").then(response => {
      let countries = [];

      response.data.data.countries.forEach(element => {
        countries.push({ name: element.name, code: element.code });
      });
      stateNew.countries = countries;
      this.setState(stateNew);
    });
  }

  handleMapSelect = address => {
    let stateNew = { ...this.state };
    let state = "";
    let city = "";
    let country = {};
    let postcode = "";

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng =>
        localStorage.setItem("event_latLng", JSON.stringify(latLng))
      )
      .catch(error => console.error("Error", error));
    geocodeByAddress(address)
      .then(results =>
        results.forEach(element => {
          console.log(element);
          stateNew.eventData.address_1 = element.formatted_address;
          element.address_components.forEach(ele => {
            ele.types.forEach(e => {
              if (e === "premise") {
                // address1 = ele.long_name;
              } else if (e === "route") {
                // address2 = ele.long_name;
              } else if (e === "sublocality" || e === "sublocality_level_1") {
                // address3 = ele.long_name;
              } else if (e === "administrative_area_level_2") {
                city = ele.long_name;
              } else if (e === "administrative_area_level_1") {
                state = ele.long_name;
              } else if (e === "country") {
                country.name = ele.long_name;
                country.code = ele.short_name;
              } else if (e === "postal_code") {
                postcode = ele.long_name;
              }
            });
          });
          // stateNew.eventData.address_1 =
          //   address1 + ", " + address2 + ", " + address3;
          stateNew.fields.address_1 = element.formatted_address;
          stateNew.selectedCountry = country;
          stateNew.eventData.latitude = this.state.latLng.lat;
          stateNew.eventData.longitude = this.state.latLng.lng;
          stateNew.eventData.state = state;
          stateNew.eventData.city = city;
          stateNew.eventData.postcode = postcode;
          stateNew.fields.state = state;
          stateNew.fields.city = city;
          stateNew.fields.postcode = postcode;
          stateNew.fields.country_code = country.code;
          this.setState(stateNew);
        })
      )
      .catch(error => console.error("Error", error));
  };

  addEvent = () => {
    if (this.validateForm()) {
      if (this.state.selectedProducts.length === 0) {
        if (this.state.outer_bar === true) {
          this.setState({ outer_bar: false });
        }
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.open = true;
        stateNew.snackbar.message = "Please select wines";
        stateNew.snackbar.status = "error";
        this.setState(stateNew);
        setTimeout(() => {
          this.setState({ outer_bar: false });
        }, 1000);
      } else if (this.state.selectedSommieliers.length === 0) {
        if (this.state.outer_bar === true) {
          this.setState({ outer_bar: false });
        }
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.open = true;
        stateNew.errorClass.sommeliers = "is-invalid";
        stateNew.snackbar.message = "Please select sommieliers";
        stateNew.snackbar.status = "error";
        this.setState(stateNew);
        setTimeout(() => {
          this.setState({ outer_bar: false });
        }, 1000);
      } else if (!this.state.date9) {
        if (this.state.outer_bar === true) {
          this.setState({ outer_bar: false });
        }
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.open = true;
        stateNew.errorClass.sommeliers = "is-invalid";
        stateNew.snackbar.message = "Please select tasting time";
        stateNew.snackbar.status = "error";
        this.setState(stateNew);
        setTimeout(() => {
          this.setState({ outer_bar: false });
        }, 1000);
      } else if (!this.state.end_time) {
        if (this.state.outer_bar === true) {
          this.setState({ outer_bar: false });
        }
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.open = true;
        stateNew.errorClass.sommeliers = "is-invalid";
        stateNew.snackbar.message = "Please select tasting end time";
        stateNew.snackbar.status = "error";
        this.setState(stateNew);
        setTimeout(() => {
          this.setState({ outer_bar: false });
        }, 1000);
      } else {
        if (this.state.outer_bar === true) {
          this.setState({ outer_bar: false });
        }
        this.setState({ loader: true });
        let formData = new FormData();
        for (const [key, value] of Object.entries(this.state.eventData)) {
          let date = "";
          if (this.state.date9) {
            date =
              this.state.eventData.date.replaceAll("/", "-") +
              " " +
              this.state.date9.toLocaleTimeString();
          }
          let endDate = "";
          if (this.state.end_time) {
            endDate =
              this.state.eventData.date.replaceAll("/", "-") +
              " " +
              this.state.end_time.toLocaleTimeString();
          }
          // console.log(date, "<<<<<<", endDate, "<<<<submit to form");
          if (key === "date" && this.state.date9) {
            if (date.search("AM") > 0) {
              formData.append("date", date.split(" AM")[0]);
            } else if (date.search("PM") > 0) {
              formData.append("date", date.split(" PM")[0]);
            } else {
              formData.append("date", date);
            }
          }
          if (key === "event_end_time" && this.state.end_time) {
            if (endDate.search("AM") > 0) {
              formData.append("event_end_time", endDate.split(" AM")[0]);
            } else if (endDate.search("PM") > 0) {
              formData.append("event_end_time", endDate.split(" PM")[0]);
            } else {
              formData.append("event_end_time", endDate);
            }
          } else if (key == "name") {
            formData.append("name", this.state.eventData.name);
          } else if (key == "city") {
            formData.append("city", this.state.eventData.city);
          } else if (key == "state") {
            formData.append("state", this.state.eventData.state);
          } else if (key == "address_1") {
            formData.append("address_1", this.state.eventData.address_1);
          } else if (key === "image") {
            formData.append("image", this.state.eventData.image);
          } else if (
            key === "products" &&
            typeof this.state.selectedProducts !== "undefined"
          ) {
            this.state.selectedProducts.forEach((element, key) => {
              formData.append(`products[${key}]`, element.value);
            });
          } else if (
            key === "sommeliers" &&
            typeof this.state.selectedSommieliers !== "undefined"
          ) {
            this.state.selectedSommieliers.forEach((element, index) => {
              formData.append(`sommeliers[${index}]`, element.value);
            });
          } else if (key === "status" && this.state.selectedStatus !== null) {
            formData.append("status", this.state.selectedStatus.code);
          } else if (
            key === "country_code" &&
            this.state.selectedCountry !== null
          ) {
            formData.append("country_code", this.state.selectedCountry.code);
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
        console.log(localStorage.getItem("event_latLng"));
        if (localStorage.getItem("event_latLng") !== null) {
          const { lat, lng } = JSON.parse(localStorage.getItem("event_latLng"));
          console.log(lat, lng, "<<<< LAt ");

          formData.append("latitude", lat);
          formData.append("longitude", lng);
        }
        console.log(formData.get("event_end_time"));
        console.log(formData.get("date"));
        console.log(formData.get("image"));
        console.log(formData.get("products[0]"));
        console.log(formData.get("status"));
        console.log(formData.get("country_code"));
        console.log(formData.get("description"));
        console.log(formData.get("latitude"));
        console.log(formData.get("longitude"));
        // console.log(formData.get("longitude"));
        // console.log(formData.get("longitude"));
        console.log(formData.get("sommeliers[0]"));

        // return null;
        http.post("supplier/events", formData).then(response => {
          if (response.code === 200) {
            let stateNew = { ...this.state };
            stateNew.outer_bar = true;
            stateNew.open = true;
            stateNew.loader = false;
            stateNew.snackbar.message = response.data.message;
            stateNew.snackbar.status = "success";
            this.setState(stateNew);
            setTimeout(() => {
              this.props.history.push("/my-events");
            }, 3000);
          } else if (response.code === 422) {
            let stateNew = { ...this.state };
            stateNew.outer_bar = true;
            // stateNew.open = true;
            stateNew.loader = false;
            if (response.errors) {
              stateNew.errors = response.errors;
              stateNew.errorClass.name = response.errors.name
                ? "is-invalid"
                : "";
              stateNew.errorClass.date = response.errors.date
                ? "is-invalid"
                : "";
              stateNew.errorClass.products = response.errors.products
                ? "is-invalid"
                : "";
              stateNew.errorClass.sommeliers = response.errors.sommeliers
                ? "is-invalid"
                : "";
              stateNew.errorClass.capacity = response.errors.capacity
                ? "is-invalid"
                : "";
              stateNew.errorClass.latitude = response.errors.latitude
                ? "is-invalid"
                : "";
              stateNew.errorClass.longitude = response.errors.longitude
                ? "is-invalid"
                : "";
              stateNew.errorClass.address_1 = response.errors.address_1
                ? "is-invalid"
                : "";
              stateNew.errorClass.postcode = response.errors.postcode
                ? "is-invalid"
                : "";
              stateNew.errorClass.status = response.errors.status
                ? "is-invalid"
                : "";
              stateNew.errorClass.description = response.errors.description
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

  handlePreview = file => {
    let stateNew = { ...this.state };
    stateNew.formData.previewImage = file.url || file.thumbUrl;
    stateNew.formData.previewVisible = true;
    this.setState({ stateNew });
  };

  handleChange = e => {
    let stateNew = { ...this.state };
    stateNew.eventData[e.target.name] = e.target.value;
    stateNew.fields[e.target.name] = e.target.value;
    stateNew.errorClass[e.target.name] = "";
    stateNew.errors[e.target.name] = "";
    if (e.target.name === "address_1") {
      stateNew.mapDiv = true;
      stateNew.map_url = e.target.value;
    }
    this.setState(stateNew);
  };

  dateChange = (date, dateString) => {
    let stateNew = { ...this.state };
    stateNew.eventData.date = dateString;
    stateNew.fields.date = dateString;
    this.setState(stateNew);
  };
  handleEditorChange = value => {
    let stateNew = { ...this.state };
    stateNew.fields.description = value;
    stateNew.text = value;
    this.setState(stateNew);
  };

  handleMapChange = address => {
    this.setState({ address });
  };

  timeChange = (event, value) => {
    let stateNew = { ...this.state };
    stateNew.eventData["time"] = value;
    this.setState(stateNew);
  };

  onStatusChange = e => {
    this.setState({ selectedStatus: e.value });
  };

  handleImageChange = ({ fileList }) => {
    let stateNew = { ...this.state };
    stateNew.fields.image = "test";
    stateNew.fileList = fileList;
    this.setState(stateNew);
  };

  setSelected = e => {
    let stateNew = { ...this.state };
    stateNew.fields.products = "test";
    stateNew.selectedProducts = e;
    this.setState(stateNew);
  };

  setSelected1 = data => {
    let stateNew = { ...this.state };
    if (data.length - 2 === stateNew.selectedSommieliers.length) {
      stateNew.selectedSommieliers = [];
      this.setState(stateNew);
      return;
    }
    const values = data
      .map(el => (el.value ? el.value : null))
      .filter(el => el !== null);
    if (values.includes(-1) || values.includes(-2) || values.includes(-3)) {
      let count = 0,
        temp;
      values.forEach(val => {
        if (val === -1 || val === -2 || val === -3) count++;
      });
      if (count === 1) {
        data.forEach(obj => {
          if (obj.value === -1) {
            temp = stateNew.fullSommeliers.filter(
              x => x.work_type === "Hospitality"
            )[0];
          } else if (obj.value === -2) {
            temp = stateNew.fullSommeliers.filter(
              x => x.work_type === "Press"
            )[0];
          } else if (obj.value === -3) {
            temp = stateNew.fullSommeliers.filter(
              x => x.work_type === "Importer"
            )[0];
          }
        });
        const value = temp.id;
        const label = `${temp.name} (${temp.job_title}, ${temp.company}${temp.work_type ? ", " + temp.work_type : ""
          })`;
        data.push({ value, label });

        const dupeCountMap = {};

        data
          .filter(x => x.value !== -1 && x.value !== -2 && x.value !== -3)
          .forEach(({ value }) => {
            dupeCountMap[value] = dupeCountMap[value]
              ? dupeCountMap[value] + 1
              : 1;
          });

        stateNew.selectedSommieliers = data
          .filter(x => x.value !== -1 && x.value !== -2 && x.value !== -3)
          .filter(obj => dupeCountMap[obj.value] === 1);

        this.setState(stateNew);
        console.log("stt1= ", stateNew.selectedSommieliers);
        return;
      }
    }
    let temp = [];
    data.forEach(obj => {
      if (obj.value === -1) {
        temp = stateNew.fullSommeliers.filter(
          x => x.work_type === "Hospitality"
        );
      } else if (obj.value === -2) {
        temp = stateNew.fullSommeliers.filter(x => x.work_type === "Press");
      } else if (obj.value === -3) {
        temp = stateNew.fullSommeliers.filter(x => x.work_type === "Importer");
      } else return obj;
    });
    stateNew.selectedSommieliers = data
      .filter(x => x.value !== -1 && x.value !== -2 && x.value !== -3)
      .concat(
        temp.map(t => {
          const value = t.id;
          const label = `${t.name} (${t.job_title}, ${t.company}${temp.work_type ? ", " + temp.work_type : ""
            })`;
          return { value, label };
        })
      );
    this.setState(stateNew);
  };

  chooseSommeliers = data => {
    // console.log(data);
    let stateNew = { ...this.state };
    stateNew.selectedSommieliers = [...stateNew.selectedSommieliers, data];
    this.setState(stateNew);
    // console.log(this.state.selectedSommieliers, "<<<<selectedSommeliers");
  };

  multipleSelect = data => {
    let stateNew = { ...this.state };
    stateNew.selectedSommieliers = this.state.sommeliers.filter(item =>
      data === "All" ? true : item.work_type === data
    );
    if (data === "All" && this.state.sommeliersClicked.All)
      stateNew.selectedSommieliers = [];
    stateNew.sommeliersClicked[`${data}`] =
      !stateNew.sommeliersClicked[`${data}`];
    this.setState(stateNew);
  };

  selectSingle = data => {
    // alert(data, "<<<<<");
    let stateNew = { ...this.state };
    const previousSommeliers = stateNew.selectedSommieliers;
    const IsSommeliersPresent =
      previousSommeliers.filter(x => x.id === data.id).length > 0;
    // console.log(IsSommeliersPresent, "<<<<issomme");
    if (!IsSommeliersPresent) {
      // alert("not present");
      stateNew.selectedSommieliers = [...previousSommeliers, data];
    } else {
      stateNew.selectedSommieliers = previousSommeliers.filter(
        item => item.id !== data.id
      );
    }
    this.setState(stateNew);
    // console.log(stateNew.selectedSommieliers, "<<<<hos");
  };

  render() {
    const { fileList } = this.state;
    const uploadButton = (
      <div>
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
          <div className="mx-5 mt-3" style={{ height: "100vh" }}>
            <div className="row">
              <div className="pr-0 col-lg-3 col-md-4">
                <Profile />
              </div>
              <div className="pr-0 col-lg-9 col-md-8">
                <div className="addProductForm">
                  <div className="p-4">
                    <h4 className="text-light">Add Tasting</h4>
                    <hr style={{ backgroundColor: "grey" }} />
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label className="text-light">
                        Choose Wines - (Click on wines in order of tasting.
                        Order can be changed later)
                      </Form.Label>

                      <MultiSelect
                        options={this.state.products}
                        value={this.state.selectedProducts}
                        onChange={this.setSelected}
                        labelledBy="Select"
                      />

                      {this.state.errors.products && (
                        <p className="error-class-add-event">
                          {this.state.errors.products}
                        </p>
                      )}
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect11">
                      <Form.Label className="text-light">
                        Choose Sommeliers
                      </Form.Label>

                      <MultiSelect
                        options={this.state.sommeliers}
                        value={this.state.selectedSommieliers}
                        onChange={this.setSelected1}
                        labelledBy="Select"
                      />

                      {this.state.errors.products && (
                        <p className="error-class-add-event">
                          {this.state.errors.products}
                        </p>
                      )}
                    </Form.Group>
                    {/* <Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label className="text-light">
												Choose Sommeliers
											</Form.Label>
											<div
												onClick={() =>
													this.setState({
														openSommeliers: !this.state.openSommeliers,
													})
												}
												style={{
													position: "relative",
													color: "black",
													height: "40px",
													borderRadius: "4px",
													padding: "0px 15px",
													backgroundColor: "white",
													display: "flex",
													alignItems: "center",
													width: "100%",
												}}
											>
												Select
												<div
													style={{
														display: this.state.openSommeliers
															? "block"
															: "none",
														position: "absolute",
														backgroundColor: "white",
														padding: "0px 15px",
														zIndex: "50",
														width: "100%",
														top: "45px",
														left: "0px",
														borderRadius: "4px",
														maxHeight: "350px",
														overflowY: "scroll",
													}}
												>
													<div
														style={{
															width: "100%",
															padding: "0px 15px",
															height: "40px",
														}}
													>
														<input
															type="checkbox"
															defaultChecked={this.state.sommeliersClicked?.All}
															// checked={item.value == 22}

															// value={}
															onChange={(e) => this.multipleSelect("All")}
														/>
														<span style={{ color: "black" }}>Select All</span>
													</div>
													<div
														style={{
															width: "100%",
															padding: "0px 15px",
															height: "40px",
														}}
													>
														<input
															type="checkbox"
															defaultChecked={
																this?.state.sommeliersClicked?.Hospitality
															}
															// checked={item.value == 22}

															// value={}
															onChange={(e) =>
																this.multipleSelect("Hospitality")
															}
														/>{" "}
														<span style={{ color: "black" }}>
															{" "}
															Select All Hospitality
														</span>
													</div>
													<div
														style={{
															width: "100%",
															padding: "0px 15px",
															height: "40px",
														}}
													>
														<input
															type="checkbox"
															defaultChecked={
																this?.state.sommeliersClicked?.Press
															}
															// checked={item.value == 22}

															// value={}
															onChange={(e) => this.multipleSelect("Press")}
														/>{" "}
														<span style={{ color: "black" }}>
															Select All Press
														</span>
													</div>
													<div
														style={{
															width: "100%",
															padding: "0px 15px",
															height: "40px",
														}}
													>
														<input
															type="checkbox"
															defaultChecked={
																this?.state.sommeliersClicked?.Importer
															}
															// checked={item.value == 22}

															// value={}
															onChange={(e) => this.multipleSelect("Importer")}
														/>{" "}
														<span style={{ color: "black" }}>
															Select All Importer
														</span>
													</div>
													{this.state.sommeliers.map((item, key) => {
														// console.log(item, "<<<<");
														return (
															<div
																style={{
																	width: "100%",
																	padding: "0px 15px",
																	height: "40px",
																}}
															>
																<input
																	type="checkbox"
																	defaultChecked={
																		this?.state.sommeliersClicked
																			?.Hospitality == true &&
																		item.work_type == null
																	}
																	// checked={item.value == 22}
																	checked={
																		(this?.state.sommeliersClicked
																			?.Hospitality == true &&
																			item.work_type == "Hospitality") ||
																		(this?.state.sommeliersClicked?.Importer ==
																			true &&
																			item.work_type == "Importer") ||
																		(this?.state.sommeliersClicked?.Press ==
																			true &&
																			item.work_type == "Press") ||
																		this?.state.sommeliersClicked?.All ==
																			true ||
																		this.state.selectedSommieliers.includes(
																			item.id
																		)
																	}
																	style={{ color: "black" }}
																	// value={}
																	onChange={(e) => this.selectSingle(item)}
																/>{" "}
																<span style={{ color: "black" }}>
																	{item.name} ({item.job_title}
																	{item.company != null && item.name && (
																		<span>, </span>
																	)}
																	{item.company}
																	{item.work_type != null && item.company && (
																		<span>, </span>
																	)}
																	{item.work_type})
																</span>
															</div>
														);
													})}
												</div>
											</div>

											{/* <MultiSelect
                        options={this.state.sommeliers}
                        value={this.state.selectedSommieliers}
                        onChange={this.setSelected1}
                        labelledBy="Select"
                      />
										  <MultiSelect
                        options={[{label:"label",id:"id"}]}
                        value={this.state.selectedSommieliers}
                        onChange={this.setSelected1}
                        labelledBy="Select"
                      />
											{this.state.errors.products && (
												<p className="error-class-add-event">
													{this.state.errors.products}
												</p>
											)}
										</Form.Group> */}
                    <Row>
                      <Col>
                        <Form.Group controlId="eventName">
                          <Form.Label className="text-light">
                            Tasting Name
                          </Form.Label>
                          <Form.Control
                            className={
                              "form-control " + this.state.errorClass.name
                            }
                            onChange={this.handleChange}
                            type="text"
                            name="name"
                            placeholder="Tasting Name"
                          />
                          {this.state.errors.name && (
                            <p className="error-class-add-event">
                              {this.state.errors.name}
                            </p>
                          )}
                        </Form.Group>
                        <Form.Group controlId="eventTime">
                          <Form.Label className="text-light">
                            Tasting Start Time
                          </Form.Label>
                          <Calendar
                            id="time12"
                            value={this.state.date9}
                            onChange={e => {
                              this.setState({ date9: e.value });
                            }}
                            timeOnly
                            hourFormat="24"
                          />
                        </Form.Group>
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
                        {this.state.errors.image && (
                          <p className="error-class-add-event">
                            {this.state.errors.image}
                          </p>
                        )}
                      </Col>
                      <Col>
                        <Form.Group controlId="eventDate">
                          <Form.Label className="text-light">
                            Tasting Date
                          </Form.Label>
                          <DatePicker
                            name="dob"
                            style={{ width: "100%" }}
                            onChange={this.dateChange}
                            format={dateFormat}
                            className={
                              "form-control " + this.state.errorClass.date
                            }
                            placeholder="Select date [ yyyy/mm/dd ]"
                            disabledDate={this.disabledDate}
                          />
                          {this.state.errors.date && (
                            <p className="error-class-add-event">
                              {this.state.errors.date}
                            </p>
                          )}
                        </Form.Group>
                        {/* <Form.Group controlId="eventCapacity">
                          <Form.Label className="text-light">
                            Event Capacity
                          </Form.Label>
                          <Form.Control
                            onChange={this.handleChange}
                            type="text"
                            className={
                              "form-control " + this.state.errorClass.capacity
                            }
                            name="capacity"
                            placeholder="500"
                          />
                          {this.state.errors.capacity && (
                            <p className="error-class-add-event">
                              {this.state.errors.capacity}
                            </p>
                          )}
                        </Form.Group> */}
                        <Form.Group controlId="eventEndTime">
                          <Form.Label className="text-light">
                            Tasting End Time
                          </Form.Label>
                          <Calendar
                            id="time123"
                            value={this.state.end_time}
                            onChange={e => this.setState({ end_time: e.value })}
                            timeOnly
                            hourFormat="24"
                          />
                          {this.state.errors.end_time && (
                            <p className="error-class-add-event">
                              {this.state.errors.end_time}
                            </p>
                          )}
                        </Form.Group>
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
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="location">
                          <Form.Label className="text-light">
                            Location
                          </Form.Label>
                          <PlacesAutocomplete
                            value={this.state.address}
                            onChange={this.handleMapChange}
                            onSelect={this.handleMapSelect}
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading,
                            }) => (
                              <div>
                                <input
                                  {...getInputProps({
                                    placeholder: "Search Places ...",
                                    className:
                                      "form-control location-search-input",
                                  })}
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                      ? "suggestion-item--active"
                                      : "suggestion-item";
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                      ? {
                                        backgroundColor: "#fafafa",
                                        cursor: "pointer",
                                      }
                                      : {
                                        backgroundColor: "#ffffff",
                                        cursor: "pointer",
                                      };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </Form.Group>
                        <Form.Group controlId="country">
                          <Form.Label className="text-light">
                            Country
                          </Form.Label>
                          <Dropdown
                            value={this.state.selectedCountry}
                            options={this.state.countries}
                            optionLabel="name"
                            className={
                              "form-control " +
                              this.state.errorClass.country_code
                            }
                            placeholder="Countries"
                          />
                          {this.state.errors.country_code && (
                            <p className="error-class-add-event">
                              {this.state.errors.country_code}
                            </p>
                          )}
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="state">
                          <Form.Label className="text-light">State</Form.Label>
                          <Form.Control
                            type="text"
                            className={
                              "form-control " + this.state.errorClass.state
                            }
                            defaultValue={this.state.eventData.state}
                            name="state"
                            onChange={this.handleChange}
                            placeholder="State"
                          />
                          {this.state.errors.state && (
                            <p className="error-class-add-event">
                              {this.state.errors.state}
                            </p>
                          )}
                        </Form.Group>
                        <Form.Group controlId="city">
                          <Form.Label className="text-light">City</Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={this.state.eventData.city}
                            className={
                              "form-control " + this.state.errorClass.city
                            }
                            name="city"
                            onChange={this.handleChange}
                            placeholder="City"
                          />
                          {this.state.errors.city && (
                            <p className="error-class-add-event">
                              {this.state.errors.city}
                            </p>
                          )}
                        </Form.Group>
                      </Col>
                      <Col>
                        {/* <Form.Group controlId="city">
                          <Form.Label className="text-light">
                            latitude
                          </Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={this.state.eventData.latitude}
                            className={
                              "form-control " + this.state.errorClass.latitude
                            }
                            disabled
                            name="latitude"
                            placeholder="latitude"
                          />
                          {this.state.errors.latitude && (
                            <p className="error-class-add-event">
                              {this.state.errors.latitude}
                            </p>
                          )}
                        </Form.Group> */}
                        <Form.Group controlId="eventLocation">
                          <Form.Label className="text-light">
                            Event Location
                          </Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={this.state.eventData.address_1}
                            className={
                              "form-control " + this.state.errorClass.address_1
                            }
                            name="address_1"
                            onChange={this.handleChange}
                            placeholder="Event Location"
                          />
                          {this.state.errors.address_1 && (
                            <p className="error-class-add-event">
                              {this.state.errors.address_1}
                            </p>
                          )}
                        </Form.Group>
                        {/* <Form.Group controlId="city">
                          <Form.Label className="text-light">
                            Longitude
                          </Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={this.state.eventData.longitude}
                            className={
                              "form-control " + this.state.errorClass.longitude
                            }
                            disabled
                            name="longitude"
                            placeholder="Longitude"
                          />
                          {this.state.errors.longitude && (
                            <p className="error-class-add-event">
                              {this.state.errors.longitude}
                            </p>
                          )}
                        </Form.Group> */}
                        <Form.Group controlId="postalCode">
                          <Form.Label className="text-light">
                            Postal Code
                          </Form.Label>
                          <Form.Control
                            onChange={this.handleChange}
                            type="text"
                            defaultValue={this.state.eventData.postcode}
                            className={
                              "form-control " + this.state.errorClass.postcode
                            }
                            name="postcode"
                            placeholder="123456"
                          />
                          {this.state.errors.postcode && (
                            <p className="error-class-add-event">
                              {this.state.errors.postcode}
                            </p>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

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
                      onClick={this.addEvent}
                      variant="contained"
                      className="py-1 mt-4 rounded-pill submitbtn-event"
                    >
                      Create Tasting
                    </Button>
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

export default withRouter(AddEvent);
