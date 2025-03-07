import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@/components/Button';

import styles from './sectionHeader.module.scss';

const SectionHeader = ({ title, className, actions }) => (
  <div className={classNames(styles.container, className)}>
    {title}
    {actions ? (
      <div className={styles.actions}>
        {actions.closeButtonProps ? (
          <Button
            {...actions.closeButtonProps}
            color="secondary"
            className={styles.actionBtn}
          />
        ) : null}
        {actions.submitButtonProps ? (
          <Button
            {...actions.submitButtonProps}
            className={styles.actionBtn}
          />
        ) : null}
      </div>
    ) : null}
  </div>
);

SectionHeader.defaultProps = { className: '', actions: undefined };
SectionHeader.propTypes = {
  title: PropTypes.node.isRequired,
  className: PropTypes.string,
  actions: PropTypes.shape({
    closeButtonProps: PropTypes.object,
    submitButtonProps: PropTypes.object,
  }),
};

export default memo(SectionHeader);
