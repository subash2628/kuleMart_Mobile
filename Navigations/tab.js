import * as React from "react";
import { Text, View } from "react-native";
//import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import CatagoryScreen from "../Screens/Catagories";
import ProductScreen from "../Screens/Products";

const Tab = createBottomTabNavigator();

export default function () {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Products") {
            iconName = focused ? "md-grid" : "md-grid";
          } else if (route.name === "Catagories") {
            iconName = focused ? "md-list" : "md-list";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Products" component={ProductScreen} />
      <Tab.Screen name="Catagories" component={CatagoryScreen} />
    </Tab.Navigator>
  );
}
