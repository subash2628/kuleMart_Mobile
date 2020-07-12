//export default CatagoriesScreen;

import React from "react";
import { View } from "react-native";
//import { AppLoading } from "expo";
import { Container, Text } from "native-base";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";

import store from "./Store/store";
import { Provider } from "react-redux";
// import { getCatagories } from "./Store/actions/productActions";
import Login from "./Screens/Login";
import RegisterScreen from "./Screens/Register";
import {
  getCatagories,
  setAllCatagories,
  setAllProducts,
} from "./Store/actions/productActions";
import { getData } from "./Components/localStorage";
//import { connect } from "react-redux";
import ScreenStack from "./Navigations/stack";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await SplashScreen.preventAutoHideAsync();
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Merriweather: require("./fonts/Merriweather/Merriweather-Regular.ttf"),
      Lora: require("./fonts/Lora/Lora-VariableFont_wght.ttf"),
      ...Ionicons.font,
    });
    //await this.props.getCatagories();
    //console.log("app did mount");

    //fetching catagories here
    // const allProducts = await getData("allProducts");
    // const allCatagories = await getData("allCatagories");
    // console.log("offline", allProducts);
    // if (!allCatagories) {
    //   getCatagories(); //from remote
    // } else {
    //   store.dispatch(setAllCatagories(allCatagories));
    //   store.dispatch(setAllProducts(allProducts));
    // }

    this.setState({ isReady: true }, async () => {
      await SplashScreen.hideAsync();
      //console.log("hide");
    });
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }

    return (
      <Provider store={store}>
        <ScreenStack />
      </Provider>
    );

    //return <RegisterScreen />;
  }
}

export default App;
