import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PATHS } from '@/containers/Dashboard/constants';

import styles from './territorialOrganizationTooltip.module.scss';

const TerritorialOrganizationTooltip = ({ data }) => {
  const generateText = (allocation) => {
    const text = [
      allocation.allocatedCountry,
      allocation.allocatedCounty,
      allocation.allocatedMunicipality,
      allocation.allocatedSettlement,
    ].filter(i => !!i).join(' > ');

    return text;
  };

  const generateUrl = (allocation) => {
    const url = [
      PATHS.TERRITORIAL_ORGANIZATION,
      allocation.allocatedCounty,
      allocation.allocatedMunicipality,
      allocation.allocatedSettlement,
    ].filter(i => !!i).join('/');

    return url;
  };

  return (
    <div>
      {data.map(allocation => (
        <div key={allocation.id}>
          <Link
            className={styles.link}
            to={generateUrl(allocation)}
          >
            {generateText(allocation)}
          </Link>
        </div>
      ))}
    </div>
  );
};

TerritorialOrganizationTooltip.defaultProps = {
  data: [],
};

TerritorialOrganizationTooltip.propTypes = {
  data: PropTypes.array,
};

export default memo(TerritorialOrganizationTooltip);
