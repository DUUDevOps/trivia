import React from 'react';

import { FirebaseContext } from '../../../components/Firebase/firebase';
import LoginContainer from '../LoginContainer';

const LoginPage = () => (
  <FirebaseContext.Consumer>
    {firebase => <LoginContainer firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default LoginPage;
