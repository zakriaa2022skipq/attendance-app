import axios from "axios";
const serverURL = import.meta.env.VITE_SERVER_URL

const instance = axios.create({
  baseURL:
    serverURL,
});

export default instance;