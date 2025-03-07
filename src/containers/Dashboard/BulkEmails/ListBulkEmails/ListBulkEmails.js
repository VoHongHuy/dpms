import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, isEmpty } from 'lodash';
import { fetchBulkMails,
  getBulkMails,
  getFetching,
  getTotalBulkMails,
  getSortOrder,
  setSortOrder,
  fetchTotalMailSent } from '@/redux/ducks/bulkMails.duck';
import { getFormValues } from 'redux-form';
import { BULK_EMAIL_FILTER_FORM } from '@/constants/forms';
import Filters from './Filters';
import StatusText from './StatusText';
import TableBulkEmails from './TableBulkEmails';

import styles from './listBulkEmails.module.scss';

const DEBOUNCE_MS = 500;

const ListBulkEmails = () => {
  const [filters, setFilters] = useState({});
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, rowPerPage: 10 });
  const isFetching = useSelector(getFetching);
  const data = useSelector(getBulkMails);
  const totalRecords = useSelector(getTotalBulkMails);
  const sortOrder = useSelector(getSortOrder);
  const bulkMailFilterFormValues = useSelector(getFormValues(BULK_EMAIL_FILTER_FORM));

  const dispatch = useDispatch();

  useEffect(() => { dispatch(fetchTotalMailSent()); }, []);

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
      isEmpty(bulkMailFilterFormValues) ?
        {} :
        {
          ...bulkMailFilterFormValues,
          sendDate: bulkMailFilterFormValues.sendDate?.toISOString(),
        },
    );
  };

  const debouncedFetchBulkMails = useCallback(debounce((pagination, filters, sortOrder) => {
    dispatch(fetchBulkMails({ ...pagination, filters, sortOrder }));
  }, DEBOUNCE_MS), []);

  useEffect(() => {
    debouncedFetchBulkMails(pagination, filters, sortOrder);
  }, [pagination, filters, sortOrder]);

  useEffect(() => {
    handleFilterChange();
  }, [bulkMailFilterFormValues]);

  return (
    <div className={styles.container}>
      <StatusText />
      <Filters />
      <TableBulkEmails
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
    </div>
  );
};

export default memo(ListBulkEmails);
