import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './option.module.scss';

const Option = ({ className, ...restProps }) => (
  <option {...restProps} className={classNames(styles.option, className)} />
);

Option.defaultProps = { className: '' };
Option.propTypes = { className: PropTypes.string };

export default memo(Option);
