/* eslint-disable react/jsx-no-target-blank */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import history from '@/history';
import { PATHS } from '@/containers/Dashboard/constants';

import styles from './memberDetailsLinkButton.module.scss';

const MemberDetailsLinkButton = ({ data, openDetailsInNewTab }) => {
  const intl = useIntl();

  const handleClick = e => {
    if (!openDetailsInNewTab) {
      e.preventDefault();
      history.push(PATHS.MEMBERS_EDIT.replace(':id', data.id));
    }
  };

  return (
    <a
      target="_blank"
      href={PATHS.MEMBERS_EDIT.replace(':id', data.id)}
      className={classNames(styles.action)}
      onClick={handleClick}
    >
      {intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.ACTIONS.DETAILS' })}
    </a>
  );
};

MemberDetailsLinkButton.defaultProps = {
  openDetailsInNewTab: false,
};

MemberDetailsLinkButton.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  openDetailsInNewTab: PropTypes.bool,
};

export default memo(MemberDetailsLinkButton);
