import Button from "@material-ui/core/Button";
import moment from "moment";
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
// const dateFormat = "y/MM/DD";
// const timeFormat = "h:mm:ss A";

class EditEvent extends Component {
  constructor(props) {
    super(props);
    let today = new Date();
    let month = today.getMonth();
    // let year = today.getFullYear();
    // let prevMonth = month === 0 ? 11 : month - 1;
    // let prevYear = prevMonth === 11 ? year - 1 : year;
    // let nextMonth = month === 11 ? 0 : month + 1;
    // let nextYear = nextMonth === 0 ? year + 1 : year;
    this.status = [
      { name: "Publish", code: "Open" },
      { name: "Draft", code: "Hide" },
      { name: "Closed", code: "Closed" },
    ];
    this.minDate = new Date();
    // this.minDate.setMonth(1);
    // this.minDate.setFullYear(1985);

    this.maxDate = new Date();
    // this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear("2050");
    this.state = {
      event_end_time: "",
      data: {
        image: "",
      },
      latLng: {},
      text: "",
      address: "",
      map_url: "",
      openSommeliers: false,
      sommeliersClicked: {
        All: false,
        Hospitality: false,
        Press: false,
        Importer: false,
      },
      fileList: [
        {
          uid: -1,
          name: "xxx.png",
          status: "done",
          url: "https://cdn1.iconfinder.com/data/icons/image-manipulations/100/13-512.png",
        },
      ],
      date9: "",
      date4: "",
      previewVisible: false,
      previewImage: "",
      loader: false,
      outer_bar: false,
      open: false,
      snackbar: {
        message: "",
        status: "",
      },
      selectedStatus: null,
      selectedCountry: {},
      selectedProducts: [],
      selectedSommieliers: [],
      fullSommeliers: [],
      products: [],
      sommeliers: [],
      countries: [],
      eventData: {
        _method: "",
        name: "",
        status: "",
        capacity: "",
        address_1: "",
        description: "",
        date: "",
        event_end_time: "",
        latitude: "",
        longitude: "",
        slug: "",
        image: "",
        country: "",
        state: "",
        country_code: "",
        city: "",
        postcode: "",
        products: [],
        sommeliers: [],
      },
      errors: {
        name: "",
        capacity: "",
        country: "",
        state: "",
        city: "",
        status: "",
        postcode: "",
        address_1: "",
        description: "",
        date: "",
      },
      errorClass: {
        name: "",
        capacity: "",
        country: "",
        state: "",
        city: "",
        status: "",
        postcode: "",
        address_1: "",
        description: "",
        date: "",
      },
      fields: {
        name: "",
        address_1: "",
        description: "",
        date: "",
        event_end_time: "",
        image: "",
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

  onFileChange = (e) => {
    let stateNew = { ...this.state };
    stateNew.data[e.target.name] = e.target.files[0];
    stateNew.eventData[e.target.name] = e.target.files[0];
    stateNew.fields.image = "test";
    stateNew.remove = true;
    this.setState(stateNew);
    this.handleImgChange(e);
  };
  handleImgChange = (e) => {
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
      errors["name"] = "*Please enter tasting Name.";
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
    return current && current > moment().endOf("day");
  }

  componentDidMount() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    let stateNew = { ...this.state };
    stateNew.loader = true;
    this.setState(stateNew);
    let products = [];
    let date1 = "";
    let date = "";
    let country = "";
    let children = [];
    const sommeliers = [
      { label: "Select All Hospitality", value: -1 },
      { label: "Select All Press", value: -2 },
      { label: "Select All Importer", value: -3 },
    ];
    http
      .get("supplier/events/" + url.pathname.split("t/")[1])
      .then((response) => {
        if (response.data.data.page) {
          stateNew.fields.name = response.data.data.page.name;
          stateNew.fields.date = new Date(response.data.data.page.date);
          stateNew.fields.country_code = response.data.data.page.country_code;
          stateNew.fields.state = response.data.data.page.state;
          stateNew.fields.city = response.data.data.page.city;
          stateNew.fields.image = "test";
          stateNew.fields.description = response.data.data.page.description;
          stateNew.fields.address_1 = response.data.data.page.full_address;
          stateNew.fields.postcode = response.data.data.page.postcode;
          stateNew.fields.event_end_time = response.data.data.page.event_end_time;
          // stateNew.end_time = new Date(response.data.data.page.event_end_time);
          if (response.data.data.page.products.length === 0) {
            stateNew.selectedProducts = [];
            stateNew.eventData.products = [];
          } else {
            response.data.data.page.products.forEach((element) => {
              products.push({ label: element.title, value: element.id });
            });
            stateNew.selectedProducts = products;
            this.setState(stateNew);
          }
          stateNew.eventData.postcode = response.data.data.page.postcode;
          stateNew.eventData.event_end_time = new Date(
            response.data.data.page.event_end_time
          );
          if (response.data.data.page.eventrequests.length === 0) {
            stateNew.selectedSommieliers = [];
            stateNew.eventData.sommeliers = [];
          } else {
            const soms = [];
            // console.log(response.data.data.page.data, "<<<<ll;k");
            // response.data.data.page.eventrequests.forEach((el) => {
            // 	soms.push({ label: el.users.name, value: el.user_id });
            // });
            response.data.data.page.eventrequests.forEach((el) => {
              soms.push({
                label: `${el.users.name} (${el.users.job_title}, ${el.users.company
                  }${el.users.work_type ? ", " + el.users.work_type : ""})`,
                value: el.user_id,
              });
            });
            stateNew.selectedSommieliers = soms;
            this.setState(stateNew);
          }

          stateNew.eventData.image = "";
          let new_latlng = { lat: "", lng: "" };
          localStorage.setItem("event_latLng", JSON.stringify(new_latlng));
          if (localStorage.getItem("event_latLng") !== null) {
            localStorage.removeItem("event_latLng");
            new_latlng.lat = response.data.data.page.latitude;
            new_latlng.lng = response.data.data.page.longitude;
            localStorage.setItem("event_latLng", JSON.stringify(new_latlng));
          }

          let countries = [];
          countries.push({
            name: response.data.data.page.country_name,
            code: response.data.data.page.country_code,
          });
          stateNew.selectedCountry = countries[0];

          var d = new Date();
          d.setHours(
            response.data.data.page.date.substring(11, 16).split(":")[0]
          );
          d.setMinutes(
            response.data.data.page.date.substring(11, 16).split(":")[1]
          );
          var d2 = new Date();
          d2.setHours(
            response.data.data.page.event_end_time
              .substring(11, 16)
              .split(":")[0]
          );
          d2.setMinutes(
            response.data.data.page.event_end_time
              .substring(11, 16)
              .split(":")[1]
          );

          date1 = new Date(
            response.data.data.page.date.substring(0, 10).replaceAll("-", "/")
          );
          date = new Date(response.data.data.page.date).toUTCString();
          stateNew.eventData = response.data.data.page;

          stateNew.date4 = date1;
          stateNew.eventData.date = this.dateFormat(date1);
          country = response.data.data.page.country;
          stateNew.date9 = d;
          stateNew.event_end_time = d2;
          if (response.data.data.page.Imagesrc) {
            stateNew.data.image = response.data.data.page.Imagesrc;
            stateNew.eventData.image = response.data.data.page.Imagesrc;
          } else {
            stateNew.data.image =
              "https://www.vinoted-admin.com/images/no-image.png";
          }

          stateNew.text = response.data.data.page.description;
          let status = {};
          this.status.forEach((element) => {
            if (response.data.data.page.status === element.code) {
              status.name = element.name;
              status.code = element.code;
            }
          });
          stateNew.selectedStatus = status;
        }
        this.setState(stateNew);
      });
    http.get("supplier/products").then((response) => {
      let products = [];
      response.data.data.page.data.forEach((element) => {
        products.push({ label: element.title, value: element.id });
      });
      stateNew.products = products;
      stateNew.loader = false;
      this.setState(stateNew);
    });
    http.get("supplier/sommeliers").then((response) => {
      stateNew.fullSommeliers = response.data.data.page.data;
      response.data.data.page.data.forEach((element) => {
        sommeliers.push({
          label: `${element.name} (${element.job_title === null ? '' : element.job_title}  ${element.company === null ? '' : ', ' + element.company}${element.work_type ? ", " + element.work_type : ""
            //label: `${element.name} (${element.job_title}, ${element.company}${element.work_type ? ", " + element.work_type : ""
            })`,
          value: element.id,
        });
      });
      stateNew.sommeliers = sommeliers;
      this.setState(stateNew);
    });

    http.get("utilities/all").then((response) => {
      let countries = [];
      response.data.data.countries.forEach((element) => {
        countries.push({ name: element.name, code: element.code });
        if (element.code === country) {
          stateNew.selectedCountry.name = element.name;
          stateNew.selectedCountry.code = element.code;
        }
      });
      stateNew.countries = countries;
      this.setState(stateNew);
    });
  }

  handleEditorChange = (value) => {
    let stateNew = { ...this.state };
    stateNew.fields.description = value;
    stateNew.text = value;
    this.setState(stateNew);
  };

  handleMapChange = (address) => {
    this.setState({ address });
  };

  setSelected = (e) => {
    let stateNew = { ...this.state };
    stateNew.fields.products = "test";
    stateNew.selectedProducts = e;
    this.setState(stateNew);
  };

  setSelected1 = (data) => {
    let stateNew = { ...this.state };
    if (data.length - 2 === stateNew.selectedSommieliers.length) {
      stateNew.selectedSommieliers = [];
      this.setState(stateNew);
      return;
    }
    const values = data
      .map((el) => (el.value ? el.value : null))
      .filter((el) => el !== null);
    if (values.includes(-1) || values.includes(-2) || values.includes(-3)) {
      let count = 0,
        temp;
      values.forEach((val) => {
        if (val === -1 || val === -2 || val === -3) count++;
      });
      if (count === 1) {
        data.forEach((obj) => {
          if (obj.value === -1) {
            temp = stateNew.fullSommeliers.filter(
              (x) => x.work_type === "Hospitality"
            )[0];
          } else if (obj.value === -2) {
            temp = stateNew.fullSommeliers.filter(
              (x) => x.work_type === "Press"
            )[0];
          } else if (obj.value === -3) {
            temp = stateNew.fullSommeliers.filter(
              (x) => x.work_type === "Importer"
            )[0];
          }
        });
        const value = temp.id;
        const label = `${temp.name} (${temp.job_title}, ${temp.company}${temp.work_type ? ", " + temp.work_type : ""
          })`;
        data.push({ value, label });

        const dupeCountMap = {};

        data
          .filter((x) => x.value !== -1 && x.value !== -2 && x.value !== -3)
          .forEach(({ value }) => {
            dupeCountMap[value] = dupeCountMap[value]
              ? dupeCountMap[value] + 1
              : 1;
          });

        stateNew.selectedSommieliers = data
          .filter((x) => x.value !== -1 && x.value !== -2 && x.value !== -3)
          .filter((obj) => dupeCountMap[obj.value] === 1);

        this.setState(stateNew);
        return;
      }
    }
    let temp = [];
    data.forEach((obj) => {
      if (obj.value === -1) {
        temp = stateNew.fullSommeliers.filter(
          (x) => x.work_type === "Hospitality"
        );
      } else if (obj.value === -2) {
        temp = stateNew.fullSommeliers.filter((x) => x.work_type === "Press");
      } else if (obj.value === -3) {
        temp = stateNew.fullSommeliers.filter(
          (x) => x.work_type === "Importer"
        );
      } else return obj;
    });
    stateNew.selectedSommieliers = data
      .filter((x) => x.value !== -1 && x.value !== -2 && x.value !== -3)
      .concat(
        temp.map((t) => {
          const value = t.id;
          const label = `${t.name} (${t.job_title}, ${t.company}${temp.work_type ? ", " + temp.work_type : ""
            })`;
          return { value, label };
        })
      );
    this.setState(stateNew);
  };

  handleMapSelect = (address) => {
    let stateNew = { ...this.state };
    let address1 = "";
    let address2 = "";
    let address3 = "";
    let state = "";
    let city = "";
    let country = {};
    let postcode = "";

    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) =>
        localStorage.setItem("event_latLng", JSON.stringify(latLng))
      )
      .catch((error) => console.error("Error", error));
    geocodeByAddress(address)
      .then((results) =>
        results.forEach((element) => {
          element.address_components.forEach((ele) => {
            ele.types.forEach((e) => {
              if (e === "premise") {
                address1 = ele.long_name;
              } else if (e === "route") {
                address2 = ele.long_name;
              } else if (e === "sublocality" || e === "sublocality_level_1") {
                address3 = ele.long_name;
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
          stateNew.eventData.address_1 =
            address1 + " " + address2 + " " + address3;
          stateNew.selectedCountry = country;
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
      .catch((error) => console.error("Error", error));
  };

  editEvent = () => {
    if (this.validateForm()) {
      if (this.state.selectedProducts.length === 0) {
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.open = true;
        stateNew.snackbar.message = "Please select products";
        stateNew.snackbar.status = "error";
        this.setState(stateNew);
      } else if (this.state.selectedSommieliers.length === 0) {
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.open = true;
        stateNew.snackbar.message = "Please select sommieliers";
        stateNew.snackbar.status = "error";
        this.setState(stateNew);
      } else if (this.state.fields.description === "<p><br></p>") {
        if (this.state.outer_bar === true) {
          this.setState({ outer_bar: false });
        }
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.open = true;
        stateNew.snackbar.message = "Please enter description";
        stateNew.snackbar.status = "error";
        this.setState(stateNew);
      } else {
        var url_string = window.location.href;
        var url = new URL(url_string);
        if (this.state.outer_bar === true) {
          this.setState({ outer_bar: false });
        }
        this.setState({ loader: true });
        let formData = new FormData();
        // console.log(this.state.end_time, "dddd");
        let ev_enddate = new Date(this.state.eventData.event_end_time);
        let endDate = 
        this.dateFormat(ev_enddate)  +
          " " +
          this.state.event_end_time.toLocaleTimeString();

        let date =
          this.state.eventData.date.replaceAll("/", "-") +
          " " +
          this.state.date9.toLocaleTimeString();
        for (const [key, value] of Object.entries(this.state.eventData)) {
          if (key === "date" && this.state.date9) {
            if (date.search("AM") > 0) {
              formData.append("date", date.split(" AM")[0]);
            } else if (date.search("PM") > 0) {
              formData.append("date", date.split(" PM")[0]);
            } else {
              formData.append("date", date);
            }
          } else if (key === "event_end_time" && this.state.event_end_time) {
            if (endDate.search("AM") > 0) {
              formData.append("event_end_time", endDate.split(" AM")[0]);
            } else if (endDate.search("PM") > 0) {
              formData.append("event_end_time", endDate.split(" PM")[0]);
            } else {
              formData.append("event_end_time", endDate);
            }
          } else if (
            key === "products" &&
            typeof this.state.selectedProducts !== "undefined"
          ) {
            this.state.selectedProducts.forEach((element, key) => {
              formData.append(`products[${key}]`, element.value);
            });
          } else if (
            key === "eventrequests" &&
            typeof this.state.selectedSommieliers !== "undefined"
          ) {
            this.state.selectedSommieliers.forEach((element, key) => {
              formData.append(`sommeliers[${key}]`, element.value);
            });
          } else if (key === "image") {
            formData.append("image", this.state.eventData.image);
          } else if (key === "slug") {
            formData.append(
              "slug",
              this.state.eventData.name.toLowerCase().replace(" ", "_")
            );
          } else if (key === "Imagesrc") {
            delete [key];
          } else if (key === "is_send") {
            delete [key];
          } else if (key === "is_started") {
            delete [key];
          } else if (key === "eventrequests") {
            delete [key];
          } else if (key === "deleted_at") {
            delete [key];
          } else if (key === "created_at") {
            delete [key];
          } else if (key === "updated_at") {
            delete [key];
          } else if (key === "id") {
            delete [key];
          } else if (key === "user_id") {
            delete [key];
          } else if (key === "status" && this.state.selectedStatus !== null) {
            formData.append("status", this.state.selectedStatus.code);
          } else if (
            key === "country_code" &&
            this.state.selectedCountry !== null
          ) {
            formData.append("country_code", this.state.selectedCountry.code);
          } else if (key === "description") {
            formData.append("_method", "PUT");
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

        formData.append(
          "latitude",
          JSON.parse(localStorage.getItem("event_latLng")).lat
        );
        formData.append(
          "longitude",
          JSON.parse(localStorage.getItem("event_latLng")).lng
        );

        http
          .post("supplier/events/" + url.pathname.split("t/")[1], formData)
          .then((response) => {
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
    }
  };

  handlePreview = (file) => {
    let stateNew = { ...this.state };
    stateNew.formData.previewImage = file.url || file.thumbUrl;
    stateNew.formData.previewVisible = true;
    this.setState({ stateNew });
  };

  handleChange = (e) => {
    let stateNew = { ...this.state };
    stateNew.eventData[e.target.name] = e.target.value;
    stateNew.errorClass[e.target.name] = "";
    stateNew.fields[e.target.name] = e.target.value;
    stateNew.errors[e.target.name] = "";
    if (e.target.name === "address_1") {
      stateNew.mapDiv = true;
      stateNew.map_url = e.target.value;
    }
    this.setState(stateNew);
  };

  multipleSelect = (data) => {
    // alert(data);
    let stateNew = { ...this.state };
    stateNew.sommeliersClicked[`${data}`] =
      !stateNew.sommeliersClicked[`${data}`];
    stateNew.selectedSommieliers = this.state.sommeliers.filter(
      (item) => item.work_type == data
    );
    this.setState(stateNew);
    // console.log(stateNew.selectedSommieliers, "<<<<hos");
  };
  selectSingle = (data) => {
    // alert(data, "<<<<<");
    let stateNew = { ...this.state };
    const previousSommeliers = stateNew.selectedSommieliers;
    const IsSommeliersPresent = previousSommeliers.includes(data);
    // console.log(IsSommeliersPresent, "<<<<issomme");
    if (!IsSommeliersPresent) {
      // alert("not present");
      stateNew.selectedSommieliers = [...previousSommeliers, data];
    } else {
      stateNew.selectedSommieliers = previousSommeliers.filter(
        (item) => item != data
      );
    }
    this.setState(stateNew);
    // console.log(stateNew.selectedSommieliers, "<<<<hos");
  };

  dateChange = (e, date, dateString) => {
    let final = this.dateFormat(e.value);
    let stateNew = { ...this.state };
    stateNew.eventData.date = final;
    this.setState(stateNew);
  };

  dateFormat = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };

  timeChange = (value) => {
    let stateNew = { ...this.state };
    stateNew.date9 = value;
    this.setState(stateNew);
  };

  onStatusChange = (e) => {
    console.log(e.value);
    this.setState({ selectedStatus: e.value });
  };

  handleImageChange = ({ fileList }) => {
    let stateNew = { ...this.state };
    stateNew.fields.image = "test";
    stateNew.fileList = fileList;
    this.setState(stateNew);
  };

  render() {
    const { fileList } = this.state;
    const uploadButton = (
      <div>
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    let $ = require("jquery");

    $(".p-multiselect-token").each(function () {
      if ($(this).text() === "") {
        $(this).hide();
      }
    });

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
                    <h4 className="text-light">Edit Tasting</h4>
                    <hr style={{ backgroundColor: "grey" }} />
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label className="text-light">
                        Choose Wine Products - (Click on wines in order of
                        tasting) &nbsp;&nbsp;&nbsp;&nbsp;
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
                    <Form.Group
                      className="somm-multi-select"
                      controlId="exampleForm.ControlSelect1"
                    >
                      <Form.Label className="text-light">
                        Choose Sommeliers
                      </Form.Label>
                      <MultiSelect
                        options={this.state.sommeliers}
                        value={this.state.selectedSommieliers}
                        onChange={this.setSelected1}
                        labelledBy="Select sommeliers"
                      />
                      {this.state.errors.sommeliers && (
                        <p className="error-class-add-event">
                          {this.state.errors.sommeliers}
                        </p>
                      )}
                    </Form.Group>
                    <Row>
                      <Col>
                        <Form.Group controlId="eventName">
                          <Form.Label className="text-light">
                            Tatsing Name
                          </Form.Label>
                          <Form.Control
                            className={
                              "form-control " + this.state.errorClass.name
                            }
                            defaultValue={this.state.eventData.name}
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
                            // onChange={(e) => this.setState({ date9: e.value })}
                            onChange={(e) => this.timeChange(e.value)}
                            timeOnly
                            hourFormat="24"
                          />
                        </Form.Group>

                        {/* <Form.Group controlId="eventCapacity">
                          <Form.Label className="text-light">
                            Event Capacity
                          </Form.Label>
                          <Form.Control
                            onChange={this.handleChange}
                            type="text"
                            defaultValue={this.state.eventData.capacity}
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
                              src=" https://www.vinoted-admin.com/images/placeholder-image.png"
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
                      </Col>

                      <Col>
                        <Form.Group controlId="eventDate">
                          <Form.Label className="text-light">
                            Tasting Date
                          </Form.Label>

                          <Calendar
                            id="minmax"
                            value={this.state.date4}
                            onChange={this.dateChange}
                            minDate={this.minDate}
                            maxDate={this.maxDate}
                            style={{ width: "100%" }}
                            readOnlyInput
                            dateFormat="yy/mm/dd"
                          />
                        </Form.Group>

                        <Form.Group controlId="eventEndTime">
                          <Form.Label className="text-light">
                            Tasting End Time
                          </Form.Label>
                          <Calendar
                            id="time12345"
                            value={this.state.event_end_time}
                            // onChange={e => {
                            // 	const stateNew = { ...this.state };
                            // 	stateNew.end_time = e.value;
                            // 	this.setState(stateNew);
                            // }}
                            onChange={(e) => {
                              let final = this.dateFormat(e.value);
                              let stateNew = { ...this.state };
                              stateNew.eventData.event_end_time = final;
                              this.setState(stateNew);
                            }}
                            timeOnly
                            hourFormat="24"
                          />
                          {this.state.errors.event_end_time && (
                            <p className="error-class-add-event">
                              {this.state.errors.event_end_time}
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
                                  {suggestions.map((suggestion) => {
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
                            disabled
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
                            Tasting Location
                          </Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={this.state.eventData.address_1}
                            className={
                              "form-control " + this.state.errorClass.address_1
                            }
                            name="address_1"
                            onChange={this.handleChange}
                            placeholder="Tasting Location"
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
                    <Form.Group controlId="formBasicEmail">
                      <Button
                        onClick={this.editEvent}
                        variant="contained"
                        className="py-1 mt-4 rounded-pill submitbtn-event"
                      >
                        Update Tasting
                      </Button>
                    </Form.Group>
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

export default withRouter(EditEvent);
