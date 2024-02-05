import React, { Component } from "react";
import auth from "./AuthHelper";
import firebase from "./Firebase";
import http from "./http";
class FirebasePush extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // badge: true,
      open: false,
    };
  }

  noticount = async () => {};
  componentDidMount() {
    let token = "";

    if (auth.isAuthenticated()) {
      this.noticount();
      const messaging = firebase.messaging();

      if (firebase.messaging.isSupported()) {
        messaging
          .requestPermission()
          .then(function () {
            return messaging.getToken();
          })
          .then(function (token) {
            token = token;
            localStorage.setItem("pushToken", token);
            let formData = new FormData();
            formData.append("token", token);
            formData.append(
              "topic",
              "user_id_" + auth.isAuthenticated().user.id
            );

            http.post("/subscribe", formData).then((response) => {});
          })
          .catch(function (err) {
            console.log("Unable to get permission to notify.", err);
          });

        let enableForegroundNotification = true;
        messaging.onMessage(function (payload) {
          // if (enableForegroundNotification) {
          //   console.log("hello fore", payload);
          //   cogoToast.info(
          //     <div>
          //       <b>Awesome!</b>
          //       <div>Isn't it?</div>
          //     </div>
          //   );
          //   const { title, ...options } = JSON.parse(payload.data);
          //   navigator.serviceWorker.getRegistrations().then((registration) => {
          //     registration[0].showNotification(title, options);
          //   });
          // }
          // console.log(JSON.parse(payload.data.data));
          // console.log(payload);
          let action_id = payload.data.action_id;
          localStorage.setItem("action", action_id);
          const notificationOption = {
            body: payload.notification.body,
            icon: payload.notification.icon,
          };

          if (Notification.permission === "granted") {
            var notification = new Notification(
              payload.notification.title,
              notificationOption
            );

            notification.onclick = function (ev) {
              ev.preventDefault();
              window.open("/chats", "_blank");
              notification.close();
            };
          }
        });
      } else {
        //do nothing
      }
    }
  }
  render() {
    return <React.Fragment></React.Fragment>;
  }
}

export default FirebasePush;
