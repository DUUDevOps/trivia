import React from 'react';

import styles from './styles.module.css';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={styles.header}>
        Howdy, Partner!
      </div>
    );
  }
}

export default HomePage;
