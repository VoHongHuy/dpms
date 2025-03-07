import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { isEmpty, debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getFormValues } from 'redux-form';
import {
  fetchFilteredPayments,
  fetchPayments,
  getFetching,
  getFilteredPayments,
  getPayments,
  getSelectedPaymentsId,
  getSortOrder,
  getTotalPayments,
  setSortOrder,
} from '@/redux/ducks/payments.duck';
import Loading from '@/components/Loading';
import { PAYMENT_FILTER_FORM } from '@/constants/forms';
import ActionButtons from './ActionButtons';
import Filters from './Filters';
import TablePayments from './TablePayments';
import styles from './listPayments.module.scss';
import Summary from './Summary';
import Tools from './Tools';

const DEBOUNCE_MS = 500;

const ListPayments = () => {
  const [filters, setFilters] = useState({});
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, rowPerPage: 10 });
  const isFetching = useSelector(getFetching);
  const data = useSelector(getPayments);
  const totalRecords = useSelector(getTotalPayments);
  const sortOrder = useSelector(getSortOrder);
  const filteredPayments = useSelector(getFilteredPayments);
  const selectedPaymentsId = useSelector(getSelectedPaymentsId);
  const paymentFilterFormValues = useSelector(getFormValues(PAYMENT_FILTER_FORM));
  const dispatch = useDispatch();

  const summaryData = useMemo(() => filteredPayments.reduce((result, item) => {
    const status = item.status.toLowerCase();
    return {
      ...result,
      [status]: result[status] + item.incomingAmount,
      total: result.total + item.incomingAmount,
    };
  }, {
    total: 0,
    received: 0,
    refunded: 0,
    removed: 0,
  }), [filteredPayments]);

  const handlePageChange = page => {
    setPagination({ ...pagination, page });
  };

  const handleRowPerPageChange = rowPerPage => {
    setPagination({ ...pagination, rowPerPage });
  };

  const handleSort = (column, sortDirection) => {
    const newSortOrder = { column: column.selector, sortDirection };
    dispatch(setSortOrder(newSortOrder));
  };

  const handleFilterChange = () => {
    setResetPaginationToggle(!resetPaginationToggle);
    setFilters(
      isEmpty(paymentFilterFormValues) ?
        {} :
        {
          ...paymentFilterFormValues,
        },
    );
  };

  const debouncedFetchPayments = useCallback(debounce((pagination, filters, sortOrder) => {
    dispatch(fetchPayments({ ...pagination, filters, sortOrder }));
  }, DEBOUNCE_MS), []);

  const debouncedFetchFilteredPayments = useCallback(debounce((filters) => {
    dispatch(fetchFilteredPayments({ filters }));
  }, DEBOUNCE_MS), []);

  useEffect(() => {
    debouncedFetchPayments(pagination, filters, sortOrder);
  }, [pagination, filters, sortOrder]);

  useEffect(() => {
    debouncedFetchFilteredPayments(filters);
  }, [filters]);

  useEffect(() => {
    handleFilterChange();
  }, [paymentFilterFormValues]);

  const handleStatusChanged = () => {
    debouncedFetchPayments(pagination, filters, sortOrder);
    debouncedFetchFilteredPayments(filters);
  };

  return (
    <div className={styles.container}>
      <ActionButtons />
      <Filters />
      {isFetching ? (
        <div className={styles.center}><Loading /></div>
      ) : (
        <>
          <TablePayments
            data={data}
            paginationServer
            paginationResetDefaultPage={resetPaginationToggle}
            progressPending={isFetching}
            paginationTotalRows={totalRecords}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowPerPageChange}
            defaultSortField={sortOrder.column}
            defaultSortAsc={sortOrder.sortDirection === 'asc'}
            sortServer
            onSort={handleSort}
          />
          <Summary data={summaryData} />
          {selectedPaymentsId.length > 0 && <Tools onStatusChanged={handleStatusChanged} />}
        </>
      )}
    </div>
  );
};

export default memo(ListPayments);
