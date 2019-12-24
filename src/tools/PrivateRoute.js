import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { isAuth } from './helpers';

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      haveAccess: false,
      loaded: false,
    };

    this.checkAccess = this.checkAccess.bind(this);
  }

  componentDidMount() {
    this.checkAccess();
  }

  // see if we can access the provide page
  checkAccess() {
    isAuth(localStorage.getItem('token'), (res) => {
      this.setState({
        haveAccess: res.success,
        loaded: true,
      });
    });
  }

  render() {
    // don't load the page until we know if we can access it or not
    if (!this.state.loaded) return null;

    // do this to take the props from the PrivateRoute to a normal Route
    const { component: Component, ...rest } = this.props;

    // once we figure out if we have access, either load the page or redirect
    return (
      <Route
        {...rest}
        render={(props) => {
          return this.state.haveAccess ? (
            <Component {...props} />
          ) : (
            <Redirect to="/admin/login" />
          );
        }}
      />
    );
  }
}

PrivateRoute.propTypes = {
  component: PropTypes.func,
};

export default withRouter(PrivateRoute);
