import React, { memo } from 'react';
import classNames from 'classnames';
import styles from './closeButton.module.scss';

const CloseButton = props => (
  <span {...props} className={styles.container}>
    <i className={classNames('icon-esc-fat', styles.icon)} />
  </span>
);

export default memo(CloseButton);
