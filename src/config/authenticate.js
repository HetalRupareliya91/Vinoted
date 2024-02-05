import { connect } from "react-redux";
import { addUser } from "../actions/addUser";
import store from "../store";

const checkAuth = {
  check_user() {
    if (this.props.user) {
      console.log("yes");
    } else {
      console.log("no");
      let user = localStorage.getItem("vinoted-jwt");
      store.dispatch(addUser(user));
    }
  },
};

const mapStateToProps = (state) => ({
  user: state.root.user,
});

export default connect(mapStateToProps, null)(checkAuth);
