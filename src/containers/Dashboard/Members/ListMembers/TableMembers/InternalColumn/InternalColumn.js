import React, { memo } from 'react';
import PropTypes from 'prop-types';

import IconColumn from '../IconColumn';

import styles from './internalColumn.module.scss';

const InternalColumn = ({ data }) =>
  (data.internalNote ? (
    <IconColumn className={styles.iconColumnWrapper}>
      <span className={styles.tooltip}>{data.internalNote}</span>
    </IconColumn>
  ) : (
    '-'
  ));

InternalColumn.propTypes = { data: PropTypes.object.isRequired };

export default memo(InternalColumn);
