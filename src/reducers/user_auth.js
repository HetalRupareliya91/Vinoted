import { OPEN_EXPORTCSV_MODAL } from "./Constant";

const initalState = {
	user: {},
	export_csv_modal: false,
};

const user_auth = (state = initalState, actions = {}) => {
	// console.log("reducerss", state);
	switch (actions.type) {
		case "ADD_USER":
			return Object.assign({}, state, { user: actions.user });
		case OPEN_EXPORTCSV_MODAL:
			return Object.assign({}, state, { export_csv_modal: actions.payload });
		default:
			return state;
	}
};

export default user_auth;
