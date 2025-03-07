/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getIsExporting, exportAllocatedMembers } from '@/redux/ducks/organization.duck';

import { permissionsGuard } from '@/HOCs';
import { PERMISSIONS } from '@/constants/userAccounts';
import styles from './exportToolbar.module.scss';

const exportType = {
  fullExport: 0,
  mainUnitExport: 1,
  subUnitExport: 2,
};

const ExportToolbar = ({
  exportUrl,
  filters,
  showSubUnit,
  showAll,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const isExporting = useSelector(getIsExporting);

  const handleClick = (event, exportType) => {
    event.preventDefault();
    dispatch(exportAllocatedMembers({ url: exportUrl, filters, exportType }));
  };

  return (
    <div className={styles.container}>
      <span>{intl.formatMessage({ id: 'ORGANIZATION.OPERATIONS.EXPORT' })}:</span>
      <a
        href="#"
        className={isExporting ? styles.isDisabled : ''}
        onClick={event => handleClick(event, exportType.mainUnitExport)}
      >
        {intl.formatMessage({ id: 'ORGANIZATION.OPERATIONS.EXPORT.MAIN_UNIT' })}
      </a>
      {showSubUnit && (
        <a
          href="#"
          className={isExporting ? styles.isDisabled : ''}
          onClick={event => handleClick(event, exportType.subUnitExport)}
        >
          {intl.formatMessage({ id: 'ORGANIZATION.OPERATIONS.EXPORT.SUB_UNIT' })}
        </a>
      )}
      {showAll && (
        <a
          href="#"
          className={isExporting ? styles.isDisabled : ''}
          onClick={event => handleClick(event, exportType.fullExport)}
        >
          {intl.formatMessage({ id: 'ORGANIZATION.OPERATIONS.EXPORT.ALL' })}
        </a>
      )}
    </div>
  );
};

ExportToolbar.defaultProps = {
  filters: {},
  showSubUnit: false,
  showAll: false,
};

ExportToolbar.propTypes = {
  exportUrl: PropTypes.string.isRequired,
  filters: PropTypes.object,
  showSubUnit: PropTypes.bool,
  showAll: PropTypes.bool,
};

export default memo(permissionsGuard([PERMISSIONS.VIEW_MEMBERS.value], ExportToolbar, false));
