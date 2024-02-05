import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Router, Switch } from "react-router-dom";
import AddEvent from "../pages/AddEvents";
import AddProduct from "../pages/AddProducts";
import AuthLogin from "../pages/Auths";
import ChangePassword from "../pages/ChangePasswords";
import Chat from "../pages/Chats";
import EditEvent from "../pages/EditEvents";
import EditProductOrder from "../pages/EditProductOrder/index";
import EditProduct from "../pages/EditProducts";
import EventDetails from "../pages/EventDetails";
import EventSommList from "../pages/EventSommLists";
import Feedback from "../pages/Feedbacks";
import Forgetpassword from "../pages/ForgotPasswords";
import Home from "../pages/Homes";
import MyEvents from "../pages/MyEvents";
import NotAuthenticated from "../pages/NotAuthenticateds";
import ProductDetail from "../pages/ProductDetails";
import Products from "../pages/ProductLists";
import Resetpassword from "../pages/ResetPasswords";
import Signup from "../pages/Signups";
import SingleProductDetail from "../pages/SingleProductDetails";
import Tests from "../pages/Tests";
import VerifyEmail from "../pages/VerifyEmails";
import auth from "./AuthHelper";
import history from "./history";
// import PaymentPage from "../pages/stripe";
import Uploadcsv from "../pages/CsvFile/Uploadcsv";
import Exportcsv from "../common/Modals/Exportcsv";
import http from "./http";

export const PREFIX =
	!process.env.NODE_ENV || process.env.NODE_ENV === "development"
		? ""
		: "/";

async function checkSubscription() {
	const formData = new FormData();
	formData.append("user_id", auth.isAuthenticated().user.id);
	const resp = await http.post("supplier/getMembershipStatus", formData);
	if (resp.code === 200) {
		if (resp.data.message.status !== "Active") {
			const response = await http.post("supplier/viewMembership", formData);
			formData.append("token", localStorage.getItem("pushToken"));
			formData.append("topic", "user_id_" + auth.isAuthenticated().user.id);
			http.post("/auth/logout", formData).then((response) => {
				if (response.code === 200) {
					auth.clearJWT();
					auth.clearFCM();
				}
			});
			window.location.href = response.data.message.url;
		}
	} else {
		let formData = new FormData();
		formData.append("token", localStorage.getItem("pushToken"));
		formData.append("topic", "user_id_" + auth.isAuthenticated().user.id);
		http.post("/auth/logout", formData).then((response) => {
			if (response.code === 200) {
				auth.clearJWT();
				auth.clearFCM();
				window.location.href = PREFIX;
			}
		});
	}
}

const Routing = () => {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("safari") !== -1) {
		if (ua.indexOf("chrome") > -1) {
		} else {
			localStorage.setItem("browser", "safari");
		}
	}

	return (
		<BrowserRouter basename={PREFIX}>
			<Main />
		</BrowserRouter>
	);
};

var a = null;

if (
	auth.isAuthenticated() &&
	typeof auth.isAuthenticated().user.email_verified_at !== "object"
) {
	//checkSubscription();
	a = (
		<div>
			<BrowserRouter basename={PREFIX}>
				<Switch>
					<Route exact path={`/`} component={Home} />
					<Route path={`/edit-event/:id`} component={EditEvent} />
					<Route
						path={`/edit/event/product-order/:id`}
						component={EditProductOrder}
					/>
					<Route path={`/reset-password`} component={Resetpassword} />
					<Route path={`/my-events`} component={MyEvents} />
					<Route path={`/event-details/:id`} component={EventDetails} />
					<Route path={`/new-event`} component={AddEvent} />
					<Route path={`/my-products`} component={Products} />
					<Route path={`/event-sommelier-list`} component={EventSommList} />
					<Route path={`/new-product`} component={AddProduct} />
					<Route path={`/change-password`} component={ChangePassword} />
					<Route path={`/wine-detail`} component={ProductDetail} />
					<Route path={`/newproduct`} component={AddProduct} />
					<Route path={`/chats`} component={Chat} />
					<Route path={`/feedbacks`} component={Feedback} />
					<Route path={`/test`} component={Tests} />
					<Route path={`/edit-product/:id`} component={EditProduct} />
					<Route path={`/product-detail/:id`} component={SingleProductDetail} />
					<Route exact path={`/:user`} component={Home} />
					<Route component={NotAuthenticated} />
				</Switch>
			</BrowserRouter>
		</div>
	);
} else if (
	auth.isAuthenticated() &&
	typeof auth.isAuthenticated().user.email_verified_at === "object"
) {
	a = (
		<div>
			<BrowserRouter basename={PREFIX}>
				<Switch>
					<Route exact path={`/`} component={AuthLogin} />
					{/* <Route exact path="/" component={Uploadcsv} /> */}
					{/* <Route path="/login" component={AuthLogin} /> */}
					<Route path={`/sign-up`} component={Signup} />
					<Route path={`/forget-password`} component={Forgetpassword} />
					<Route path={`/verify-email`} component={VerifyEmail} />
					<Route component={NotAuthenticated} />
				</Switch>
			</BrowserRouter>
		</div>
	);
} else if (!auth.isAuthenticated()) {
	a = (
		<div>
			<BrowserRouter basename={PREFIX}>
				<Switch>
					<Route exact path={`/`} component={AuthLogin} />
					{/* <Route path="/login" component={AuthLogin} /> */}
					<Route path="/sign-up" component={Signup} />
					{/* <Route
						path={`/subscribe`}
						component={(props) => <PaymentPage history={props.history} />}
					/> */}
					<Route path={`/forget-password`} component={Forgetpassword} />
					<Route path={`/verify-email`} component={VerifyEmail} />
					<Route component={NotAuthenticated} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

const Main = () => {
	history.listen((_) => {
		window.scrollTo(0, 0);
	});

	return <Router history={history}>{a}</Router>;
};

export default Routing;
