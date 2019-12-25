import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.css';
import { withFirebase } from '../../../components/Firebase/firebase';
import getExcuse from './excuses';

class WaitingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      excuse: getExcuse(),
    };

    this.firebase = props.firebase;
    this.changeExcuse = this.changeExcuse.bind(this);
  }

  componentDidMount() {
    // listen for firebase events
  }

  changeExcuse() {
    this.setState({ excuse: getExcuse() });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.text}>
          waiting because the host is
        </div>
        <div className={styles.excuseText}>
          {this.state.excuse}
        </div>

        <div className={styles.noButton} role="button" tabIndex={0} onClick={this.changeExcuse}>
          no
        </div>
      </div>
    );
  }
}

WaitingPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(withFirebase(WaitingPage));
