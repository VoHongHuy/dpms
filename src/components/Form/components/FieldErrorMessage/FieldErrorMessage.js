import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import styles from './fieldErrorMessage.module.scss';

const FieldErrorMessage = ({ message, className }) => {
  const intl = useIntl();

  return message ? (
    <span className={classNames(styles.errorMessage, className)}>
      {intl.formatMessage({ id: message })}
    </span>
  ) : null;
};

FieldErrorMessage.defaultProps = { message: undefined, className: '' };
FieldErrorMessage.propTypes = {
  message: PropTypes.node,
  className: PropTypes.string,
};

export default memo(FieldErrorMessage);
