import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

import styles from './styles.module.css';
import { isAuth } from '../../../tools/helpers';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    isAuth(localStorage.getItem('token'), (res) => {
      if (!res.success) {
        return <Redirect to="/admin/login" />
      }
    });

    return (
      <div className={styles.container}>
        herro
      </div>
    );
  }
}

DashboardPage.propTypes = {
};

export default DashboardPage;
