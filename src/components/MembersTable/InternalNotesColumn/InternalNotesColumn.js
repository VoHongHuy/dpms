import React, { memo } from 'react';
import PropTypes from 'prop-types';

import IconColumn from '../IconColumn';

import styles from './internalNotesColumn.module.scss';

const InternalNotesColumn = ({ notes }) =>
  (notes ? (
    <IconColumn className={styles.iconColumnWrapper}>
      <span className={styles.tooltip}>{notes}</span>
    </IconColumn>
  ) : (
    '-'
  ));

InternalNotesColumn.propTypes = { notes: PropTypes.string };

InternalNotesColumn.defaultProps = {
  notes: '',
};

export default memo(InternalNotesColumn);
