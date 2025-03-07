import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './formSection.module.scss';

const FormSection = ({ label, className, children }) => (
  <div className={classNames(styles.container, className)}>
    <p className={styles.title}>{label}</p>
    {children}
  </div>
);

FormSection.defaultProps = { className: '' };
FormSection.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default memo(FormSection);
