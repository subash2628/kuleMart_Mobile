import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";

import Carousel from "../Components/carousel";

class ProductScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      catagories: null,
      sectionTitle: null,
    };
    this._renderItem = this._renderItem.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ catagories: this.props.catagories });
    }
  }
  _renderItem({ section }) {
    sectionTitle.name = section.title;
    console.log("section ", sectionTitle);
    const sectionTitle = section.title;
    return <Carousel data={section.data} />;
  }
  render() {
    const catagories = this.state.catagories
      ? this.state.catagories
      : this.props.catagories;
    console.log("catagories ", catagories);

    return (
      <ScrollView style={styles.container}>
        {catagories &&
          catagories.map((catagory, index) => (
            <View key={index} style={styles.encapsulateTextAndCarousel}>
              <Text style={styles.catagoryTitle}>
                {catagory.title}({catagory.data.length})
              </Text>
              <Carousel data={catagory.data} />
            </View>
          ))}
      </ScrollView>
    );
  }
}

const mapStateToProps = (store) => ({
  catagories: store.products.catagories,
});
export default connect(mapStateToProps, {})(ProductScreen);

const styles = StyleSheet.create({
  encapsulateTextAndCarousel: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "rebeccapurple",
  },
  catagoryTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "Merriweather",
  },
  test: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
