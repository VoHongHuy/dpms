import Table from '@/components/Table';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import { PERMISSIONS } from '@/constants/userAccounts';
import { hasPermissions } from '@/utils/user';
import MemberDetailsLinkButton from './MemberDetailsLinkButton';

const NotAvailable = 'N/A';

const MembersTable = ({
  data,
  configureColumns,
  openDetailsInNewTab,
  ...restProps
}) => {
  const intl = useIntl();

  let columns = [
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.NAME' }),
      selector: 'name',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.SURNAME' }),
      selector: 'surname',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.SSN' }),
      selector: 'ssn',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.EMAIL' }),
      cell: row => <span>{row.email ?? NotAvailable}.</span>,
      selector: 'email',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.CONTACT_NUMBER' }),
      cell: row => <span>{row.contactNumber ?? NotAvailable}.</span>,
      selector: 'contactNumber',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.ADDRESS' }),
      cell: row => <span>{row.address ?? NotAvailable}.</span>,
      selector: 'address',
      sortable: true,
    },
    {
      name: intl.formatMessage({
        id: 'MEMBERS.LIST_MEMBERS.ELETION_UNIT',
      }),
      cell: row => <span>{row.electionUnit ?? NotAvailable}.</span>,
      selector: 'electionUnit',
      center: true,
    },
    ...(hasPermissions([PERMISSIONS.VIEW_MEMBERS.value])
      ? [
        {
          name: intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.ACTIONS' }),
          button: true,
          cell: row => (
            <MemberDetailsLinkButton
              openDetailsInNewTab={openDetailsInNewTab}
              data={row}
            />
          ),
        },
      ]
      : []),
  ];

  if (configureColumns && isFunction(configureColumns)) {
    columns = configureColumns(columns);
  }

  return (
    <Table
      {...restProps}
      columns={columns}
      data={data}
    />
  );
};

MembersTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  configureColumns: PropTypes.func,
  openDetailsInNewTab: PropTypes.bool,
};

MembersTable.defaultProps = {
  configureColumns: null,
  openDetailsInNewTab: false,
};

export default memo(MembersTable);
