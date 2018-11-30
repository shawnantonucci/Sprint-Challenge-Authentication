import React, { Component } from "react";
import axios from "axios";
import { Inputform, Inputs, SubmitBtn, LoginLabel } from '../Styles.js';

const url = process.env.REACT_APP_API_URL;

const initialUser = {
  username: "",
  password: "",
};

export class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { ...initialUser },
      message: ""
    };
  }

  inputHandler = event => {
    const { name, value } = event.target;
    this.setState({ user: { ...this.state.user, [name]: value } });
  };

  submitHandler = event => {
    event.preventDefault();
    axios
      .post(`${url}/api/register`, this.state.user)
      .then(res => {
        if (res.status === 201) {
          this.setState({
            message: "Registration successful",
            user: { ...initialUser }
          });
          this.props.history.push("/");
        } else {
          throw new Error();
        }
      })
      .catch(err => {
        this.setState({
          message: "Registration failed...",
          user: { ...initialUser }
        });
      });
  };

  render() {
    return (
        <div>
            <LoginLabel htmlFor="username">Sign Up</LoginLabel>
            <Inputform onSubmit={this.submitHandler}>
                <label htmlFor="username">Username:</label>
                <Inputs type="text" id="username" name="username" value={this.state.user.username} onChange={this.inputHandler}/>
                <label htmlFor="password">Password:</label>
                <Inputs type="text" id="password" name="password" value={this.state.user.password} onChange={this.inputHandler}/>
                <SubmitBtn type="submit">Submit</SubmitBtn>
            </Inputform>
            {
                this.state.message
                ? (<h4>{this.state.message}</h4>)
                : undefined
            }
        </div>
    );
  }
}

export default Signup;
