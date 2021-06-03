import axios from "axios";

const instance = axios.create({
  baseURL: "https:/guarded-tor-72248.herokuapp.com/",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

// tslint:disable-next-line: no-default-export
export default instance;
