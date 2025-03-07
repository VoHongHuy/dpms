import React, { memo, useMemo } from 'react';
import Table from '@/components/Table';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'AppConfigs';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';
import PaymentYearColumn from './PaymentYearColumn';
import PaymentTransactionStatusColumn from './PaymentTransactionStatusColumn';
import PaymentActionColumn from './PaymentActionColumn';

const PaymentHistory = ({
  data,
  onPaymentYearSubmit,
  onStatusClick,
}) => {
  const intl = useIntl();

  const columns = useMemo(() => [
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.PAID_BY' }),
      selector: 'paidBy',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.DESCRIPTION' }),
      selector: 'description',
      sortable: true,
    },
    {
      name: intl.formatMessage({
        id: 'PAYMENTS.MODEL.RECIPIENT_REFERENCE_NUMBER',
      }),
      selector: 'recipientReferenceNumber',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.DATE' }),
      selector: 'paymentDate',
      cell: row => <span>{moment(row.paymentDate).format(DATE_TIME_FORMAT)}</span>,
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.YEAR' }),
      selector: 'year',
      cell: row => (
        <PaymentYearColumn onSubmit={onPaymentYearSubmit} payment={row} />
      ),
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.AMOUNT' }),
      selector: 'incomingAmount',
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.STATUS' }),
      selector: 'status',
      cell: row => <PaymentTransactionStatusColumn data={row} />,
    },
    ...(hasPermissions([PERMISSIONS.UPDATE_PAYMENT.value])
      ? [
        {
          name: intl.formatMessage({ id: 'PAYMENTS.LIST_PAYMENTS.ACTIONS' }),
          cell: row => (
            <PaymentActionColumn
              data={row}
              onStatusClick={onStatusClick}
            />
          ),
        },
      ]
      : []),
  ], [data]);

  return <Table data={data} columns={columns} />;
};

PaymentHistory.defaultProps = {
  data: [],
};

PaymentHistory.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  onPaymentYearSubmit: PropTypes.func.isRequired,
  onStatusClick: PropTypes.func.isRequired,
};

export default memo(PaymentHistory);
