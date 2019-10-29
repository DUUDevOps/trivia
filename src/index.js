import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Firebase, { FirebaseContext } from './components/Firebase/firebase';

import HomePage from './containers/HomePage';
import RegisterPage from './containers/client/RegisterPage';
import LoginPage from './containers/admin/LoginPage';
import HostQuestionPage from './containers/admin/HostQuestionPage';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/play/register" component={RegisterPage} />
        <Route exact path="/admin/login" component={LoginPage} />
        <Route exact path="/host/question/:qnum" component={HostQuestionPage} />
        <Route component={HomePage} />
      </Switch>
    </BrowserRouter>
  </FirebaseContext.Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
