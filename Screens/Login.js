import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
} from "native-base";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { loginUser } from "../Store/actions/authActions";
import { getProductsById } from "../Store/actions/productActions";

class StackedLabelExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
      loading: null,
    };
    this._onLogin = this._onLogin.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors, loading: false });
    }
    if (prevProps.user !== this.props.user) {
      this.props.getProductsById(this.props.user.Products, this.props.products);
    }
  }
  async _onLogin() {
    const { phone, password } = this.state;
    this.setState({ loading: true });
    //this.props.navigation.goBack();
    const { navigation } = this.props;
    await this.props.loginUser({
      phone,
      password,
      goBack: () => navigation.goBack(),
    });
  }

  render() {
    const { phone, password, loading, errors } = this.state;
    const disableButton =
      phone.length === 10 && password.length >= 6 ? false : true;
    const passwordError = errors ? (errors.password ? true : false) : false;
    const phoneError = errors ? (errors.phone ? true : false) : false;

    return (
      <Container>
        <Content style={styles.content}>
          <Form>
            <Item stackedLabel>
              <Label>
                {!phoneError ? (
                  "Phone Number(10 digit)"
                ) : (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </Label>
              <Input
                value={phone}
                onChangeText={(phone) => this.setState({ phone })}
                autoCompleteType="tel"
                keyboardType="phone-pad"
              />
            </Item>
            <Item stackedLabel last>
              <Label>
                {!passwordError ? (
                  "Password( atleast 6 characters)"
                ) : (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </Label>
              <Input
                value={password}
                onChangeText={(password) => this.setState({ password })}
                autoCompleteType="password"
                secureTextEntry={true}
              />
            </Item>
          </Form>
          <Button
            icon={<Icon name="arrow-right" size={15} color="white" />}
            title="Login"
            containerStyle={styles.buttonContainer}
            disabled={disableButton}
            onPress={this._onLogin}
            loading={loading}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProp = (store) => ({
  errors: store.errors,
  user: store.auth.user,
  products: store.products.products,
});
export default connect(mapStateToProp, { loginUser, getProductsById })(
  StackedLabelExample
);

const styles = StyleSheet.create({
  errorText: {
    color: "red",
  },
  content: {
    marginTop: 10,
  },
  buttonContainer: {
    margin: 10,
  },
});
