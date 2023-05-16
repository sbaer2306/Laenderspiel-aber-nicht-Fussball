import React from 'react';

class AuthPage extends React.Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="jumbotron text-center text-primary">
            <h1>
              <span className="fa fa-lock"></span> Social Authentication
            </h1>
            <p>Login or Register with:</p>
            <a href="/auth/google" className="btn btn-danger">
              <span className="fa fa-google"></span> SignIn with Google
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthPage;
