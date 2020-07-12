import {
  SET_PRODUCTS,
  SET_CATAGORIES,
  SET_PRODUCTS_BY_ID,
  SELL_PRODUCT,
} from "../actions/types";
//import isEmpty from "../../functions/is-Empty";

const initialState = {
  products: null,
  catagories: null,
  productsById: null,
  soldProduct: null,
  tempSoldProduct: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case SET_CATAGORIES:
      return {
        ...state,
        catagories: action.payload,
      };
    case SET_PRODUCTS_BY_ID:
      return {
        ...state,
        productsById: action.payload,
      };
    case SELL_PRODUCT:
      return {
        ...state,
        soldProduct: action.payload.id,
        tempSoldProduct: action.payload.tempSoldProduct,
      };
    default:
      return state;
  }
}
