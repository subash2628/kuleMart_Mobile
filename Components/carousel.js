import * as React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";

import Carousel from "react-native-snap-carousel";
import Card from "../Components/card";

class Slider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  render() {
    const { data } = this.props;
    //console.log("carousel ", data);
    const W = Dimensions.get("window").width;
    const H = Dimensions.get("window").height;
    //const section = {title: };
    return (
      <View style={styles.carousel}>
        <Carousel
          layout={"default"}
          ref={(ref) => (this.carousel = ref)}
          data={data}
          sliderWidth={350}
          itemWidth={150}
          renderItem={({ item }) => (
            <Card item={item} height={H * 0.3} width={W * 0.4} />
          )}
          onSnapToItem={(index) => this.setState({ activeIndex: index })}
        />
      </View>
    );
  }
}
export default Slider;

const styles = StyleSheet.create({
  card: {
    height: 150,
  },
  titleText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Merriweather",
  },
  toplevel: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
    //paddingBottom: 20,
  },
  carouselItems: {
    backgroundColor: "floralwhite",
    borderRadius: 5,
    height: 150,
    padding: 30,
    marginLeft: 10,
    marginRight: 10,
  },
});
