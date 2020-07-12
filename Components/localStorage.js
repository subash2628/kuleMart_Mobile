import React from "react";
import AsyncStorage from "@react-native-community/async-storage";

export const storeData = async (key, value) => {
  try {
    const jsonValue = value ? JSON.stringify(value) : "";
    await AsyncStorage.setItem(`${key}`, jsonValue);
    return 200;
  } catch (e) {
    // saving error
    console.log(e);
    return 400;
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log(e);
    return 400;
  }
};
