import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';

import styles from './styles.module.css';

const TextInput = ({ placeholder, onChange, autoFocus, value, width }) => {
  return (
    <input
      className={styles.input}
      style={{ width }}
      placeholder={placeholder}
      onChange={onChange}
      type="text"
      autoFocus={autoFocus ? 'autofocus' : ''}
      value={value}
    />
  );
};

TextInput.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  value: PropTypes.any,
  width: PropTypes.string,
};

export default TextInput;
