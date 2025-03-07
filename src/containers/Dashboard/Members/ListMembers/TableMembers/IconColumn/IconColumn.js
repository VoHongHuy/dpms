import React, { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './iconColumn.module.scss';

const IconColumn = ({ type, className, children, ...rest }) => (
  <span {...rest} className={classNames(styles.container, className)}>
    <i className={classNames(`icon-circle-${type}`, styles[type])} />
    {children}
  </span>
);

IconColumn.defaultProps = {
  type: 'info',
  className: '',
  children: undefined,
};
IconColumn.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'error']),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default memo(IconColumn);
