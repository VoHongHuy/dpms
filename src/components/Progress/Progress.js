import React, { memo } from 'react';
import PropTypes from 'prop-types';

import styles from './progress.module.scss';

const Progress = ({ percent, children, primary }) => (
  <div className={`${styles.container} ${primary ? styles.primary : ''}`}>
    <div
      style={{ width: `${percent}%` }}
      className={styles.progress}
    />
    <div className={styles.text}>
      {children}
    </div>
  </div>
);

Progress.defaultProps = {
  primary: false,
};

Progress.propTypes = {
  percent: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  primary: PropTypes.bool,
};

export default memo(Progress);
