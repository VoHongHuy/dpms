import React, { memo, useState, useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import debounce from 'lodash.debounce';
import {
  getAccounts,
  getTotalAccounts,
  fetchAccounts,
  getFetching,
} from '@/redux/ducks/accounts.duck';
import Button from '@/components/Button';
import PATHS from '@/containers/Dashboard/constants/paths';
import history from '@/history';
import { filterDataByObject } from '@/utils';

import Filters from './Filters';
import TableAccounts from './TableAccounts';
import styles from './listAccounts.module.scss';

const ListAccounts = () => {
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, rowPerPage: 10 });
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch();
  const data = useSelector(getAccounts, shallowEqual);
  const totalRecords = useSelector(getTotalAccounts);
  const loading = useSelector(getFetching);
  const filteredData = useMemo(() => filterDataByObject(data, filters), [
    data,
    filters,
  ]);

  useEffect(() => {
    dispatch(fetchAccounts({ ...pagination, filters }));
  }, [pagination, filters]);

  const handleFilterChange = debounce(filterValues => {
    setResetPaginationToggle(!resetPaginationToggle);
    setFilters(!filterValues ? {} : { ...filters, ...filterValues });
  }, 500);

  const handlePageChange = page => {
    setPagination({ ...pagination, page });
  };

  const handleRowPerPageChange = rowPerPage => {
    setPagination({ ...pagination, rowPerPage });
  };

  return (
    <div className={styles.container}>
      <Button
        tag="a"
        href={PATHS.USER_ACCOUNTS_ADD}
        onClick={e => {
          e.preventDefault();
          history.push(PATHS.USER_ACCOUNTS_ADD);
        }}
        className={styles.addButton}
      >
        {intl.formatMessage({
          id: 'USER_ACCOUNT.LIST_ACCOUNTS.BUTTON.ADD_ACCOUNT',
        })}
        <i className="icon-plus" />
      </Button>
      <Filters onChange={handleFilterChange} />
      <TableAccounts
        data={filteredData}
        paginationServer
        paginationResetDefaultPage={resetPaginationToggle}
        progressPending={loading}
        paginationTotalRows={totalRecords}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowPerPageChange}
      />
    </div>
  );
};

export default memo(ListAccounts);
