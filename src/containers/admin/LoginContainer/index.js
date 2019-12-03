import React from 'react';
import { withRouter } from 'react-router-dom';

import styles from '../../client/RegisterPage/styles.module.css';
import TextInput from '../../../components/TextInput';

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
      console.log(`EMAIL: ${this.state.email}\tPASSWORD: ${this.state.password}`);
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
            <button onClick={(e) => this.onSubmit()}>Login</button>
          </div>
        </div>
      );
    }
  }
  
  export default withRouter(LoginContainer);