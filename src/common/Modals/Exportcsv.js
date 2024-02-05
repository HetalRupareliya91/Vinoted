import React, { useState } from "react";
import "../../assets/Css/modal.css";
import http from "../../config/http";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { openExportCsvModal } from "../../actions/addUser";
function Exportcsv() {
	const dispatch = useDispatch();
	const [inputStatus, setInputStatus] = useState("INPUT");
	const [responseMessage, setResponseMessage] = useState("");
	const [csvArray, setCsvArray] = useState([]);
	const { root } = useSelector((state) => state);
	const { export_csv_modal } = root;

	const processCSV = async (str, delim = ",") => {
		const headers = str.slice(0, str.indexOf("\n")).split(delim);
		const rows = str.slice(str.indexOf("\n") + 1).split("\n");

		const newArray = rows.map((row) => {
			const values = row.split(delim);
			const eachObject = headers.reduce((obj, header, i) => {
				obj[header] = values[i];
				return obj;
			}, {});
			return eachObject;
		});
		setCsvArray(newArray);
	};

	const submit = async (csvFile) => {
		setInputStatus("LOADING");
		// ----------------
		let formData = new FormData();
		formData.append("uploaded_file", csvFile);
		http.post("supplier/importProducts", formData).then((res) => {
			console.log(res, "<<<<");

			if (res.code != 200) {
				setResponseMessage("Try again later");
			} else {
				setResponseMessage(res.data.message);
			}
			setInputStatus("SUCCESS");
			//   setTimeout(() => {
			//     closeThisModal();
			//     window.location.reload(true);
			//   }, 1000);
		});
		// ------
		const file = csvFile;
		const reader = new FileReader();

		reader.onload = function (e) {
			const text = e.target.result;
			console.log(text);
			processCSV(text);
		};
		reader.readAsText(file);
	};

	const closeThisModal = () => {
		dispatch(openExportCsvModal(false));
		// window.location.reload(true);
	};
	return (
		<div
			className="outermodal"
			style={{ display: export_csv_modal ? "block" : "none", zIndex: 99 }}
		>
			<div className="settomiddle posabs  justbetween dflex bordrad6 flexcol textcenter w100 bgwhite">
				<div className="dflex flexcol justbetween p10 h100">
					<div className="w100 font22 boldbold textwhite">Import Csv</div>
					{inputStatus == "INPUT" && (
						<div>
							<input
								className=" w200px textwhite"
								type="file"
								accept=".csv"
								id="csvFile"
								onChange={(e) => {
									submit(e.target.files[0]);
								}}
							/>
						</div>
					)}
					{inputStatus == "LOADING" && (
						<div className="textwhite">Loading..</div>
					)}
					{inputStatus == "SUCCESS" && (
						<div className="textwhite">{responseMessage}</div>
					)}
					<div>
						<button
							onClick={closeThisModal}
							className="bordrad6 p5 textwhite w40per closebutton "
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Exportcsv;
