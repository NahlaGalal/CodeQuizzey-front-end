import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:4000/",
  //"http://192.168.1.5:4000/"
});
