import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button as RN_Button,
  Image,
  Alert,
} from "react-native";
import { Button } from "react-native-elements";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { connect } from "react-redux";
import store from "../Store/store";
import {
  sellProduct,
  setAllCatagories,
  setAllProducts,
  setProductsById,
} from "../Store/actions/productActions";
import { setCurrentUser } from "../Store/actions/authActions";
import { getData } from "../Components/localStorage";

class SelllingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      productName: "",
      catagory: "",
      price: "",
      quantity: "",
      loading: false,
    };

    this._getPermissionAsync = this._getPermissionAsync.bind(this);
    this._pickImage = this._pickImage.bind(this);
    this._onSell = this._onSell.bind(this);
  }
  async _onSell() {
    const { image, productName, catagory, price, quantity } = this.state;
    this.setState({ loading: true });
    //user data is required for product
    const { location, company, phone } = this.props.user;
    //console.log(image);

    //fetching blob
    const response = await fetch(image);
    //console.log("image fetching ", response);
    const blob = await response.blob();
    //console.log(blob);

    //const image_name = blob._data.name;
    const productImage = {
      name: blob._data.name,
      type: blob._data.type,
      uri: image,
    };
    //console.log("productImage ", productImage);
    // //get extension

    const newProduct = {
      imageLink: `https://storage.googleapis.com/e-nawalpur.appspot.com/ProductImages/${productImage.name}`,
      name: productName,
      price: price,
      catagory: catagory,
      quantity: quantity,
      location: location,
      vendor: company,
      contact: phone,
      id: null,
    };

    let fd = new FormData();
    fd.append("productImage", productImage);
    fd.append("name", productName);
    fd.append("price", price);
    fd.append("catagory", catagory);
    fd.append("quantity", quantity);
    fd.append("userId", this.props.user.id);

    //now selling using redux action
    const goBack = () =>
      this.setState({ loading: false }, () => this.props.navigation.goBack());

    this.props.sellProduct({ fd, newProduct, goBack });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors, loading: false });
    } else if (prevProps.soldProductId !== this.props.soldProductId) {
      //append newProduct stored locally with sold id returned from server
      try {
        const { soldProduct } = this.props;
        //console.log(soldProduct);
        soldProduct.id = this.props.soldProductId;
        //console.log("componentDidUpdate soldProduct ", soldProduct);

        //pushing soldProductId to user profile
        const user = await getData("user");
        //console.log(user);
        if (user) {
          user.Products.push(this.props.soldProductId);
          store.dispatch(setCurrentUser(user));
          //console.log("pushed to user Products ", user.Products);
        }

        // //adding newProduct to catagories
        const allCatagories = await getData("allCatagories");
        const allProducts = await getData("allProducts");
        //append catagories

        if (allCatagories) {
          allCatagories.forEach((catagory) => {
            catagory.title === soldProduct.catagory
              ? catagory.data.push(soldProduct)
              : null;
          });
          //console.log("pushed to catagories ", allCatagories);
        }

        // //append products
        allProducts && allProducts.push(soldProduct);
        //console.log("pushed to allProducts ", allProducts);

        // console.log("allProducts ", newCatagories, "allProducts ", allProducts);
        // //adding newProduct to products
        store.dispatch(setAllCatagories(allCatagories));
        store.dispatch(setAllProducts(allProducts));

        // //appending newProduct to productsById
        const productsById = await getData("productsById");
        if (productsById) {
          productsById.push(soldProduct);
          store.dispatch(setProductsById(productsById));
          //console.log("pushed to productsById ", productsById);
        }
      } catch (e) {
        Alert.alert("error selling");
        console.log(e);
      }
    }
  }

  render() {
    const {
      image,
      productName,
      catagory,
      price,
      quantity,
      loading,
    } = this.state;
    const disableButton =
      image &&
      productName.length >= 3 &&
      catagory.length >= 3 &&
      price.length >= 1 &&
      quantity.length >= 1
        ? false
        : true;
    return (
      <View style={styles.container}>
        <Form>
          <Item stackedLabel success={productName.length >= 3 ? true : false}>
            <Label>Product Name</Label>
            <Input
              value={productName}
              onChangeText={(productName) => this.setState({ productName })}
            />
          </Item>
          <Item stackedLabel success={catagory.length >= 3 ? true : false}>
            <Label>Catagory</Label>
            <Input
              value={catagory}
              onChangeText={(catagory) => this.setState({ catagory })}
            />
          </Item>
          <Item stackedLabel success={price.length >= 1 ? true : false}>
            <Label>Price</Label>
            <Input
              value={price}
              onChangeText={(price) => this.setState({ price })}
              //autoCompleteType="tel"
              keyboardType="phone-pad"
            />
          </Item>
          <Item stackedLabel last success={quantity.length >= 1 ? true : false}>
            <Label>Quantity</Label>
            <Input
              value={quantity}
              onChangeText={(quantity) => this.setState({ quantity })}
            />
          </Item>
          <Item stackedLabel last success={image ? true : false}>
            <Label>Image</Label>

            {!image ? (
              <RN_Button title="Pick an image" onPress={this._pickImage} />
            ) : (
              <Image
                source={{ uri: image }}
                style={{ width: 50, height: 50 }}
              />
            )}
          </Item>
        </Form>
        <Button
          title="Sell"
          onPress={this._onSell}
          disabled={disableButton}
          loading={loading}
          containerStyle={styles.button}
        />
      </View>
    );
  }

  componentDidMount() {
    this._getPermissionAsync();
  }

  async _getPermissionAsync() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  }
  async _pickImage() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled && result.type === "image") {
        this.setState({ image: result.uri });
      }

      //console.log(result);
    } catch (E) {
      console.log(E);
    }
  }
}
const mapStateToProps = (store) => ({
  user: store.auth.user,
  soldProductId: store.products.soldProduct,
  errors: store.errors,
  soldProduct: store.products.tempSoldProduct,
});

export default connect(mapStateToProps, { sellProduct })(SelllingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  button: {
    padding: 30,
    marginTop: 10,
  },
});
