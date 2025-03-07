import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DataTable from 'react-data-table-component';
import { useIntl } from 'react-intl';

import styles from './table.module.scss';

const defaultSettings = {
  pagination: true,
  persistTableHead: true,
  highlightOnHover: true,
  noHeader: true,
  paginationRowsPerPageOptions: [10, 15, 20, 25, 30],
};

const Table = ({ className, ...restProps }) => {
  const intl = useIntl();

  return (
    <DataTable
      {...defaultSettings}
      {...restProps}
      noDataComponent={(
        <span className={styles.empty}>
          {intl.formatMessage({ id: 'TABLE.EMPTY.TEXT' })}
        </span>
      )}
      className={classNames(styles.container, className)}
    />
  );
};
Table.defaultProps = {
  className: '',
};
Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
};

export default memo(Table);
