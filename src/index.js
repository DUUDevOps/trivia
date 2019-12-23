import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';

import Firebase, { FirebaseContext } from './components/Firebase/firebase';
import PrivateRoute from './tools/PrivateRoute';

import HomePage from './containers/HomePage';
import RegisterPage from './containers/client/RegisterPage';
import LoginPage from './containers/admin/LoginPage';
import DashboardPage from './containers/admin/DashboardPage';
import GradingPage from './containers/admin/GradingPage';
import HostQuestionPage from './containers/admin/HostQuestionPage';
import CreateQuizPage from './containers/admin/CreateQuizPage';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/play/register" component={RegisterPage} />
        <Route exact path="/admin/login" component={LoginPage} />
        <PrivateRoute exact path="/admin/dashboard" component={DashboardPage} />
        <Route exact path="/admin/grading/:team" component={GradingPage} />
        <Route exact path="/host/question/:qnum" component={HostQuestionPage} />
        <Route exact path="/admin/create" component={CreateQuizPage} />
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
