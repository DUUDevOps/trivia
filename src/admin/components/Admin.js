import React, { Component } from 'react';
import './Admin.css';
import firebase from '../../firebase';

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      QA: []
    }
  }

  handleChange = index => event => {
    
  }

  render() {
    return (
      <div className="admin">
        <h1>Welcome to Trivia</h1>
        <div className="container">
          <p>Please enter your questions and answers here</p>
        </div>
      </div>
    );
  }
};

export default Admin;
