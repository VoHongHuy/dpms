import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import loadingSrc from '@/assets/images/loading.gif';

import styles from './loading.module.scss';

const Loading = ({ className }) => (
  <div className={classNames(styles.container, className)}>
    <img src={loadingSrc} alt="loading" className={styles.loader} />
  </div>
);

Loading.defaultProps = { className: '' };
Loading.propTypes = { className: PropTypes.string };

export default memo(Loading);
