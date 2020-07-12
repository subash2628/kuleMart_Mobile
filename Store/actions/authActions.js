import { GET_ERRORS, SET_CURRENT_USER, LOGOUT_USER } from "./types";
import axios from "axios";
import { baseURL } from "../actions/types";
import { getProductsById, setProductsById } from "../actions/productActions";
import { storeData } from "../../Components/localStorage";
import store from "../store";

//Register User
export const registeruser = (userData) => (dispatch) => {
  console.log(userData, baseURL);

  axios
    .post(`${baseURL}/api/users/register`, userData)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data.userId);

        //route to login screen

        return;
      }
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//login User
export const loginUser = (userData) => (dispatch) => {
  axios
    .get(`${baseURL}/api/users/login/${userData.phone}----${userData.password}`)
    .then(async (res) => {
      const { user } = res.data;
      //console.log(user);
      try {
        //await localStorage.setItem("user", JSON.stringify(user));

        console.log("user ", user);
        await dispatch(setCurrentUser(user));
        storeData("password", userData.password);
        // user.Products.length &&
        // (await dispatch(getProductsById(user.Products)));

        //route to dashboard
        userData.goBack();
      } catch (e) {
        //error login
        console.log(e);
      }
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//set logged in user
export const setCurrentUser = (user) => {
  storeData("user", user);
  return {
    type: SET_CURRENT_USER,
    payload: user,
  };
};

export const logout_user = (_) => {
  storeData("user", "");
  return { type: LOGOUT_USER };
};

//delete user
export const deleteUser = (userID) => {
  if (userID) {
    axios
      .delete(`${baseURL}/api/users/${userID}`)
      .then((res) => {
        if (res.status === 200) {
          //deleted successfully
          //throw productsById then logout
          store.dispatch(setProductsById());
          store.dispatch(logout_user());
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("userID required");
  }
};

//edit user
export const editUser = ({ userID, update, handleSuccess }) => (dispatch) => {
  console.log("userid ", userID, "update", update);
  if (userID && typeof update !== "undefined") {
    axios
      .put(`${baseURL}/api/users`, { userID, update })
      .then((res) => {
        if (res.status === 200) {
          //appended in server
          handleSuccess();
          //update store
          const user = store.getState().auth.user;
          update.name ? (user.name = update.name) : null;
          update.location ? (user.location = update.location) : null;
          update.password ? (user.password = update.password) : null;

          dispatch(setCurrentUser(user));
        }
      })
      .catch((err) => {
        console.log(err.response);
        handleSuccess();
      });
  } else {
    handleSuccess();
  }
};
