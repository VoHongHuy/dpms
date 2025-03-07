import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  fetchStatusMailSent,
  getStatusMailSent } from '@/redux/ducks/bulkMails.duck';
import TooltipLink from '@/components/TooltipLink';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';
import styles from './mailStatusCounter.module.scss';
import MailStatusList from './MailStatusList';

const MailStatusCounter = ({ messageId }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const statusMailSentData = useSelector(getStatusMailSent);
  const messageIds = useMemo(() => messageId.split('|'), [messageId]);

  const onHoverMailDelivered = () => {
    if (hasPermissions([PERMISSIONS.VIEW_MEMBERS.value]) &&
      (!statusMailSentData.delivered[messageId] ||
      (!statusMailSentData.delivered[messageId].fetching &&
      !statusMailSentData.delivered[messageId].items))) {
      dispatch(fetchStatusMailSent({ status: 'delivered', messageIds }));
    }
  };

  const onHoverMailFailed = () => {
    if (hasPermissions([PERMISSIONS.VIEW_MEMBERS.value]) &&
      (!statusMailSentData.not_delivered[messageId] ||
      (!statusMailSentData.not_delivered[messageId].fetching &&
      !statusMailSentData.not_delivered[messageId].items))) {
      dispatch(fetchStatusMailSent({ status: 'not_delivered', messageIds }));
    }
  };

  return (
    <>
      (
      <TooltipLink
        onHover={onHoverMailDelivered}
        tooltipClassName={styles.contentTooltip}
        className={styles.content}
        type="light"
        place="right"
        border
        borderColor="#e0e0e0"
        tooltip={(
          (statusMailSentData.delivered[messageId] &&
          statusMailSentData.delivered[messageId].items)
            ? <MailStatusList data={statusMailSentData.delivered[messageId]} status="delivered" />
            : <div>{intl.formatMessage({ id: 'BULK_EMAIL.MAIL_ACTIVITY.LOADING' })}</div>
        )}
      >
        <span className={styles.mail_delivered}>Delivered</span>
      </TooltipLink>
        &nbsp;/&nbsp;
      <TooltipLink
        onHover={onHoverMailFailed}
        tooltipClassName={styles.contentTooltip}
        className={styles.content}
        type="light"
        place="right"
        border
        borderColor="#e0e0e0"
        tooltip={(
          (statusMailSentData.not_delivered[messageId] &&
          statusMailSentData.not_delivered[messageId].items)
            ? (
              <MailStatusList
                data={statusMailSentData.not_delivered[messageId]}
                status="not_delivered"
              />
            )
            : <div>{intl.formatMessage({ id: 'BULK_EMAIL.MAIL_ACTIVITY.LOADING' })}</div>
        )}
      >
        <span className={styles.mail_failed}>Failed</span>
      </TooltipLink>
      )
    </>
  );
};

MailStatusCounter.propTypes = {
  messageId: PropTypes.string.isRequired,
};

export default memo(MailStatusCounter);
