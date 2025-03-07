import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './fieldContainer.module.scss';

const FieldContainer = ({ children, className }) => (
  <div className={classNames(styles.container, className)}>{children}</div>
);

FieldContainer.defaultProps = { className: '' };
FieldContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default memo(FieldContainer);
