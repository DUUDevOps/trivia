import React from 'react';

import styles from '../../client/RegisterPage/styles.module.css';
import TextInput from '../../../components/TextInput';
import { FirebaseContext } from '../../../components/Firebase/firebase';

const LoginPage = () => (
  <FirebaseContext.Consumer>
    {firebase => <LoginContainer firebase={firebase} />}
  </FirebaseContext.Consumer>
);

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password:'',
    };

    this.firebase = props.firebase;
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.firebase.signInWithEmail(this.state.email, this.state.password, (error) => {
      if (error) {
        console.log("Error"); // TODO: better error handling here
      } else {
        this.props.history.push("/admin/create");
      }
    });
  } 

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          login
        </div>
        <div className={styles.section}>
          <div className={styles.subheader}>
            email
          </div>
          <div className={styles.inputContainer}>
            <TextInput
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
              width="80%"
            />
          </div>
        </div>
      
        <div className={styles.section}>
          <div className={styles.subheader}>
            password
          </div>
          <div className={styles.inputContainer}>
            <TextInput
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
              width="80%"
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.button} role="button" onClick={(e) => this.onSubmit()}>
            login
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
