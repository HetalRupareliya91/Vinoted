import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import React, { Component } from "react";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import http from "../../config/http";
import ChatScreen from "./ChatScreen";
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isDisplayChat: false,
      to_user: "",
      user_name: "",
      user_img: "",
      status: "",
      active: 0,
      badgeCount: true,
      loader: false,
      outer_bar: false,
      open: false,
      snackbar: {
        message: "",
        status: "",
      },
      messages: [
        {
          id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            id: 2,
            name: "React",
            avatar: "https://facebook.github.io/react/img/logo_og.png",
          },
        },
      ],
    };
  }

  componentDidMount() {
    // console.log(document.referrer);
    // console.log(document.referrer.search("chats"));

    let stateNew = { ...this.state };
    stateNew.loader = true;
    setTimeout(() => {
      stateNew.loader = false;
      this.setState({
        stateNew,
      });
    }, 2000);
    this.getAllUsers();
  }

  getAllUsers = () => {
    http.get("chatlist").then((response) => {
      this.setState({ users: response.data.data });
      this.setState({ loader: false });
      let newUser = {};
      if (
        document.referrer.search("chats") === -1 &&
        localStorage.getItem("action") !== null
      ) {
        http
          .get("supplier/user/" + localStorage.getItem("action"))
          .then((response) => {
            if (response.data.data.user !== null) {
              newUser = response.data.data.user;
              this.setState({ loader: false });
            } else {
              newUser = {};
              this.setState({ loader: false });
            }
          });
        this.setState({ loader: false });
        setTimeout(() => {
          this.getNewUserMessage(newUser);
        }, 3000);
      }
    });
  };
  onUserSearch = (e) => {
    let stateNew = { ...this.state };
    stateNew.loader = true;
    this.setState(stateNew);
    if (e.target.value === "") {
      this.getAllUsers();
    } else {
      http
        .get("supplier/sommelierlist?search=" + e.target.value)
        .then((response) => {
          stateNew.users = response.data.data.page.data;
          stateNew.loader = false;
          this.setState(stateNew);
        });
    }
  };

  getMessages = (session_id) => {
    http.post("session/" + session_id + "/chats").then((response) => {
      let messages = [];
      response.data.data.forEach((element) => {
        messages.push({
          _id: element._id,
          id: element._id,
          createdAt: element.createdAt,
          text: element.text,
          read_at: element.read_at,
          user: {
            _id: element.user._id,
            id: element.user._id,
            name: element.user.name,
          },
          sent: true,
          received: true,
        });
      });

      this.setState({
        messages: messages.reverse(),
        isDisplayChat: true,
        // messages: GiftedChat.append(response.data.data),
      });
    });
  };
  getNewUserMessage = (data) => {
    this.setState({
      loader: true,
    });
    let users = [];
    this.state.users.forEach((element) => {
      if (element.name === data.name) {
        element.status = true;
        users.push(element);
      } else {
        element.status = false;
        users.push(element);
      }
    });

    if (this.state.isDisplayChat === true) {
      this.setState({
        isDisplayChat: false,
        users: users,
      });
    }

    let formData = new FormData();
    formData.append("friend_id", localStorage.getItem("action"));
    http.post("session/create", formData).then((response) => {
      let online = "";
      if (data.online === false) {
        online = "Offline";
      } else {
        online = "Online";
      }
      this.setState({
        messages: [],
        to_user: data.id,
        loader: false,
        session_id: response.data.data.id,
        user_name: data.name,
        user_img: data.profile.photo,
        status: online,
      });
      this.getMessages(response.data.data.id);
    });
  };
  getUserMessage = (data, key) => {
    let $ = require("jquery");

    $(`#badgecount${key}`).css("display", "none");
    this.setState({
      loader: true,
    });
    let users = [];
    this.state.users.forEach((element) => {
      if (element.id === key) {
        element.status = true;
        users.push(element);
      } else {
        element.status = false;
        users.push(element);
      }
    });

    if (this.state.isDisplayChat === true) {
      this.setState({
        isDisplayChat: false,
        users: users,
      });
    }

    let formData = new FormData();
    formData.append("friend_id", data.id);
    http.post("session/create", formData).then((response) => {
      let online = "";
      if (data.online === false) {
        online = "Offline";
      } else {
        online = "Online";
      }
      this.setState({
        messages: [],
        to_user: data.id,
        loader: false,
        session_id: response.data.data.id,
        user_name: data.name,
        user_img: data.profile,
        status: online,
      });
      this.getMessages(response.data.data.id);
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loader && <Loader />}
        {this.state.outer_bar && (
          <Snackbar open={this.state.open} message={this.state.snackbar} />
        )}
        <br></br>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <br></br>
              <Card className="chat-card-lists-user">
                <CardContent>
                  <h4 style={{ color: "white" }}>My Dashboard</h4>
                  <span className="p-input-icon-left chat-input-user">
                    <i className="pi pi-search" />
                    <InputText
                      onChange={this.onUserSearch}
                      placeholder="Search"
                      className="chat-input-inside"
                    />
                  </span>
                  {this.state.users.map((data, key) => (
                    <List key={key}>
                      <ListItem
                        id={"badge" + data.id}
                        onClick={() => this.getUserMessage(data, data.id)}
                        className={
                          data.status === true
                            ? "user-list-data list-active"
                            : "user-list-data"
                        }
                      >
                        <ListItemAvatar>
                          <Badge
                            className={
                              data.online
                                ? "online-badge"
                                : "online-badge-second"
                            }
                            // className="online-badge"
                            color="secondary"
                            variant="dot"
                          >
                            <Avatar>
                              {data.profile && (
                                <React.Fragment>
                                  <img
                                    className="user-avtar"
                                    src={
                                      data.profile ? data.profile : data.profile
                                    }
                                    alt={data.name}
                                  />
                                </React.Fragment>
                              )}
                              {!data.profile && (
                                <React.Fragment>
                                  <img
                                    className="user-avtar"
                                    src="https://zakirhussain.in/wp-content/uploads/2017/12/dummy-person.png"
                                    alt={data.name}
                                  />
                                </React.Fragment>
                              )}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          className="user-name-text"
                          primary={data.name}
                          secondary={data.message ? data.message.content : ""}
                        />

                        {data.message && (
                          <React.Fragment>
                            {this.state.badgeCount && (
                              <React.Fragment>
                                <Badge
                                  id={"badgecount" + data.id}
                                  badgeContent={data.session.unreadCount}
                                  color="primary"
                                  className="count-badges"
                                ></Badge>
                              </React.Fragment>
                            )}

                            <br></br>
                            <p
                              style={{
                                color: "#ada6a6",
                                marginBottom: -30,
                                marginLeft: -12,
                              }}
                            >
                              {moment(
                                data.message ? data.message.created_at : ""
                              ).format("h:mm")}
                            </p>
                          </React.Fragment>
                        )}
                      </ListItem>
                      <Divider />
                    </List>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="col-md-8 chat-content">
              {this.state.isDisplayChat && (
                <React.Fragment>
                  <br></br>
                  {/* {this.state.user_img && ( */}
                  <React.Fragment>
                    <ChatScreen
                      messages={this.state.messages}
                      user_img={this.state.user_img}
                      user_name={this.state.user_name}
                      to_user={this.state.to_user}
                      session_id={this.state.session_id}
                      status={this.state.status}
                    />
                  </React.Fragment>
                  {/* )} */}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Chat;
