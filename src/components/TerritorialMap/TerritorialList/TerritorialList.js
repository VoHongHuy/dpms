/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import styles from './territorialList.module.scss';

const TerritorialList = ({ data, isSelected, onRowClick, title }) => {
  const intl = useIntl();

  const handleRowClick = (event, rowData) => {
    event.preventDefault();
    onRowClick(rowData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        {title}
      </div>
      <div className={styles.items}>
        {data.length === 0
          ? (
            <div className={`${styles.item}`}>
              {intl.formatMessage({ id: 'TABLE.EMPTY.TEXT' })}
            </div>
          )
          : data.map(rowData => (
            <div
              key={rowData.id}
              className={`${styles.item} ${isSelected(rowData.name) ? styles.active : ''}`}
            >
              <div className={styles.name}>{rowData.name}</div>
              <div className={styles.controls}>
                <div className={styles.control}>
                  {
                    isSelected(rowData.name) ?
                      intl.formatMessage({ id: 'ORGANIZATION.SELECTED' }) :
                      (
                        <a onClick={(e) => handleRowClick(e, rowData)} href="#">
                          {intl.formatMessage({ id: 'ORGANIZATION.SELECT' })}...
                        </a>
                      )
                  }
                </div>
              </div>
            </div>
          )) }
      </div>
    </div>
  );
};

TerritorialList.defaultProps = {
  data: [],
};

TerritorialList.propTypes = {
  data: PropTypes.array,
  isSelected: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default memo(TerritorialList);
