import React, {Component} from 'react';
import LoginContext from './LoginContext';

class LoginContextProvider extends Component {
  state = {
    userSignedIn: false,
    name: '',
    photoUrl: '',
  };

  userLogIn = (name, photoUrl) => {
    this.setState({
      userSignedIn: true,
      name,
      photoUrl,
    });
  };

  render() {
    return (
      <LoginContext.Provider
        value={{
          state: this.state,
          userLogIn: this.userLogIn,
        }}>
        {this.props.children}
      </LoginContext.Provider>
    );
  }
}
export default LoginContextProvider;
