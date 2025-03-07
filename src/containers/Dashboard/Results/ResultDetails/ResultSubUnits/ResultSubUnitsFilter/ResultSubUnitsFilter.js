import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Input } from '@/components/Form';

import styles from './resultSubUnitsFilter.module.scss';

const ResultSubUnitsFilter = ({ onChange }) => {
  const intl = useIntl();
  const [filters, setFilters] = useState({});

  const handleInputChange = ({ target: { name, value } }) => {
    setFilters({ ...filters, [name]: value });
    onChange({ [name]: value });
  };

  return (
    <form className={styles.container} autoComplete="off">
      <Input
        type="text"
        name="name"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.SUB_UNIT.FILTERS.NAME' })}
        autoComplete="off"
        onChange={handleInputChange}
        value={filters.name}
      />
    </form>
  );
};

ResultSubUnitsFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default memo(ResultSubUnitsFilter);
