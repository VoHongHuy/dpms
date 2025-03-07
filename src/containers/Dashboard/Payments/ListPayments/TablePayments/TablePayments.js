import React, { memo, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import Table from '@/components/Table';
import {
  selectPayment,
  deSelectPayment,
  getFilteredPaymentsId,
  getSelectedPaymentsId } from '@/redux/ducks/payments.duck';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';
import { PATHS } from '@/containers/Dashboard/constants';

import styles from './tablePayments.module.scss';

const TablePayments = ({
  data,
  ...restProps
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const checkboxRef = useRef();
  const filteredPaymentsId = useSelector(getFilteredPaymentsId);
  const selectedPaymentsId = useSelector(getSelectedPaymentsId);

  useEffect(() => {
    const isRunning = filteredPaymentsId.length > 0 && selectedPaymentsId.length > 0;
    checkboxRef.current.checked =
      isRunning &&
      filteredPaymentsId.every(item => selectedPaymentsId.includes(item));
    checkboxRef.current.indeterminate =
      !checkboxRef.current.checked &&
      filteredPaymentsId.some(item => selectedPaymentsId.includes(item));
  }, [filteredPaymentsId, selectedPaymentsId, data]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      dispatch(selectPayment(filteredPaymentsId));
    } else {
      dispatch(deSelectPayment(filteredPaymentsId));
    }
  };

  const handleSelect = (event) => {
    if (event.target.checked) {
      dispatch(selectPayment([event.target.value]));
    } else {
      dispatch(deSelectPayment([event.target.value]));
    }
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          name="select-all"
          ref={checkboxRef}
          onChange={handleSelectAll}
        />
      ),
      selector: 'id',
      width: '50px',
      format: (row) => (
        <input
          type="checkbox"
          name={row.id}
          value={row.id}
          checked={selectedPaymentsId.includes(row.id)}
          onChange={handleSelect}
        />
      ),
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.PAID_BY' }),
      selector: 'paidBy',
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.DESCRIPTION' }),
      selector: 'description',
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.RECIPIENT_REFERENCE_NUMBER' }),
      selector: 'recipientReferenceNumber',
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.DATE' }),
      selector: 'paymentDate',
      cell: row => <Moment format="DD.MM.YYYY.">{row.paymentDate}</Moment>,
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.YEAR' }),
      selector: 'year',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.MEMBER' }),
      selector: 'memberName',
      cell: row => (hasPermissions([PERMISSIONS.VIEW_MEMBERS.value]) ?
        (
          <a
            target="_blank"
            href={`${PATHS.MEMBERS_EDIT.replace(':id', row.memberId)}`}
            rel="noopener noreferrer"
          >
            {row.memberName}
          </a>
        ) :
        row.memberName),
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.STATUS' }),
      selector: 'status',
      cell: row => (
        <span className={classNames(styles[row.status])}>
          {`${
            intl.formatMessage({
              id: `PAYMENTS.MODEL.STATUS.${row.status.toUpperCase()}`,
            })
          } (${row.lastStatusUpdatedByUserName})`}
        </span>
      ),
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'PAYMENTS.MODEL.AMOUNT' }),
      selector: 'incomingAmount',
      sortable: true,
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

TablePayments.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default memo(TablePayments);
