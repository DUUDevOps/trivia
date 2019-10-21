import React from 'react';
import { Link } from 'react-router-dom';

import DukeNiteLogo from '../../assets/DukeNiteLogo.png';
import styles from './styles.module.css';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={styles.container}>
        <img src={DukeNiteLogo} alt="Duke@Nite Logo" className={styles.logo} draggable={false} />
        <div className={styles.textContainer}>
          <div className={styles.header}>
            trivia night
          </div>

          <div className={styles.buttonContainer}>
            <Link className={styles.button} to="/play/register">
              play
            </Link>
            <Link className={styles.button} to="/admin/login">
              login
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
