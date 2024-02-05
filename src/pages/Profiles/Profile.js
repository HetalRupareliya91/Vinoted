import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { Component } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BiEdit, BiPhoneCall } from "react-icons/bi";
import { BsFlag } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Link } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import auth from "../../config/AuthHelper";
import http from "../../config/http";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        photo: "",
      },
      profile: {},
      latLng: {},
      photo: "",
      fileList: [
        {
          uid: -1,
          name: "xxx.png",
          status: "done",
          url: "https://cdn1.iconfinder.com/data/icons/image-manipulations/100/13-512.png",
        },
      ],
      address: "",
      photo: "",
      user: {},
      loader: false,
      outer_bar: false,
      open: false,
      snackbar: {
        message: "",
        status: "",
      },
      displayPosition: false,
      errors: {
        first_name: "",
        last_name: "",
        address_1: "",
        state: "",
        photo: "",
        city: "",
        latitude: "",
        postcode: "",
        longitude: "",
        country_code: "",
      },
      errorClass: {
        first_name: "",
        last_name: "",
        state: "",
        city: "",
        latitude: "",
        photo: "",
        postcode: "",
        country_code: "",
        address_1: "",
        longitude: "",
      },
      fields: {
        first_name: "",

        phone: "",
        email: "",
        country_code: "",
        city: "",
        postcode: "",
      },
    };
  }

  validateForm = () => {
    let fields = this.state.fields;
    let errors = {};
    let errorClass = {};
    let formIsValid = true;
    if (!fields.first_name) {
      formIsValid = false;
      errors["first_name"] = "*Please fill First Name.";
      errorClass["first_name"] = "is-invalid";
    }
    if (!fields.email) {
      formIsValid = false;
      errors["email"] = "*Please fill email.";
      errorClass["email"] = "is-invalid";
    }

    if (!fields.country_code) {
      formIsValid = false;
      errors["country_code"] = "*Please select Country.";
      errorClass["country_code"] = "is-invalid";
    }
    if (!fields.phone) {
      formIsValid = false;
      errors["phone"] = "*Please select phone.";
      errorClass["phone"] = "is-invalid";
    }
    if (!fields.city) {
      formIsValid = false;
      errors["city"] = "*Please select city.";
      errorClass["city"] = "is-invalid";
    }

    if (!fields.postcode) {
      formIsValid = false;
      errors["postcode"] = "*Please fill postcode.";
      errorClass["postcode"] = "is-invalid";
    }
    this.setState({
      errors: errors,
      errorClass,
    });

    return formIsValid;
  };

  chooseImage = () => {
    document.getElementById("photo").click();
  };

  onFileChange = (e) => {
    let stateNew = { ...this.state };
    stateNew.data[e.target.name] = e.target.files[0];
    stateNew.user[e.target.name] = e.target.files[0];
    stateNew.remove = true;
    this.setState(stateNew);
    this.handleImgChange(e);
  };
  handleImgChange = (e) => {
    var data = { ...this.state.data };
    data.photo = URL.createObjectURL(e.target.files[0]);
    this.setState({ data });
  };

  renderFooter = (name) => {
    return (
      <div>
        <Button
          variant="contained"
          onClick={() => this.onHide(name)}
          className="p-button-text"
        >
          Cancel
        </Button>
        <Button
          className="profile-update-btn"
          variant="contained"
          onClick={() => this.onSuccess(name)}
          autoFocus
        >
          Update
        </Button>
      </div>
    );
  };

  dataRefresh = () => {
    let stateNew = { ...this.state };
    let address = "";
    let saddress = "";
    http.get("supplier/profile").then((response) => {
      stateNew.user.first_name = response.data.data.user.profile.first_name;
      stateNew.user.email = response.data.data.user.email;
      stateNew.user.phone = response.data.data.user.phone;
      stateNew.address = "";
      stateNew.user.address = response.data.data.user.default_address.address_1
        ? response.data.data.user.default_address.address_1
        : "";
      stateNew.user.city = response.data.data.user.default_address.city
        ? response.data.data.user.default_address.city
        : "";
      stateNew.user.postcode = response.data.data.user.default_address.postcode
        ? response.data.data.user.default_address.postcode
        : "";
      stateNew.user.country_code = response.data.data.user.default_address
        .country_code
        ? response.data.data.user.default_address.country_code
        : "";

      stateNew.fields.first_name = response.data.data.user.profile.first_name;
      stateNew.fields.email = response.data.data.user.email;
      stateNew.fields.phone = response.data.data.user.phone;

      stateNew.fields.city = response.data.data.user.default_address.city
        ? response.data.data.user.default_address.city
        : "";
      stateNew.fields.postcode = response.data.data.user.default_address
        .postcode
        ? response.data.data.user.default_address.postcode
        : "";
      stateNew.fields.country_code = response.data.data.user.default_address
        .country_code
        ? response.data.data.user.default_address.country_code
        : "";

      stateNew.photo = response.data.data.user.profile.photo;

      stateNew.user.last_name = response.data.data.user.profile.last_name;

      stateNew.user.country_name =
        response.data.data.user.default_address.country_name;
      stateNew.user.state = response.data.data.user.default_address.state
        ? response.data.data.user.default_address.state
        : "";

      let new_latlng = { lat: 10.2545, lng: 10.2525 };
      localStorage.setItem("profile_latLng", JSON.stringify(new_latlng));
      if (localStorage.getItem("profile_latLng") !== null) {
        localStorage.removeItem("profile_latLng");
        new_latlng.lat = response.data.data.user.default_address.latitude
          ? response.data.data.user.default_address.latitude
          : 10.2525;
        new_latlng.lng = response.data.data.user.default_address.longitude
          ? response.data.data.user.default_address.longitude
          : 10.2525;
        localStorage.setItem("profile_latLng", JSON.stringify(new_latlng));
      }

      if (!response.data.data.user.profile.photo) {
        stateNew.data.photo =
          "https://www.scullyrsv.com.au/wp-content/uploads/2018/06/dummy-profile-pic-male1-300x300.jpg";
      } else {
        stateNew.data.photo = response.data.data.user.profile.photo;
        stateNew.user.photo = response.data.data.user.profile.photo;
      }

      this.setState(stateNew);
    });
    stateNew.profile = auth.isAuthenticated().user;
    if (typeof auth.isAuthenticated().user.default_address !== "undefined") {
      if (
        auth.isAuthenticated().user.default_address.address_2 === null ||
        auth.isAuthenticated().user.default_address.address_2 === "null"
      ) {
        saddress = "";
      }
      address =
        auth.isAuthenticated().user.default_address.address_1 +
        " " +
        saddress +
        " " +
        auth.isAuthenticated().user.default_address.city +
        " " +
        auth.isAuthenticated().user.default_address.state;
    }
    let photo = auth.isAuthenticated().user.profile.photo;
    stateNew.address = address;
    stateNew.photo = photo;
    this.setState(stateNew);
  };

  onSuccess = () => {
    if (this.validateForm()) {
      let phone = this.state.user.phone;
      if (phone === null) {
        phone = "";
      }
      if (JSON.parse(localStorage.getItem("profile_latLng")) === null) {
        this.toastTL.show({
          severity: "error",
          summary: "Info Message",
          detail: "Phone number must be 10 digit.",
          life: 3000,
        });
      } else {
        if (this.state.outer_bar === true) {
          this.setState({ outer_bar: false });
        }
        this.setState({ loader: true });
        let formData = new FormData();
        for (const [key, value] of Object.entries(this.state.user)) {
          if (key === "country_name") {
            if (this.state.user.country) {
              formData.append("country_code", this.state.user.country.code);
            } else {
              formData.append("country_code", this.state.user.country_code);
            }
          } else if (key === "email") {
            delete [key];
          } else if (key === "photo") {
            formData.append("photo", this.state.user.photo);
          } else if (key === "address") {
            formData.append("address_1", value);
          } else if (key === "country_code") {
            delete [key];
          } else if (key === "country") {
            delete [key];
          } else if (key === "latitude") {
          } else {
            formData.append(key, value);
          }
        }

        formData.append("phone", this.state.user.phone);
        if (localStorage.getItem("profile_latLng") !== null) {
          formData.append(
            "latitude",
            JSON.parse(localStorage.getItem("profile_latLng")).lat
          );
          formData.append(
            "longitude",
            JSON.parse(localStorage.getItem("profile_latLng")).lng
          );
        }
        http.post("supplier/profile", formData).then((response) => {
          if (response.code === 200) {
            let stateNew = { ...this.state };
            stateNew.outer_bar = true;
            stateNew.open = true;
            stateNew.loader = false;
            stateNew.snackbar.message = response.data.message;
            stateNew.snackbar.status = "success";
            stateNew.displayPosition = false;
            this.setState(stateNew);
            this.dataRefresh();
            let prevUser = JSON.parse(localStorage.getItem("vinoted-jwt"));
            prevUser.user = response.data.data.user[0];
            auth.authenticate(prevUser);
          } else if (response.code === 422) {
            let stateNew = { ...this.state };
            stateNew.outer_bar = true;
            // stateNew.open = true;
            stateNew.loader = false;
            if (response.errors) {
              stateNew.errors = response.errors;
              stateNew.errorClass.first_name = response.errors.first_name
                ? "is-invalid"
                : "";
              stateNew.errorClass.photo = response.errors.photo
                ? "is-invalid"
                : "";
              stateNew.errorClass.last_name = response.errors.last_name
                ? "is-invalid"
                : "";
              stateNew.errorClass.email = response.errors.email
                ? "is-invalid"
                : "";
              stateNew.errorClass.phone = response.errors.phone
                ? "is-invalid"
                : "";

              stateNew.errorClass.country = response.errors.country
                ? "is-invalid"
                : "";
              stateNew.errorClass.country_code = response.errors.country_code
                ? "is-invalid"
                : "";
              stateNew.errorClass.address_1 = response.errors.address_1
                ? "is-invalid"
                : "";
              stateNew.errorClass.postcode = response.errors.postcode
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
  onHide = (name) => {
    this.setState({
      [`${name}`]: false,
    });
  };

  handleMapChange = (address) => {
    this.setState({ address });
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
        localStorage.setItem("profile_latLng", JSON.stringify(latLng))
      )
      .catch((error) => console.error("Error", error));

    geocodeByAddress(address)
      .then((results) =>
        results.forEach((element) => {
          element.address_components.forEach((ele) => {
            console.log(ele);
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
          stateNew.user.address = address1 + " " + address2 + " " + address3;
          stateNew.user.country_name = country.name;
          stateNew.user.country_code = country.code;
          stateNew.user.state = state;
          stateNew.user.city = city;
          stateNew.user.postcode = postcode;

          stateNew.fields.address = address1 + " " + address2 + " " + address3;
          stateNew.fields.country_code = country.code;
          stateNew.fields.state = state;
          stateNew.fields.city = city;
          stateNew.fields.postcode = postcode;
          this.setState(stateNew);
        })
      )
      .catch((error) => console.error("Error", error));
  };

  handleImageChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  componentDidMount() {
    this.dataRefresh();
  }

  onClick = (name, position) => {
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

  handleUserChange = (e) => {
    let stateNew = { ...this.state };
    stateNew.user[e.target.name] = e.target.value;
    stateNew.fields[e.target.name] = e.target.value;
    stateNew.errorClass[e.target.name] = "";
    stateNew.errors[e.target.name] = "";
    this.setState(stateNew);
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
        <Toast ref={(el) => (this.toastTL = el)} position="top-left" />
        {this.state.loader && <Loader />}
        {this.state.outer_bar && (
          <Snackbar open={this.state.open} message={this.state.snackbar} />
        )}
        <Dialog
          header="Edit Profile"
          visible={this.state.displayPosition}
          position={this.state.position}
          modal
          style={{ width: "50vw" }}
          footer={this.renderFooter("displayPosition")}
          onHide={() => this.onHide("displayPosition")}
          draggable={false}
          resizable={false}
        >
          <p className="p-m-0">
            <div className="p-fluid p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                {this.state.data.photo && (
                  <React.Fragment>
                    <img
                      value={this.state.data.photo}
                      className="profileimage"
                      alt="a"
                      onClick={() =>
                        window.open(this.state.data.photo, "_blank")
                      }
                      src={this.state.data.photo}
                    />
                  </React.Fragment>
                )}
                {!this.state.data.photo && (
                  <img
                    className="profileimage"
                    alt="a"
                    src="https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image-300x225.png"
                  />
                )}

                <p></p>
                <Button variant="contained" onClick={this.chooseImage}>
                  Upload
                </Button>
                <input
                  type="file"
                  name="photo"
                  onChange={this.onFileChange}
                  id="photo"
                  style={{ display: "none" }}
                />
                {this.state.errors.photo && (
                  <p className="error-class-add-event">
                    {this.state.errors.photo}
                  </p>
                )}
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="firstname6">Company Name</label>
                <InputText
                  name="first_name"
                  defaultValue={this.state.user.first_name}
                  placeholder="First Name"
                  className={"form-control " + this.state.errorClass.first_name}
                  id="firstname6"
                  onChange={this.handleUserChange}
                  type="text"
                />
                {this.state.errors.first_name && (
                  <p className="error-class-add-event">
                    {this.state.errors.first_name}
                  </p>
                )}
              </div>
              {/* <div className="p-field p-col-12 p-md-6">
                <label htmlFor="lastname6">Last Name</label>
                <InputText
                  id="lastname6"
                  name="last_name"
                  placeholder="Last Name"
                  className={"form-control " + this.state.errorClass.last_name}
                  defaultValue={this.state.user.last_name}
                  type="text"
                  onChange={this.handleUserChange}
                />
                {this.state.errors.last_name && (
                  <p className="error-class-add-event">
                    {this.state.errors.last_name}
                  </p>
                )}
              </div> */}
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  name="email"
                  defaultValue={this.state.user.email}
                  placeholder="Email"
                  type="text"
                  readOnly
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="email">Phone</label>
                <InputText
                  id="phone"
                  name="phone"
                  onChange={this.handleUserChange}
                  defaultValue={this.state.user.phone}
                  placeholder="Phone"
                  type="number"
                />
                {this.state.errors.phone && (
                  <p className="error-class-add-event">
                    {this.state.errors.phone}
                  </p>
                )}
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="zip">Location</label>
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
                          className: "form-control location-search-input",
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
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="address">Address</label>
                <InputText
                  name="address"
                  defaultValue={this.state.user.address}
                  placeholder="Address"
                  className={"form-control " + this.state.errorClass.address_1}
                  id="address"
                  onChange={this.handleUserChange}
                  type="text"
                />
                {this.state.errors.address_1 && (
                  <p className="error-class-add-event">
                    {this.state.errors.address_1}
                  </p>
                )}
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="country">Country</label>
                <InputText
                  name="country_name"
                  value={this.state.user.country_name}
                  id="country_name"
                  placeholder="Country"
                  type="text"
                  readOnly
                />
                {this.state.errors.country_code && (
                  <p className="error-class-add-event">
                    {this.state.errors.country_code}
                  </p>
                )}
              </div>
              {/* <div className="p-field p-col-12 p-md-6">
                <label htmlFor="state">State</label>
                <InputText
                  name="state"
                  value={this.state.user.state}
                  id="state"
                  placeholder="State"
                  onChange={this.handleUserChange}
                  type="text"
                />
              </div> */}
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="city">City</label>
                <InputText
                  name="city"
                  value={this.state.user.city}
                  id="city"
                  placeholder="City"
                  onChange={this.handleUserChange}
                  type="text"
                />
                {this.state.errors.city && (
                  <p className="error-class-add-event">
                    {this.state.errors.city}
                  </p>
                )}
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="postcode">Post Code</label>

                <InputText
                  name="postcode"
                  value={this.state.user.postcode}
                  id="postcode"
                  placeholder="Postcode"
                  type="text"
                  onChange={this.handleUserChange}
                />
                {this.state.errors.postcode && (
                  <p className="error-class-add-event">
                    {this.state.errors.postcode}
                  </p>
                )}
              </div>
              {/* <div className="p-field p-col-12 p-md-6">
                <label htmlFor="postcode">Latitude</label>
                <InputText
                  name="latitude"
                  value={this.state.user.latitude}
                  id="latitude"
                  placeholder="Latitude"
                  type="text"
                  readOnly
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="postcode">Longitude</label>
                <InputText
                  name="longitude"
                  value={this.state.user.longitude}
                  id="longitude"
                  placeholder="Longitude"
                  type="text"
                  readOnly
                />
              </div> */}
            </div>
          </p>
        </Dialog>
        <Card className="profile-card-dashboard">
          <CardContent>
            <Link to="/">
              <h4 className="text-light">My Dashboard</h4>
            </Link>
            {this.state.photo && (
              <React.Fragment>
                <img
                  className="py-3 dash-profile-img"
                  src={this.state.photo}
                  style={{ borderRadius: "50%" }}
                  alt="image"
                />
              </React.Fragment>
            )}
            {!this.state.photo && (
              <img
                className="py-3 dash-profile-img"
                src="https://www.scullyrsv.com.au/wp-content/uploads/2018/06/dummy-profile-pic-male1-300x300.jpg"
                style={{ borderRadius: "50%" }}
                alt="image"
              />
            )}

            <h5 className="py-2" style={{ color: "white" }}>
              {this.state.user.first_name}
              {/* &nbsp;
              {this.state.user.last_name} */}
            </h5>
            <ul className="user-detail-list">
              {this.state.user.email && (
                <React.Fragment>
                  <li
                    className="text-light text-light-list"
                    style={{ listStyleType: "none", fontWeight: "300" }}
                  >
                    <AiOutlineMail className="mr-2" />
                    {this.state.user.email}
                  </li>
                </React.Fragment>
              )}
              {this.state.user.phone && (
                <React.Fragment>
                  <li
                    className="text-light text-light-list"
                    style={{ listStyleType: "none", fontWeight: "300" }}
                  >
                    {" "}
                    <BiPhoneCall className="mr-2" />
                    {this.state.user.phone}
                  </li>
                </React.Fragment>
              )}
              {this.state.user.address && (
                <React.Fragment>
                  <li
                    className="text-light text-light-list"
                    style={{ listStyleType: "none", fontWeight: "300" }}
                  >
                    {" "}
                    <IoLocationOutline className="mr-2" />
                    <React.Fragment>{this.state.user.address}</React.Fragment>
                  </li>
                </React.Fragment>
              )}
              {this.state.user.country_name && (
                <React.Fragment>
                  <li
                    className="text-light text-light-list"
                    style={{ listStyleType: "none", fontWeight: "300" }}
                  >
                    {" "}
                    <BsFlag className="mr-2" />
                    <React.Fragment>
                      {this.state.user.country_name}
                    </React.Fragment>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => this.onClick("displayPosition", "left")}
              className="profile-action-btn"
              variant="contained"
              size="small"
            >
              <BiEdit />
              &nbsp; Edit
            </Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
}

export default Profile;
