import React, { Component } from "react";
import { Image, StyleSheet, FlatList, Dimensions } from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from "native-base";

import CardComponent from "../Components/card";
import { connect } from "react-redux";
import store from "../Store/store";
import { setCurrentUser } from "../Store/actions/authActions";
import { getCatagories } from "../Store/actions/productActions";

class CatagoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      refreshing: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.products !== this.props.products) {
      this.setState({ products: this.props.products, refreshing: false });
    } else if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      //this.props.navigation.navigate("Tab");
      //console.log("product component mount ");
      //!this.props.isAuthenticated && console.log("auth");
    } //store.dispatch(setCurrentUser()
  }

  render() {
    const products = this.state.products
      ? this.state.products
      : this.props.products;
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;

    return (
      <Container style={styles.container}>
        <FlatList
          data={products}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => (
            <CardComponent
              item={item}
              height={height * 0.3}
              width={width * 0.49}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshing={this.state.refreshing}
          onRefresh={this.props.getCatagories}
        />
      </Container>
    );
  }
}

const mapStateToProps = (store) => ({
  products: store.products.products,
  isAuthenticated: store.auth.isAuthenticated,
});
export default connect(mapStateToProps, { getCatagories })(CatagoriesScreen);

const styles = StyleSheet.create({
  container: {
    paddingRight: 0,
    flex: 1,
    backgroundColor: "rebeccapurple",
  },
});
