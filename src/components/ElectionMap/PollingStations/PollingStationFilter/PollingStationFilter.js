import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Input } from '@/components/Form';

import styles from './pollingStationFilter.module.scss';

const PollingStationFilter = ({ onChange }) => {
  const intl = useIntl();
  const [filters, setFilters] = useState({});

  const handleInputChange = ({ target: { name, value } }) => {
    setFilters({ ...filters, [name]: value });
    onChange({ [name]: value });
  };

  return (
    <form className={styles.container}>
      <Input
        type="text"
        name="name"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'ORGANIZATION.POLLING_STATION_NAME' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.name}
      />
    </form>
  );
};

PollingStationFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default memo(PollingStationFilter);
