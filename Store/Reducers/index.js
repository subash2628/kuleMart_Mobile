//root reducer
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import productsReducer from "./productReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  products: productsReducer,
});
