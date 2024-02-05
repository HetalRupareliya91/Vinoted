import { signout } from "./ApiAuth.js";

const auth = {
  isAuthenticated() {
    if (typeof window == "undefined") return false;

    if (localStorage.getItem("vinoted-jwt"))
      return JSON.parse(localStorage.getItem("vinoted-jwt"));
    else return false;
  },
  authenticate(jwt) {
    if (typeof window !== "undefined")
      localStorage.setItem("vinoted-jwt", JSON.stringify(jwt));
  },

  clearFCM() {
    if (typeof window !== "undefined") localStorage.removeItem("pushToken");
  },

  clearJWT() {
    if (typeof window !== "undefined") localStorage.removeItem("vinoted-jwt");

    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  },
};

export default auth;
