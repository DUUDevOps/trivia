import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.css';
import { withFirebase } from '../../../components/Firebase/firebase';
import TextInput from '../../../components/TextInput';
import Loader from '../../../components/Loader';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      loading: false,
    };

    this.firebase = props.firebase;
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(e) {
    // necessary because forms reload the page on submission by default
    e.preventDefault();
    // show the loading icon
    this.setState({ loading: true });

    // try to sign in with firebase
    this.firebase.signInWithEmail(this.state.email, this.state.password, (res) => {
      // if it works, send the user to their dashboard
      if (res.success) {
        this.props.history.push('/admin/dashboard');
      } else {
        // otherwise show the error, and make sure to stop loading
        // the error goes away when the user changes their input
        this.setState({
          error: res.msg,
          loading: false,
        });
      }
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <form onSubmit={this.onLogin} className={styles.form}>
          <div className={styles.header}>
            login
          </div>

          <div className={styles.subheader}>
            email
          </div>
          <TextInput
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value, error: '' })}
            width="80%"
          />

          <div className={styles.subheader}>
            password
          </div>
          <TextInput
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value, error: '' })}
            width="80%"
            type="password"
          />

          {this.state.loading ? (
            <Loader margin="35px auto 25px auto" />
          ) : this.state.error ? (
            <div className={styles.error}>
              {this.state.error}
            </div>
          ) : (
            <input
              type="submit"
              value="let's go"
              className={styles.button}
              tabIndex={0}
            />
          )}
        </form>
      </div>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(withFirebase(LoginPage));
