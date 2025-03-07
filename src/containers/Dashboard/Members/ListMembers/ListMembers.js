import React, { memo, useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { isEmpty, debounce } from 'lodash';
import { getFormValues } from 'redux-form';
import {
  getMembers,
  getTotalMembers,
  fetchMembers,
  getFetching,
  fetchFilteredMembers,
  getSelectedMembers,
  getSortOrder,
  setSortOrder,
} from '@/redux/ducks/members.duck';
import Button from '@/components/Button';
import PATHS from '@/containers/Dashboard/constants/paths';
import history from '@/history';
import { permissionsGuard } from '@/HOCs';
import { PERMISSIONS } from '@/constants/userAccounts';
import { MEMBER_FILTER_FORM } from '@/constants/forms';
import {
  fetchMembershipSettings,
  getMembershipSettings,
} from '@/redux/ducks/payments.duck';
import TableMembers from './TableMembers';
import styles from './listMembers.module.scss';
import Toolbox from '../ToolBox';
import Filters from './Filters';

const DEBOUNCE_MS = 500;

const ListMembers = () => {
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, rowPerPage: 10 });
  const sortOrder = useSelector(getSortOrder);
  const memberFilterFormValues = useSelector(getFormValues(MEMBER_FILTER_FORM));
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch();
  const data = useSelector(getMembers, shallowEqual);
  const selectedMembers = useSelector(getSelectedMembers);
  const totalRecords = useSelector(getTotalMembers);
  const loading = useSelector(getFetching);
  const membershipSettings = useSelector(getMembershipSettings);

  useEffect(() => {
    dispatch(fetchMembershipSettings());
  }, []);

  const handleFilterChange = () => {
    setResetPaginationToggle(!resetPaginationToggle);
    setFilters(
      isEmpty(memberFilterFormValues) ?
        {} :
        {
          ...memberFilterFormValues,
          invited: memberFilterFormValues.invited === undefined ?
            undefined :
            memberFilterFormValues.invited === 'true',
          joinedDateFrom: memberFilterFormValues.joinedDateFrom?.toISOString(),
          joinedDateTo: memberFilterFormValues.joinedDateTo?.toISOString(),
        },
    );
  };

  const debouncedFetchMembers = useCallback(debounce((pagination, filters, sortOrder) => {
    dispatch(fetchMembers({ ...pagination, filters, sortOrder }));
  }, DEBOUNCE_MS), []);

  const debouncedFetchFilteredMembers = useCallback(debounce((filters) => {
    dispatch(fetchFilteredMembers({ filters }));
  }, DEBOUNCE_MS), []);

  useEffect(() => {
    debouncedFetchMembers(pagination, filters, sortOrder);
  }, [pagination, filters, sortOrder]);

  useEffect(() => {
    debouncedFetchFilteredMembers(filters);
  }, [filters]);

  useEffect(() => {
    handleFilterChange();
  }, [memberFilterFormValues]);

  const AddMemberButton = permissionsGuard(
    [PERMISSIONS.CREATE_MEMBER.value],
    () => (
      <Button
        tag="a"
        href={PATHS.MEMBERS_ADD}
        onClick={e => {
          e.preventDefault();
          history.push(PATHS.MEMBERS_ADD);
        }}
        className={styles.addButton}
      >
        {intl.formatMessage({
          id: 'MEMBERS.LIST_MEMBERS.BUTTON.ADD_MEMBER',
        })}
        <i className="icon-plus" />
      </Button>
    ),
    false,
  );

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

  return (
    <div className={styles.container}>
      {AddMemberButton ? <AddMemberButton /> : null}
      <Filters />
      <TableMembers
        data={data}
        paginationServer
        paginationResetDefaultPage={resetPaginationToggle}
        progressPending={loading}
        paginationTotalRows={totalRecords}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowPerPageChange}
        defaultSortField={sortOrder.column}
        defaultSortAsc={sortOrder.sortDirection === 'asc'}
        sortServer
        onSort={handleSort}
        membershipSettings={membershipSettings}
      />
      {selectedMembers.length > 0 && <Toolbox />}
    </div>
  );
};

export default memo(ListMembers);
