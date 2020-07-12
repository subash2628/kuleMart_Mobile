import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";

export default function ({ title, message, action }) {
  Alert.alert(
    title,
    message,
    [
      {
        text: "Cancel",
        //onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: action },
    ],
    { cancelable: false }
  );
}

//   const createTwoButtonAlert = () =>
// Alert.alert(
//   "Alert Title",
//   "My Alert Msg",
//   [
//     {
//       text: "Cancel",
//       onPress: () => console.log("Cancel Pressed"),
//       style: "cancel",
//     },
//     { text: "OK", onPress: () => console.log("OK Pressed") },
//   ],
//   { cancelable: false }
// );

//   const createThreeButtonAlert = () =>

//   return (
//     <View style={styles.container}>
//       <Button title="2-Button Alert" onPress={createTwoButtonAlert} />

//       <Button title="3-Button Alert" onPress={createThreeButtonAlert} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "space-around",
//     alignItems: "center",
//   },
// });
