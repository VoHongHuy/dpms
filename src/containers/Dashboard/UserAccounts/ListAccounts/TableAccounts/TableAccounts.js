import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import Table from '@/components/Table';

import RoleColumn from './RoleColumn';
import StatusColumn from './StatusColumn';
import ActionsColumn from './ActionsColumn';

const TableAccounts = ({ data, ...restProps }) => {
  const intl = useIntl();
  const columns = useMemo(
    () => [
      {
        name: intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.EMAIL' }),
        selector: 'email',
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.ROLE' }),
        selector: 'role',
        cell: row => <RoleColumn role={row.role} />,
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.NAME' }),
        selector: 'name',
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.SURNAME' }),
        selector: 'surname',
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.STATUS' }),
        selector: 'status',
        cell: row => <StatusColumn status={row.status} />,
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: 'USER_ACCOUNT.LIST_ACCOUNTS.ACTIONS' }),
        cell: row => <ActionsColumn data={row} />,
      },
    ],
    [],
  );

  return (
    <Table {...restProps} columns={columns} data={data} />
  );
};

TableAccounts.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default memo(TableAccounts);
