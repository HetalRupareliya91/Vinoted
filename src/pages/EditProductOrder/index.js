import React, { useState, useEffect } from "react";
import Navbar from "../../common/Headers";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import Profile from "../Profiles";
import Card from "@material-ui/core/Card";
import http from "../../config/http";
import Reorder, { reorder } from "react-reorder";
import "./style.css";

const EditProductOrder = ({ match }) => {
	const [values, setValues] = useState({
		loader: true,
		outer_bar: false,
		open: false,
		snackbar: {
			message: "",
			status: "",
		},
		products: [],
	});
	const [original, setOriginal] = useState([]);

	const onReorder = (event, previousIndex, nextIndex) =>
		setValues(prevValues => ({
			...prevValues,
			products: reorder(products, previousIndex, nextIndex),
		}));

	useEffect(() => {
		(async () => {
			const response = await http.post(
				`supplier/eventProductsList?event_id=${match.params.id}`
			);
			const sortedProducts = response.data.data.page.data
				.map(obj => {
					const { products, product_order } = obj;
					return { products, product_order };
				})
				.sort((a, b) => {
					if (a.product_order > b.product_order) return 1;
					if (b.product_order > a.product_order) return -1;
					return 0;
				})
				.map(o => o.products);
			setOriginal(sortedProducts);
			setValues({
				...values,
				loader: false,
				products: sortedProducts,
			});
		})();
	}, []);

	const { loader, products, outer_bar, open, snackbar } = values;

	return (
		<>
			<Navbar />
			{loader && <Loader />}
			{outer_bar && <Snackbar open={open} message={snackbar} />}
			<br></br>
			<div className="container">
				<div className="row">
					<div className="pr-0 col-md-3 profile-outer-card">
						<Profile />
					</div>
					<div className="pr-0 col-md-9">
						<Card className="dashboard-events-table">
							<button
								onClick={
									JSON.stringify(products) === JSON.stringify(original)
										? () => {}
										: async () => {
												setValues({
													...values,
													outer_bar: false,
													loader: true,
													open: false,
												});
												var formData = new FormData();
												formData.append("event", match.params.id);
												for (var i = 0; i < products.length; i++)
													formData.append(
														`products[${i}]`,
														products.map(p => p.id)[i]
													);
												const resp = await http.post(
													"supplier/updateProductOrder",
													formData
												);
												if (resp.code === 200 && resp.status)
													setValues({
														...values,
														outer_bar: true,
														open: true,
														loader: false,
														snackbar: {
															message: "Product order updated!",
															status: "success",
														},
													});
										  }
								}
								style={{
									cursor:
										JSON.stringify(products) === JSON.stringify(original)
											? "not-allowed"
											: "pointer",
									borderRadius: "7px",
									border: "none",
									backgroundColor: "#e63946",
									padding: "5px 25px",
								}}
								className="invite-more-action"
							>
								Save Order
							</button>
							<div className="modal-content">
								<h2>Drag and drop to re-order.</h2>
								<div style={{ padding: "30px" }}>
									{products.length === 0 ? (
										"No wines."
									) : (
										<ul className="product-container">
											<Reorder onReorder={onReorder} reorderId="my-list">
												{products.map((product, index) => (
													<div key={index} className="product-card">
														<img
															src={product.Imagesrc}
															style={{
																width: "100px",
																height: "100px",
																margin: "0 20px",
															}}
															alt="product"
														/>
														<div className="product-info">
															<h3 style={{ margin: "5px 0" }}>
																{product.title}
															</h3>
															<p>
																- category -
																<br />£ {product.price}
																<br />
																Order #{index + 1}
															</p>
														</div>
													</div>
												))}
											</Reorder>
										</ul>
									)}
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default EditProductOrder;
