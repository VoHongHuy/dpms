import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { useIntl } from 'react-intl';
import Table from '@/components/Table';
import sanitizeHtml from 'sanitize-html';
import TooltipLink from '@/components/TooltipLink';
import MailStatusCounter from '../MailStatusCounter/MailStatusCounter';

import styles from './tableBulkEmails.module.scss';

const borderColor = '#e0e0e0';

const TableBulkEmails = ({
  data,
  ...restProps
}) => {
  const intl = useIntl();

  const columns = [
    {
      name: intl.formatMessage({ id: 'BULK_EMAIL.MODEL.SUBJECT' }),
      selector: 'subject',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'BULK_EMAIL.MODEL.SENDER' }),
      selector: 'sender',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'BULK_EMAIL.MODEL.RECIPIENT_NUMBER' }),
      sortable: false,
      cell: row => (
        <>
          <span className={styles.repicient_number}>{row.members?.length}</span>
          <MailStatusCounter messageId={row.messageId} />
        </>
      ),
    },
    {
      name: intl.formatMessage({ id: 'BULK_EMAIL.MODEL.SENT_BY' }),
      selector: 'sendBy',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'BULK_EMAIL.MODEL.DATE' }),
      selector: 'sendDate',
      sortable: true,
      cell: row => <Moment format="DD.MM.YYYY. HH:mm">{row.sendDate}</Moment>,
    },
    {
      name: intl.formatMessage({ id: 'BULK_EMAIL.MODEL.CONTENT' }),
      selector: 'content',
      sortable: true,
      cell: row => (
        <TooltipLink
          tooltipClassName={styles.contentTooltip}
          className={styles.content}
          type="light"
          place="top"
          border
          borderColor={borderColor}
          tooltip={(
          // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{
              __html: sanitizeHtml(row.content),
            }}
            />
          )}
        >
          <i className="fa fa-exclamation-circle" aria-hidden="true" />
        </TooltipLink>
      ),
    },
  ];

  return (
    <Table
      {...restProps}
      columns={columns}
      data={data}
    />
  );
};

TableBulkEmails.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default memo(TableBulkEmails);
