import React from "react";

class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      signInEmail: null,
      signInPassword: null
    }
  }
  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value});
  }
  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value});
  }
  onSubmitSignIn = () => {
    fetch('http://localhost:3002/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.signInEmail, 
        password: this.state.signInPassword
      })
    })
    .then(response => response.json())
    .then(user => {
      console.log('user', JSON.stringify(user));
      if (user._id){
        this.props.loadUser(user);
        this.props.onRouteChange('main');
      }
    })
  }
  render(){
    const { onRouteChange } = this.props;
    return (
      <article className="mw6 center b--black-10 br3 mv3 w-200 w-50-m w-25-l  ba shadow-5">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
                onClick={this.onSubmitSignIn}
              />
            </div>
            <div className="lh-copy mt3">
              <p className="f6 link dim black db pointer" onClick={() => onRouteChange('register')}>
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
};

export default Signin;
