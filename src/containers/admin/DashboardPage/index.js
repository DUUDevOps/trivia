import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { isMobile } from 'react-device-detect';

import styles from './styles.module.css';
import { withFirebase } from '../../../components/Firebase/firebase';
import PopUp from '../../../components/PopUp';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quizzes: [],
      creating: false,
      createText: '',
      loading: false,
      deleteId: '',
    };

    this.firebase = props.firebase;

    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.loadQuizzes = this.loadQuizzes.bind(this);
  }

  componentDidMount() {
    this.loadQuizzes();
  }

  onCreate() {
    this.setState({ loading: true });
    this.firebase.createQuiz(this.state.createText, (id) => {
      this.props.history.push(`/admin/edit/${id}`);
    });
  }

  onDelete() {
    this.setState({ loading: true });
    this.firebase.deleteQuiz(this.state.deleteId, () => {
      this.setState({ loading: false, deleteId: '' });
      this.loadQuizzes();
    });
  }

  loadQuizzes() {
    this.firebase.getQuizzes((quizzes) => {
      this.setState({ quizzes });
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          dashboard
        </div>

        <div
          className={styles.createContainer}
          role="button"
          tabIndex={0}
          onClick={() => this.setState({ creating: true, createText: '' })}
        >
          <i className={classNames('fas fa-plus', styles.createIcon)} />
          <div className={styles.createText}>
            create new quiz
          </div>
        </div>

        <div className={styles.quizzesContainer}>
          {this.state.quizzes.map((q) => (
            <div className={styles.quizHolder} key={q.id}>
              <div className={styles.quizContainer}>
                {q.data.name}
              </div>

              <div className={styles.quizButtonContainer}>
                {!isMobile ? <ReactTooltip place="top" effect="solid" className={styles.tooltip} /> : null}
                <Link
                  className={classNames('fas fa-pencil-alt', styles.quizButton)}
                  data-tip="edit"
                  to={`/admin/edit/${q.id}`}
                />
                <Link
                  className={classNames('fas fa-play', styles.quizButton)}
                  data-tip="host"
                  to={`/admin/host/${q.id}`}
                />
                <i
                  className={classNames('fas fa-trash-alt', styles.quizButton)}
                  data-tip="delete"
                  role="button"
                  tabIndex={0}
                  onClick={() => this.setState({ deleteId: q.id })}
                />
              </div>
            </div>
          ))}
        </div>

        {this.state.creating ? (
          <PopUp
            text="enter a title for the new quiz pls"
            buttonOne={{
              text: 'create',
              onClick: this.onCreate,
            }}
            buttonTwo={{
              text: 'nvm',
              onClick: () => this.setState({ creating: false }),
            }}
            loading={this.state.loading}
            inputValue={this.state.createText}
            inputChange={(e) => this.setState({ createText: e.target.value })}
            inputPlaceholder="title"
          />
        ) : this.state.deleteId ? (
          <PopUp
            text="do you really want to say goodbye to this quiz?"
            buttonOne={{
              text: 'yeh',
              onClick: this.onDelete,
            }}
            buttonTwo={{
              text: 'nooo!',
              onClick: () => this.setState({ deleteId: '' }),
            }}
            loading={this.state.loading}
          />
        ) : null}
      </div>
    );
  }
}

DashboardPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(withFirebase(DashboardPage));
