import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'AppConfigs';
import Table from '@/components/Table';

import ActionsColumn from './ActionsColumn';

const TableDocuments = ({ data, downloadButtonProps, deleteButtonProps }) => {
  const intl = useIntl();
  const columns = useMemo(
    () => [
      {
        name: intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.NAME',
        }),
        selector: 'name',
        sortable: true,
        grow: 1,
      },
      {
        name: intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.TIME_ADDED',
        }),
        selector: 'createdTime',
        cell: row => moment(row.createdTime).format(DATE_TIME_FORMAT),
        sortable: true,
        grow: 1,
      },
      {
        name: intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.ADDED_BY',
        }),
        selector: 'addedBy',
        sortable: true,
        grow: 2,
      },
      {
        name: intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.ACTIONS' }),
        cell: row => (
          <ActionsColumn
            data={row}
            downloadButtonProps={downloadButtonProps}
            deleteButtonProps={deleteButtonProps}
          />
        ),
        grow: 1,
      },
    ],
    [downloadButtonProps, deleteButtonProps],
  );

  return <Table columns={columns} data={data} />;
};

TableDocuments.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  downloadButtonProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
    loading: PropTypes.bool,
  }).isRequired,
  deleteButtonProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
    loading: PropTypes.bool,
  }).isRequired,
};

export default memo(TableDocuments);
