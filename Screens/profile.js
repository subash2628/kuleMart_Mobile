import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInput,
} from "react-native";
import { connect } from "react-redux";
import CardComponent from "../Components/card";
import { Overlay, Button } from "react-native-elements";
import { editProduct } from "../Store/actions/productActions";
import { editUser } from "../Store/actions/authActions";
import { getData } from "../Components/localStorage";

class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myProducts: null,
      isVisible: false,
      user: null,
      //for editing
      userFlag: null,
      catagory: "",
      productID: "",
      itemForOverlay: { name: "", location: "", price: "", quantity: "" },
      userItemsForOverlay: {
        name: "",
        location: "",
        password: "",
        passwordMatch: null,
      },
    };
    this._toggleOverlay = this._toggleOverlay.bind(this);
    this._tempItemsOverlay = this._tempItemsOverlay.bind(this);
    this._onEditProduct = this._onEditProduct.bind(this);
    this._tempUserItemsOverlay = this._tempUserItemsOverlay.bind(this);
    this._onEditUser = this._onEditUser.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.myProducts !== this.props.myProducts) {
      this.setState({ myProducts: this.props.myProducts });
    } else if (prevProps.user !== this.props.user) {
      console.log("user data changed");
      this.setState({ user: this.props.user });
    }
  }
  _toggleOverlay() {
    this.setState((prevState) => ({
      isVisible: !prevState.isVisible,
    }));
  }
  _tempItemsOverlay({ name, location, quantity, price, catagory, productID }) {
    this.setState({
      loading: false,
      userFlag: false,
      catagory,
      productID,
      itemForOverlay: {
        ...this.state.itemForOverlay,
        name,
        location,
        price,
        quantity,
      },
    });
  }
  async _tempUserItemsOverlay({ name, location }) {
    const password = await getData("password");
    console.log(name, location, password);
    this.setState({
      userFlag: true,
      userItemsForOverlay: {
        ...this.state.userItemsForOverlay,
        name,
        location,
        password,
      },
    });
  }

  _onEditProduct() {
    this.setState({ loading: true });
    const handleSuccess = (_) => {
      this.setState({ loading: false, isVisible: false });
    };
    this.props.editProduct({
      productID: this.state.productID,
      catagoryName: this.state.catagory,
      update: this.state.itemForOverlay,
      handleSuccess: handleSuccess,
    });
  }

  _onEditUser() {
    this.setState({ loading: true });
    const handleSuccess = (_) =>
      this.setState({ loading: false, isVisible: false });
    //console.log(this.props.user.id, this.props.user.id.length);
    this.props.editUser({
      userID: this.props.user.id,
      update: this.state.userItemsForOverlay,
      handleSuccess: handleSuccess,
    });
  }
  render() {
    //console.log("profile render");
    const { userFlag } = this.state;
    const { name, location, price, quantity } = this.state.itemForOverlay;
    const myProducts = this.state.myProducts
      ? this.state.myProducts
      : this.props.myProducts;
    const user = this.state.user ? this.state.user : this.props.user;
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;

    return (
      <View style={styles.conatainer}>
        <CardComponent
          item={user}
          height={height * 0.3}
          width={width * 0.7}
          allowControl={true}
          user={true}
          toogleOverlay={this._toggleOverlay}
          setItemForOverlay={this._tempUserItemsOverlay}
        />
        <Text style={styles.titleText}>My Products({myProducts.length})</Text>
        <FlatList
          data={myProducts}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => (
            <CardComponent
              item={item}
              height={height * 0.3}
              width={width * 0.49}
              allowControl={true}
              toogleOverlay={this._toggleOverlay}
              setItemForOverlay={this._tempItemsOverlay}
            />
          )}
          keyExtractor={(item) => item.id}
        />
        <Overlay
          isVisible={this.state.isVisible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="red"
          width="auto"
          height="auto"
          onBackdropPress={this._toggleOverlay}
        >
          {!userFlag ? (
            <View>
              <TextInput
                placeholder="name"
                style={styles.textInput}
                value={name}
                onChangeText={(name) =>
                  this.setState({
                    itemForOverlay: { ...this.state.itemForOverlay, name },
                  })
                }
              />

              <TextInput
                placeholder="quantity"
                style={styles.textInput}
                value={quantity}
                onChangeText={(quantity) =>
                  this.setState({
                    itemForOverlay: { ...this.state.itemForOverlay, quantity },
                  })
                }
              />

              <TextInput
                placeholder="location"
                style={styles.textInput}
                value={location}
                onChangeText={(location) =>
                  this.setState({
                    itemForOverlay: { ...this.state.itemForOverlay, location },
                  })
                }
              />
              <TextInput
                placeholder="price"
                style={styles.textInput}
                keyboardType="phone-pad"
                value={price}
                onChangeText={(price) =>
                  this.setState({
                    itemForOverlay: { ...this.state.itemForOverlay, price },
                  })
                }
              />

              <Button
                title="Edit"
                loading={this.state.loading}
                disabled={
                  name.length &&
                  location.length &&
                  price.length &&
                  quantity.length
                    ? false
                    : true
                }
                onPress={this._onEditProduct}
              />
            </View>
          ) : (
            <View>
              <TextInput
                placeholder="user name"
                style={styles.textInput}
                keyboardType="default"
                value={this.state.userItemsForOverlay.name}
                onChangeText={(name) =>
                  this.setState({
                    userItemsForOverlay: {
                      ...this.state.userItemsForOverlay,
                      name,
                    },
                  })
                }
              />
              <TextInput
                placeholder="user location"
                style={styles.textInput}
                keyboardType="default"
                value={this.state.userItemsForOverlay.location}
                onChangeText={(location) =>
                  this.setState({
                    userItemsForOverlay: {
                      ...this.state.userItemsForOverlay,
                      location,
                    },
                  })
                }
              />
              <TextInput
                placeholder="user password"
                style={styles.textInput}
                keyboardType="default"
                value={this.state.userItemsForOverlay.password}
                onChangeText={(password) =>
                  this.setState({
                    userItemsForOverlay: {
                      ...this.state.userItemsForOverlay,
                      password,
                    },
                  })
                }
              />

              <Button
                title="Edit User"
                loading={this.state.loading}
                disabled={
                  this.state.userItemsForOverlay.name.length &&
                  this.state.userItemsForOverlay.location.length &&
                  this.state.userItemsForOverlay.password.length
                    ? false
                    : true
                }
                onPress={this._onEditUser}
              />
            </View>
          )}
        </Overlay>
      </View>
    );
  }
}

const mapStateToProps = (store) => ({
  myProducts: store.products.productsById,
  user: store.auth.user,
});

export default connect(mapStateToProps, { editProduct, editUser })(profile);

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 5,
  },
  conatainer: {
    flex: 1,
  },
  titleText: {
    fontFamily: "serif",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 6,
    marginLeft: 10,
  },
});
