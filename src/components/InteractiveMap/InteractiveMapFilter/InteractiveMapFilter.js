import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@/components/Form';

import styles from './interactiveMapFilter.module.scss';

const InteractiveMapFilter = ({ onChange }) => {
  const [filters, setFilters] = useState({});

  const handleInputChange = ({ target: { name, value } }) => {
    setFilters({ ...filters, [name]: value });
    onChange({ [name]: value });
  };

  return (
    <form className={styles.container}>
      <Input
        type="text"
        name="search"
        className={styles.input}
        placeholder="Search"
        autoComplete="off"
        onChange={handleInputChange}
        value={filters.search}
      />
    </form>
  );
};

InteractiveMapFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default memo(InteractiveMapFilter);
