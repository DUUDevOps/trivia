import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.css';
import { withFirebase } from '../../../components/Firebase/firebase';
import TextInput from '../../../components/TextInput';
import Loader from '../../../components/Loader';
import PopUp from '../../../components/PopUp';

class EditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quiz: {},
      redirect: false,
      round: 'round1',
      saving: false,
      editTitle: false,
    };

    this.id = props.match.params.id;
    this.firebase = props.firebase;

    this.setValue = this.setValue.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.save = this.save.bind(this);
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

  setValue(e, type, index) {
    const quiz = JSON.parse(JSON.stringify(this.state.quiz));
    const round = quiz[this.state.round];
    if (type === 'q') {
      round[index].q = e.target.value;
    } else {
      round[index].a = e.target.value;
    }
    this.setState({ quiz });
  }

  setTitle(e) {
    const quiz = JSON.parse(JSON.stringify(this.state.quiz));
    quiz.name = e.target.value;
    this.setState({ quiz });
  }

  save(next) {
    this.setState({ saving: true });
    // our callback is actually to call the function here that will
    // call this functions callback/next function
    this.firebase.saveQuiz(this.id, this.state.quiz, () => next());
  }

  render() {
    if (!this.id || this.state.redirect) {
      return <Redirect to="/admin/dashboard" />
    }

    return this.state.quiz.name !== undefined ? (
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            {this.state.quiz.name}
          </div>

          {this.state.saving ? (
            <div className={styles.buttonContainer}>
              <Loader margin="auto" />
            </div>
          ) : (
            <div className={styles.buttonContainer}>
              <div
                className={styles.button}
                role="button"
                tabIndex={0}
                onClick={() => this.setState({ editTitle: true })}
              >
                <i className={classNames('fas fa-pencil-alt', styles.buttonIcon)} />
                <div className={styles.buttonText}>
                  edit title
                </div>
              </div>

              <div
                className={styles.button}
                role="button"
                tabIndex={0}
                onClick={() => this.save(() => this.setState({ saving: false }))}
              >
                <i className={classNames('fas fa-save', styles.buttonIcon)} />
                <div className={styles.buttonText}>
                  save
                </div>
              </div>

              <div
                className={styles.button}
                role="button"
                tabIndex={0}
                onClick={() => this.save(() => this.props.history.push('/admin/dashboard'))}
                style={{ marginRight: 0 }}
              >
                <i className={classNames('fas fa-running', styles.buttonIcon)} />
                <div className={styles.buttonText}>
                  {'save & exit'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.roundContainer}>
          <div
            className={classNames(styles.round, { [styles.selected]: this.state.round === 'round1' })}
            role="button"
            tabIndex={0}
            onClick={() => this.setState({ round: 'round1' })}
          >
            round 1
          </div>
          <div
            className={classNames(styles.round, { [styles.selected]: this.state.round === 'round2' })}
            role="button"
            tabIndex={0}
            onClick={() => this.setState({ round: 'round2' })}
          >
            round 2
          </div>
          <div
            className={classNames(styles.round, { [styles.selected]: this.state.round === 'round3' })}
            role="button"
            tabIndex={0}
            onClick={() => this.setState({ round: 'round3' })}
          >
            round 3
          </div>
        </div>

        {this.state.quiz[this.state.round].map((data, index) => (
          <div className={styles.questionContainer} key={index}>
            {index === 10 ? (
              <i className={classNames('fas fa-star', styles.questionNum)} />
            ) : (
              <div className={styles.questionNum}>
                {index + 1}
              </div>
            )}

            <div className={styles.inputsContainer}>
              <div className={styles.inputContainer}>
                <div className={styles.inputText}>
                  q:
                </div>
                <TextInput
                  placeholder="question"
                  value={this.state.quiz[this.state.round][index].q}
                  onChange={(e) => this.setValue(e, 'q', index)}
                  width="100%"
                />
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.inputText}>
                  a:
                </div>
                <TextInput
                  placeholder="answer"
                  value={this.state.quiz[this.state.round][index].a}
                  onChange={(e) => this.setValue(e, 'a', index)}
                  width="100%"
                />
              </div>
            </div>
          </div>
        ))}

        {this.state.editTitle ? (
          <PopUp
            text="fine, change the title..."
            buttonOne={{
              text: 'cool',
              onClick: () => this.save(() => this.setState({ saving: false, editTitle: false })),
            }}
            loading={this.state.saving}
            inputValue={this.state.quiz.name}
            inputChange={this.setTitle}
            inputPlaceholder="title"
          />
        ) : null}
      </div>
    ) : null;
  }
}

EditPage.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withFirebase(EditPage));
