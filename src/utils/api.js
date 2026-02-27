import axios from "axios";
// 상황따라 주소 다름
const LOCAL_BACKEND = process.env.REACT_APP_LOCAL_BACKEND; // 로컬 백엔드 주소
const BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY; // 프록시 주소
const api = axios.create({
  //baseURL: LOCAL_BACKEND,
  baseURL:
    process.env.NODE_ENV === "development" ? LOCAL_BACKEND : BACKEND_PROXY,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});
/**
 * console.log all requests and responses
 */
api.interceptors.request.use(
  (request) => {
    request.headers.authorization = `Bearer ${sessionStorage.getItem("token")}`;
    return request;
  },
  function (error) {},
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    error = error.response.data;
    return Promise.reject(error);
  },
);

export default api;
