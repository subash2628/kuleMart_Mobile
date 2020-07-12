import { baseURL } from "./types";
import {
  SET_PRODUCTS,
  GET_ERRORS,
  SET_CATAGORIES,
  SET_PRODUCTS_BY_ID,
  SELL_PRODUCT,
} from "./types";

import axios from "axios";
import { storeData } from "../../Components/localStorage";
import store from "../store";
import { setCurrentUser } from "./authActions";

export const getCatagories = () => (dispatch) => {
  //console.log("getCatagories");
  axios
    .get(`${baseURL}/api/product/catagory/all`)
    .then(async (res) => {
      //store data locally
      //localStorage.setItem("allCatagories", JSON.stringify(res.data));

      const products = [];
      const catagories = [];
      res.data &&
        (await Object.keys(res.data).map((key) => {
          //arrray = data && title= key
          const catagory = { title: key, data: res.data[key] };
          catagories.push(catagory);

          res.data[key].forEach((product) => {
            products.push({ ...product, catagory: key });
          });
        }));

      //filling store and also saving in offline storage
      dispatch(setAllCatagories(catagories));
      dispatch(setAllProducts(products));
    })
    .catch((err) => {
      console.log("baseUrl:  ", baseURL);

      console.log("getCatagories Error: ", err);
      return store.dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      //console.log(err.response);
    });
};

export const getProductsById = (productIdArray, products) => (dispatch) => {
  if (productIdArray && products) {
    const found_products = [];
    products.map((product) => {
      productIdArray.includes(product.id) && found_products.push(product);
    });
    dispatch(setProductsById(found_products));
  }
};

export const sellProduct = ({ fd, newProduct, goBack }) => (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  };

  axios
    .post(`${baseURL}/api/product/sell`, fd, config)
    .then(async (res) => {
      if (res.status === 200 && res.data) {
        dispatch({
          type: SELL_PRODUCT,
          payload: { ...res.data, tempSoldProduct: newProduct },
        });
        //navigating back to products
        return await goBack();
      }
    })
    .catch((err) => {
      //console.log("selling error: ", err.response ? err.response : err);
      return dispatch({
        type: GET_ERRORS,
        payload: { sellingError: "error selling product" },
      });
    });
};

export const setAllProducts = (products) => {
  //locally also
  storeData("allProducts", products);
  return {
    type: SET_PRODUCTS,
    payload: products,
  };
};

export const setAllCatagories = (catagories) => {
  storeData("allCatagories", catagories); //also storing locally
  return {
    type: SET_CATAGORIES,
    payload: catagories,
  };
};

export const setProductsById = (products) => {
  storeData("productsById", products);
  return {
    type: SET_PRODUCTS_BY_ID,
    payload: products,
  };
};

//deleting product
export const deleteProduct = ({ catagoryName, productID }) => {
  //console.log(catagoryName, productID);
  if (catagoryName && productID) {
    axios
      .delete(`${baseURL}/api/product/${productID}&&${catagoryName}`)
      .then((res) => {
        if (res.status === 200) {
          //deleted successfully , change store now
          const state = store.getState();
          const products = state.products.products;
          const catagories = state.products.catagories;
          const productsByIdd = state.products.productsById;
          const user = state.auth.user;
          //console.log("products before", products.length);

          //deleting products from allProducts
          const allProductsAfterDeleting = products.filter(
            (product) => productID !== product.id
          );
          //console.log("afterDeletingProducts ", afterDeleting.length);

          //deleting from  allCatagories
          catagories.forEach((catagory) => {
            if (catagory.title === catagoryName) {
              //console.log("before catagory data length ", catagory.data.length);
              const newCatagoryData = catagory.data.filter(
                (product) => productID !== product.id
              );
              catagory.data = newCatagoryData;
              //console.log(
              //"after catagory data length ",
              //newCatagoryData.length
              //);
            }
          });

          //deleting from productsByIdd
          //console.log("before productById length ", productsByIdd.length);
          const newproductsById = productsByIdd.filter(
            (product) => productID !== product.id
          );

          //deleting from usersproducts
          const newUserProducts = user.Products.filter(
            (productId) => productID !== productId
          );

          user.Products = newUserProducts;

          //console.log("after productById length ", newproductsById.length);
          //now update store
          store.dispatch(setAllProducts(allProductsAfterDeleting));
          store.dispatch(setAllCatagories(catagories));
          store.dispatch(setProductsById(newproductsById));
          store.dispatch(setCurrentUser(user));
        }
      })
      .catch((err) => console.log(err));
  } else {
    console.log("catagory or productID not passed for deleting");
  }
};

//editing product
export const editProduct = ({
  catagoryName,
  productID,
  update,
  handleSuccess,
}) => (dispatch) => {
  if (catagoryName && productID && typeof update !== "undefined") {
    //edit
    axios
      .put(`${baseURL}/api/product`, {
        catagory: catagoryName,
        productID,
        update,
      })
      .then((res) => {
        if (res.status === 200) {
          //edited successfully , change store now
          const state = store.getState();
          const products = state.products.products;
          const catagories = state.products.catagories;
          const productsByIdd = state.products.productsById;

          //update all products
          products.forEach((product) => {
            if (productID === product.id) {
              //location, price, quantity,name
              update.location ? (product.location = update.location) : null;
              update.price ? (product.price = update.price) : null;
              update.quantity ? (product.quantity = update.quantity) : null;
              update.name ? (product.name = update.name) : null;
            }
          });
          dispatch(setAllProducts(products));

          //updating catagories
          catagories.forEach((catagory) => {
            if (catagory.title === catagoryName) {
              catagory.data.forEach((product) => {
                if (product.id === productID) {
                  update.location ? (product.location = update.location) : null;
                  update.price ? (product.price = update.price) : null;
                  update.quantity ? (product.quantity = update.quantity) : null;
                  update.name ? (product.name = update.name) : null;
                }
              });
            }
          });
          dispatch(setAllCatagories(catagories));

          //updating productsById
          productsByIdd.forEach((product) => {
            if (productID === product.id) {
              //location, price, quantity,name
              update.location ? (product.location = update.location) : null;
              update.price ? (product.price = update.price) : null;
              update.quantity ? (product.quantity = update.quantity) : null;
              update.name ? (product.name = update.name) : null;
            }
          });
          dispatch(setProductsById(productsByIdd));
          handleSuccess();
        }
      })
      .catch((err) => console.log(err));
  } else {
    console.log("data not enough", catagoryName, productID, update);
  }
};
