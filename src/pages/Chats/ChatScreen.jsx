import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import React, { Component } from "react";
import { GiftedChat } from "react-web-gifted-chat";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import auth from "../../config/AuthHelper";
import echoURL from "../../config/echoURL";
import http from "../../config/http";
class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to_user: "",
      user_name: "",
      user_img: "",
      status: "",
      messages: [],
      session_id: "",
      outer_bar: false,
      open: false,
      snackbar: {
        message: "",
        status: "",
      },
    };
  }
  componentDidMount() {
    let stateNew = { ...this.state };
    stateNew.to_user = this.props.to_user;
    stateNew.user_name = this.props.user_name;
    stateNew.user_img = this.props.user_img;
    stateNew.status = this.props.status;
    stateNew.messages = this.props.messages;
    stateNew.session_id = this.props.session_id;
    this.setState(stateNew);
    setTimeout(() => {
      this.messListener();
    }, 4000);
  }

  onSend = (messages = []) => {
    let formData = new FormData();
    formData.append("content", messages[0].text);
    formData.append("to_user", this.state.to_user);
    if (messages[0].text) {
      http.post("send/" + this.state.session_id, formData).then((response) => {
        this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }));
        console.log(this.state.messages);
      });
    } else {
      let stateNew = { ...this.state };
      stateNew.outer_bar = true;
      stateNew.open = true;
      stateNew.snackbar.message = "Can't send blank message.";
      stateNew.snackbar.status = "error";
      this.setState(stateNew);
    }
  };

  messListener = (token) => {
    let PusherClient = new Pusher("myKey", {
      cluster: "mt1",
      wsHost: echoURL,
      wsPort: "6001",
      wssHost: echoURL,
      wssPort: "6001",
      enabledTransports: ["ws", "wss"],
      forceTLS: false,
    });

    const echo = new Echo({
      broadcaster: "pusher",
      client: PusherClient,
    });

    echo
      .channel(`Chat.${this.state.session_id}`)
      .listen("PrivateChatEvent", (ev) => {
        this.addMessage(ev.data);
      });
  };

  addMessage(mess) {
    if (mess.user.id != auth.isAuthenticated().user.id) {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, mess),
      }));
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loader && <Loader />}
        {this.state.outer_bar && (
          <Snackbar open={this.state.open} message={this.state.snackbar} />
        )}
        <Card className="profile-card-header-list">
          <CardContent className="card-content-chat-profile">
            <List>
              <ListItem className="profile-list-data">
                <ListItemAvatar>
                  <Avatar>
                    {this.state.user_img && (
                      <React.Fragment>
                        <img
                          className="user-avtar"
                          src={this.state.user_img}
                          alt="user"
                        />
                      </React.Fragment>
                    )}
                    {!this.state.user_img && (
                      <React.Fragment>
                        <img
                          className="user-avtar"
                          src="https://zakirhussain.in/wp-content/uploads/2017/12/dummy-person.png"
                          alt="test"
                        />
                      </React.Fragment>
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  className="user-name-text"
                  primary={this.state.user_name}
                  secondary={this.state.status}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            id: auth.isAuthenticated().user.id,
          }}
          // inverted={false}
        />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </React.Fragment>
    );
  }
}

export default ChatScreen;
