import axios from "axios";

export default axios.create({
  baseURL: "https://talent-bridge-api.vercel.app/api/v1/",
});