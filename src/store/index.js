import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import allReducers from "../reducers";

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
const store = createStoreWithMiddleware(allReducers);

export default store;
