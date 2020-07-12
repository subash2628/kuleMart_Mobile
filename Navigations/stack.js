import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { BlurView } from "expo-blur";

import LoginScreen from "../Screens/Login";
import RegisterScreen from "../Screens/Register";
import { Button } from "react-native-elements";
import Tab from "./tab";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { setCurrentUser, logout_user } from "../Store/actions/authActions";
import store from "../Store/store";
import {
  getCatagories,
  setAllCatagories,
  setAllProducts,
  getProductsById,
  setProductsById,
} from "../Store/actions/productActions";
import { getData, storeData } from "../Components/localStorage";
import SellScreen from "../Screens/sellProduct";
//import { setCurrentUser } from "../Store/actions/authActions";
import ProfileScreen from "../Screens/profile";
import AlertComp from "../Components/Alert";

const Stack = createStackNavigator();

class StackScreen extends React.Component {
  async componentDidMount() {
    const catagories = await getData("allCatagories");
    const products = await getData("allProducts");
    const user = await getData("user");
    const productsById = await getData("productsById");

    if (catagories && products) {
      console.log("utilizing offline data");
      store.dispatch(setAllCatagories(catagories));
      store.dispatch(setAllProducts(products));
    } else {
      console.log("fetching online data");
      this.props.getCatagories();
    }
    if (user) {
      store.dispatch(setCurrentUser(user));
    }
    if (productsById && user) {
      store.dispatch(setProductsById(productsById));
    }
  }

  render() {
    const { isAuthenticated } = this.props;
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Tab" headerMode="screen">
          <Stack.Screen
            name="Tab"
            component={Tab}
            options={({ navigation }) => ({
              headerTitle: () => (
                <Text
                  style={{
                    fontFamily: "Lora",
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                >
                  Products
                </Text>
              ),
              headerTitleAlign: "center",
              headerLeft: () => (
                <Button
                  icon={<Icon name="user-circle" size={35} />}
                  type="clear"
                  onPress={() => {
                    isAuthenticated
                      ? navigation.navigate("Profile")
                      : navigation.navigate("Login");
                  }}
                />
              ),
              headerRight: () => (
                <Button
                  title="SELL"
                  type="clear"
                  onPress={() => {
                    isAuthenticated
                      ? navigation.navigate("Sell")
                      : navigation.navigate("Login");
                  }}
                />
              ),
              headerBackground: () => (
                <BlurView
                  tint="light"
                  intensity={100}
                  style={StyleSheet.absoluteFill}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={({ navigation }) => ({
              headerTitle: () => (
                <Text
                  style={{
                    fontFamily: "Lora",
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                >
                  Profile
                </Text>
              ),
              headerTitleAlign: "center",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    AlertComp({
                      title: "Log Out ?",
                      message: "you will be logged out",
                      action: () => {
                        store.dispatch(logout_user());
                        navigation.goBack();
                      },
                    });
                  }}
                >
                  <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>
              ),
              headerBackground: () => (
                <BlurView
                  tint="light"
                  intensity={100}
                  style={StyleSheet.absoluteFill}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Sell"
            component={SellScreen}
            options={({ navigation }) => ({
              headerBackground: () => (
                <BlurView
                  tint="light"
                  intensity={100}
                  style={StyleSheet.absoluteFill}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={({ navigation }) => ({
              //headerTransparent: true,
              headerRight: () => (
                <Button
                  title="Register"
                  type="clear"
                  onPress={() => navigation.navigate("Register")}
                />
              ),
              headerBackground: () => (
                <BlurView
                  tint="light"
                  intensity={100}
                  style={StyleSheet.absoluteFill}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerBackground: () => (
                <BlurView
                  tint="light"
                  intensity={100}
                  style={StyleSheet.absoluteFill}
                />
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const mapStateToProp = (store) => ({
  isAuthenticated: store.auth.isAuthenticated,
});

export default connect(mapStateToProp, { getCatagories })(StackScreen);

function Tabb() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Tabb</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    color: "tomato",
  },
  logout: {
    color: "red",
    marginRight: 7,
    fontSize: 15,
  },
});
