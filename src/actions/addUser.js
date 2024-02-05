import { OPEN_EXPORTCSV_MODAL } from "../reducers/Constant";

export function addUser(user) {
	return (dispatch) => {
		dispatch({
			type: "ADD_USER",
			user,
		});
	};
}

export function openExportCsvModal(data) {
	console.log(`dispatch(openExportCsvModal(true)); - 2`);
	return (dispatch) => {
		dispatch({
			type: OPEN_EXPORTCSV_MODAL,
			payload: data,
		});
	};
}
