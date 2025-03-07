import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './uploadButton.module.scss';

const UploadButton = ({ onChange, children, disabled }) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label className={classNames(styles.container, disabled && styles.disabled)}>
    <input
      type="file"
      onChange={onChange}
      className={styles.input}
      // eslint-disable-next-line max-len
      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      disabled={disabled}
    />
    {children}
  </label>
);

UploadButton.defaultProps = {
  disabled: false,
};
UploadButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

export default memo(UploadButton);
