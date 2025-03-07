import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PATHS } from '@/containers/Dashboard/constants';

import styles from './organizationalStructureTooltip.module.scss';

const OrganizationalStructureTooltip = ({ data }) => data && (
  <div>
    {data.parentTitle && `${data.parentTitle} > `}
    <Link className={styles.link} to={`${PATHS.STRUCTURE}/${data.positionX}/${data.positionY}`}>
      {data.title}
    </Link>
  </div>
);

OrganizationalStructureTooltip.defaultProps = {
  data: null,
};

OrganizationalStructureTooltip.propTypes = {
  data: PropTypes.object,
};

export default memo(OrganizationalStructureTooltip);
