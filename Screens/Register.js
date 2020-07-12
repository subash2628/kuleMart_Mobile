import React, { Component } from "react";
import { StyleSheet } from "react-native";
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
import { registeruser } from "../Store/actions/authActions";

class StackedLabelExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: "",
      LastName: "",
      phoneNumber: "",
      Company: "",
      Location: "",
      Password: "",
      ConformPassword: "",
    };
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  async _onSubmit() {
    const {
      FirstName,
      LastName,
      phoneNumber,
      Company,
      Location,
      Password,
      ConformPassword,
    } = this.state;

    const newUser = {
      name: `${FirstName} ${LastName}`,
      contact: phoneNumber,
      password: Password,
      conformPassword: ConformPassword,
      location: Location,
      company: Company,
    };

    this.setState({ errors: null });
    await this.props.registeruser(newUser);
  }

  render() {
    const {
      FirstName,
      LastName,
      phoneNumber,
      Company,
      Location,
      Password,
      ConformPassword,
      errors,
    } = this.state;

    const disableSubmitButton =
      FirstName &&
      LastName &&
      phoneNumber.length === 10 &&
      Company &&
      Location &&
      Password.length >= 6 &&
      ConformPassword &&
      Password.length === ConformPassword.length
        ? false
        : true;

    const phoneError = errors ? (errors.phone ? true : false) : false;
    return (
      <Container>
        <Content style={styles.content}>
          <Form>
            <Item stackedLabel success={FirstName.length >= 2 ? true : false}>
              <Label>FirstName</Label>
              <Input
                value={FirstName}
                onChangeText={(FirstName) => this.setState({ FirstName })}
              />
            </Item>
            <Item stackedLabel success={LastName.length >= 2 ? true : false}>
              <Label>LastName</Label>
              <Input
                value={LastName}
                onChangeText={(LastName) => this.setState({ LastName })}
              />
            </Item>
            <Item
              stackedLabel
              success={phoneNumber.length === 10 ? true : false}
              error={phoneError}
            >
              {phoneError ? (
                <Label style={styles.label}>{errors.phone}</Label>
              ) : (
                <Label>phoneNumber</Label>
              )}
              <Input
                value={phoneNumber}
                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                autoCompleteType="tel"
                keyboardType="phone-pad"
              />
            </Item>
            <Item stackedLabel success={Company.length >= 6 ? true : false}>
              <Label>your Company Name</Label>
              <Input
                value={Company}
                onChangeText={(Company) => this.setState({ Company })}
              />
            </Item>
            <Item stackedLabel success={Location.length >= 3 ? true : false}>
              <Label>Location</Label>
              <Input
                value={Location}
                onChangeText={(Location) => this.setState({ Location })}
              />
            </Item>
            <Item stackedLabel success={Password.length >= 6 ? true : false}>
              <Label>Password</Label>
              <Input
                value={Password}
                onChangeText={(Password) => this.setState({ Password })}
                autoCompleteType="password"
                secureTextEntry={true}
              />
            </Item>
            <Item
              stackedLabel
              last
              success={
                ConformPassword.length === Password.length
                  ? Password.length
                    ? true
                    : false
                  : false
              }
            >
              <Label>Conform Password</Label>
              <Input
                value={ConformPassword}
                onChangeText={(ConformPassword) =>
                  this.setState({ ConformPassword })
                }
                autoCompleteType="password"
                secureTextEntry={true}
              />
            </Item>
          </Form>
          <Button
            icon={<Icon name="arrow-right" size={15} color="white" />}
            title="Register"
            containerStyle={styles.buttonContainer}
            onPress={this._onSubmit}
            disabled={disableSubmitButton}
          />
        </Content>
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  errors: state.errors,
});
export default connect(mapStateToProps, { registeruser })(StackedLabelExample);

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 10,
  },
  label: {
    color: "red",
  },
  content: {
    marginTop: 10,
  },
});
