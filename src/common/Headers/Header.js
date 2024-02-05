import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { BiMenuAltRight } from "react-icons/bi";
import { withRouter } from "react-router-dom";
import Title from "../../assets/img/image/group_16.png";
import auth from "../../config/AuthHelper";
import http from "../../config/http";
import { PREFIX } from "../../config/routes";

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.items = [
			{
				label: "Tasting",
				items: [
					{
						label: "My Tastings",
						icon: "pi pi-volume-up",
						command: (e) => {
							this.props.history.push("/my-events");
						},
					},
					{
						label: "Add Tasting",
						icon: "pi pi-plus",
						command: (e) => {
							this.props.history.push("/new-event");
						},
					},
				],
			},
			{
				label: "Portfolio",
				items: [
					{
						label: "My Portfolio",
						icon: "pi pi-shopping-cart",
						command: (e) => {
							this.props.history.push("/my-products");
						},
					},
					{
						label: "Add New Wine",
						icon: "pi pi-plus-circle",
						command: (e) => {
							this.props.history.push("/new-product");
						},
					},
				],
			},
			// {
			// 	label: "Membership",
			// 	items: [
			// 		{
			// 			label: "View Membership",
			// 			icon: "pi pi-cloud",
			// 			command: async () => {
			// 				const formData = new FormData();
			// 				formData.append("user_id", auth.isAuthenticated().user.id);
			// 				const resp = await http.post("supplier/viewMembership", formData);
			// 				window.location.href = resp.data.message.url;
			// 			},
			// 		},
			// 	],
			// },
			{
				label: "Chats",
				items: [
					{
						label: "Chats",
						icon: "pi pi-comment",
						command: (e) => {
							this.props.history.push("/chats");
						},
					},
				],
			},
			{
				label: "Action",
				items: [
					{
						label: "Change Password",
						icon: "pi pi-lock",
						command: (e) => {
							this.props.history.push("/change-password");
						},
					},
					{
						label: "Log Out",
						icon: "pi pi-external-link",
						command: (e) => {
							let formData = new FormData();
							formData.append("token", localStorage.getItem("pushToken"));
							formData.append(
								"topic",
								"user_id_" + auth.isAuthenticated().user.id
							);

							http.post("/auth/logout", formData).then((response) => {
								if (response.code === 200) {
									auth.clearJWT();
									auth.clearFCM();
									window.location.href = PREFIX;
								}
							});
						},
					},
				],
			},
		];
	}
	async componentDidMount() {
		let $ = require("jquery");
		$("body").css("background-color", "#181f39");
		let chromeAgent = navigator.userAgent.indexOf("Safari") > -1;
		console.log(navigator.userAgent);
	}
	redirect = () => {
		this.props.history.push("/");
	};
	logout = () => {
		auth.clearJWT();
		window.location.href = PREFIX;
	};
	render() {
		return (
			<div>
				<Navbar
					className="py-0 bottom-class"
					style={{ backgroundColor: "#1E2746" }}
					expand="lg"
				>
					<Navbar.Brand onClick={this.redirect}>
						{" "}
						<img
							src={Title}
							width="100"
							height="30"
							style={{ cursor: "pointer" }}
							className="ml-5 align-top d-inline-block"
							alt="React Bootstrap logo"
						/>
					</Navbar.Brand>

					<span className="header-span">
						<Menu
							model={this.items}
							popup
							ref={(el) => (this.menu = el)}
							id="popup_menu"
						/>
						<BiMenuAltRight
							className="header-toggle-icon"
							icon="pi pi-bars"
							style={{ cursor: "pointer" }}
							onClick={(event) => this.menu.toggle(event)}
							aria-controls="popup_menu"
							aria-haspopup
						/>{" "}
						<p className="user-name-header">
							Welcome,{" "}
							<span className="user-name-after">
								{auth.isAuthenticated().user.name.replace("null", " ")}
							</span>
						</p>
						<Button />
					</span>
				</Navbar>
			</div>
		);
	}
}

export default withRouter(Header);
