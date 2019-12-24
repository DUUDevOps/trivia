import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.css';
import { withFirebase } from '../../../components/Firebase/firebase';

class EditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quiz: {},
      redirect: false,
    };

    this.id = props.match.params.id;
    this.firebase = props.firebase;
  }

  componentDidMount() {
    this.firebase.getQuiz(this.id, (res) => {
      if (!res.success) {
        this.setState({ redirect: true });
      } else {
        this.setState({ quiz: res.data });
      }
    });
  }

  render() {
    if (!this.id || this.state.redirect) {
      return <Redirect to="/admin/dashboard" />
    }

    return (
      <div className={styles.container}>
        {this.state.quiz.name ? (
          <div className={styles.header}>
            {this.state.quiz.name}
          </div>
        ) : null}
      </div>
    );
  }
}

EditPage.propTypes = {
  match: PropTypes.object,
};

export default withFirebase(EditPage);
