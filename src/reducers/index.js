import { combineReducers } from "redux";
import user_auth from "./user_auth";
const allReducers = combineReducers({
  root: user_auth,
});
export default allReducers;
