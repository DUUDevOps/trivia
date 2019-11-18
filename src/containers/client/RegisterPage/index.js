import React from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.css';
import TextInput from '../../../components/TextInput';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: '',
      ids: [''],
    };

    this.changeId = this.changeId.bind(this);
  }
  
  changeId(e, index) {
    const ids = [...this.state.ids];
    ids[index] = e.target.value;
    this.setState({ ids });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          register your team
        </div>

        <div className={styles.section}>
          <div className={styles.subheader}>
            team name
          </div>
          <div className={styles.inputContainer}>
            <TextInput
              value={this.state.team}
              autoFocus={!isMobile}
              onChange={(e) => this.setState({ team: e.target.value.slice(0, 35) })}
              width="80%"
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.subheader}>
            player netIDs
          </div>
          <div className={styles.inputContainer}>
            {this.state.ids.map((id, index) => (
              <div className={styles.idRow} key={index}>
                <TextInput
                  value={id}
                  onChange={(e) => this.changeId(e, index)}
                  width={isMobile ? '20vw' : '9vw'}
                />

                {index + 1 === this.state.ids.length ? (
                  <div
                    className={classNames(styles.plus, 'fas fa-plus')}
                    role="button"
                    tabIndex={0}
                    onClick={() => this.setState({ ids: [...this.state.ids, ''] })}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.next}>
          <Link className={styles.button} to="/play/register/answer">
              next
          </Link>
          <i className={classNames('fas fa-arrow-right', styles.arrow)} />
        </div>
      </div>
    );
  }
}

export default RegisterPage;
