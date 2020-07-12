import React, { Component } from "react";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Avatar } from "react-native-elements";
import Icon1 from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import Icon3 from "react-native-vector-icons/AntDesign";
import AlertComp from "../Components/Alert";

import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Icon,
  Left,
  Body,
  Right,
} from "native-base";

import { deleteProduct } from "../Store/actions/productActions";
import { deleteUser } from "../Store/actions/authActions";

export default function ({
  height,
  width,
  item,
  allowControl,
  user,
  toogleOverlay,
  setItemForOverlay,
}) {
  //const { height, width, item, allowControl, user } = this.props;

  return (
    <View style={[styles.cardView]}>
      {!user ? (
        <Card style={[{ height: height, width: width }]}>
          <CardItem cardBody>
            <Image
              source={{
                uri: item
                  ? item.imageLink
                    ? item.imageLink
                    : "https://source.unsplash.com/random"
                  : "https://source.unsplash.com/random",
              }}
              style={{ height: height * 0.5, width: null, flex: 1 }}
            />
          </CardItem>
          <View style={styles.actionsAndDetailsInline}>
            {allowControl && (
              <TouchableOpacity
                onPress={() =>
                  AlertComp({
                    title: "Delete Product ?",
                    message: `${item.name} will be deleted`,
                    action: () =>
                      deleteProduct({
                        productID: item.id,
                        catagoryName: item.catagory,
                      }),
                  })
                }
              >
                <Icon2 name="delete-outline" size={20} color="red" />
              </TouchableOpacity>
            )}

            <CardItem style={styles.detailView}>
              <Text style={styles.cardName}> {item.name}</Text>
              {!allowControl && (
                <Text style={styles.text}> {item.contact}</Text>
              )}
              <Text style={styles.text}> Address: {item.location}</Text>
              <Text style={styles.text}> Rs.{item.price}</Text>
              <Text style={styles.text}> Quantity: {item.quantity}</Text>
              {!allowControl && (
                <Text style={styles.text}> Vendor: {item.vendor}</Text>
              )}
            </CardItem>

            {allowControl && (
              <TouchableOpacity
                style={{ marginRight: width * 0 }}
                onPress={() => {
                  setItemForOverlay({
                    name: item.name,
                    location: item.location,
                    price: item.price,
                    quantity: item.quantity,
                    catagory: item.catagory,
                    productID: item.id,
                  }),
                    toogleOverlay();
                }}
              >
                <Icon1 name="edit" size={15} />
              </TouchableOpacity>
            )}
          </View>
        </Card>
      ) : (
        //user details
        <View style={styles.userView}>
          <Avatar
            source={{
              uri:
                "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
            }}
            showEditButton={true}
            rounded
            size="large"
          />
          <View style={styles.userDetails}>
            <Text style={styles.cardName}> {item.name}</Text>
            <Text style={styles.text}> Id: {item.id}</Text>
            <Text style={styles.text}> {item.location}</Text>
            <Text style={styles.text}> {item.company}</Text>
            <Text style={styles.text}> {item.phone}</Text>

            <View style={styles.userActionIcons}>
              <TouchableOpacity
                style={{ marginRight: width * 0.3 }}
                onPress={() => {
                  setItemForOverlay({
                    name: item.name,
                    location: item.location,
                    //password: item.password,
                  });
                  toogleOverlay();
                }}
              >
                <Icon1 name="user-edit" size={15} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  AlertComp({
                    title: "Delete User ?",
                    message: `products of ${item.name} will be deleted`,
                    action: () => console.log("deleting User"),
                  })
                }
              >
                <Icon3 name="deleteuser" size={18} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionsAndDetailsInline: {
    flexDirection: "row",
    justifyContent: "center",
  },
  userActionIcons: {
    flexDirection: "row",
  },
  userDetails: {
    flexDirection: "column",
    marginLeft: 15,
  },
  userView: {
    flexDirection: "row",
    padding: 10,
    //marginLeft: 30,
  },
  detailView: {
    flexDirection: "column",
  },
  actionText: {
    color: "blue",
    //backgroundColor: "green",
    //paddingTop: 0,
    fontSize: 12,
    opacity: 0.4,
  },
  cardActionView: {
    //backgroundColor: "yellow",
    flexDirection: "row",
    paddingTop: 0,
    paddingBottom: 0,
    //flexGrow: 0.5,
    alignContent: "space-between",
  },
  text: {
    fontSize: 8.5,
    fontFamily: "serif",
    marginLeft: 10,
  },
  cardName: {
    fontSize: 10,
    fontFamily: "Merriweather",
    color: "tomato",
  },
  cardView: {
    borderRadius: 10,
    //padding: 5,
    margin: 0,
    alignItems: "center",
  },
});
