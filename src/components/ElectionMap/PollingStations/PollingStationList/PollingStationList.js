/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import Loading from '@/components/Loading';

import styles from './pollingStationList.module.scss';

const PollingStationList = ({ data, isFetching, onPollingStationClick }) => {
  const {
    pollingStation,
  } = useParams();

  const intl = useIntl();

  const handlePollingStationClick = (event, pollingStation) => {
    event.preventDefault();
    onPollingStationClick(pollingStation);
  };

  const renderTableData = () => {
    if (data.length === 0) {
      return (
        <tr>
          <td>
            {intl.formatMessage({ id: 'TABLE.EMPTY.TEXT' })}
          </td>
        </tr>
      );
    }
    return (
      data.map(row => (
        <tr key={row.id}>
          <td title={row.number}>{row.number}</td>
          <td title={row.name}>{row.name}</td>
          <td title={row.location}>{row.location}</td>
          <td title={row.address}>{row.address}</td>
          <td>
            {
              Number(pollingStation) === row.id ?
                (
                  <div className={styles.active}>
                    {intl.formatMessage({ id: 'ORGANIZATION.SELECTED' })}
                  </div>
                ) : (
                  <a
                    href="#"
                    className={styles.textBlue}
                    onClick={(e) => handlePollingStationClick(e, row)}
                  >
                    {intl.formatMessage({ id: 'ORGANIZATION.SELECT' })}...
                  </a>
                )
            }
          </td>
        </tr>
      ))
    );
  };

  return (
    <div className={styles.container}>
      <table className={styles.pollingStationTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>{intl.formatMessage({ id: 'ORGANIZATION.PARLIAMENTARY_TABLE.NAME' })}</th>
            <th>{intl.formatMessage({ id: 'ORGANIZATION.PARLIAMENTARY_TABLE.LOCATION' })}</th>
            <th>{intl.formatMessage({ id: 'ORGANIZATION.PARLIAMENTARY_TABLE.ADDRESS' })}</th>
            <th>{' '}</th>
          </tr>
        </thead>
        <tbody>
          {
            isFetching ? (
              <tr>
                <td colSpan="5" className={styles.center}><Loading /></td>
              </tr>
            ) : renderTableData()
          }
        </tbody>
      </table>
    </div>
  );
};

PollingStationList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetching: PropTypes.bool.isRequired,
  onPollingStationClick: PropTypes.func.isRequired,
};

export default memo(PollingStationList);
