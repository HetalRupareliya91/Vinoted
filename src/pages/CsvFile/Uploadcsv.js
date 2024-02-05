import React, { useState } from "react";
import "../../assets/uploadcsv.css";
import http from "../../config/http";
import { openExportCsvModal } from "../../actions/addUser";
import { useDispatch } from "react-redux";
import Exportcsv from "../../common/Modals/Exportcsv";

function Uploadcsv() {
	const dispatch = useDispatch();
	const [csvFile, setCsvFile] = useState();
	const [csvArray, setCsvArray] = useState([]);

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
		// ----------------
		let formData = new FormData();
		formData.append("uploaded_file", csvFile);
		http.post("supplier/importProducts", formData).then((res) => {
			console.log(res, "<<<<");
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
	// console.log(csvArray, "<<<csvArray..");
	const openModal = () => {
		dispatch(openExportCsvModal(true));
	};

	return (
		<div className="uploadCsvOuter" style={{ width: 99, cursor: "pointer" }}>
			<div className="import-text" onClick={openModal}>
				Import Csv
			</div>
			<Exportcsv />
			{/* <div className="uploadInputDiv">
				<input
					className=" uploadButton"
					type="file"
					accept=".csv"
					id="csvFile"
					onChange={(e) => {
						submit(e.target.files[0]);
					}}
				/>
			</div> */}
		</div>
	);
}

export default Uploadcsv;
