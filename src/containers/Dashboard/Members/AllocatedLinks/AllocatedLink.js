import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import TooltipLink from '@/components/TooltipLink';
import OrganizationalStructureTooltip from './OrganizationalStructureTooltip';
import TerritorialOrganizationTooltip from './TerritorialOrganizationTooltip';

import styles from './allocatedLink.module.scss';

const borderColor = '#e0e0e0';

const AllocatedLinks = ({ data }) => {
  const isTerritorialOrganizationDisabled = useMemo(() =>
    !data.allocations || !data.allocations.length,
  [data]);

  const isOrganizationalStructureDisabled = useMemo(() =>
    !data.organizationStructure,
  [data]);

  return (
    <>
      <TooltipLink
        disable={isOrganizationalStructureDisabled}
        className={styles.link}
        tooltip={<OrganizationalStructureTooltip data={data.organizationStructure} />}
        type="light"
        place="top"
        border
        borderColor={borderColor}
      >
        <i className="fa fa-sitemap" aria-hidden="true" />
      </TooltipLink>
      <TooltipLink
        disable={isTerritorialOrganizationDisabled}
        className={styles.link}
        tooltip={<TerritorialOrganizationTooltip data={data.allocations} />}
        type="light"
        place="top"
        border
        borderColor={borderColor}
      >
        <i className="fa fa-map" aria-hidden="true" />
      </TooltipLink>
    </>
  );
};

AllocatedLinks.propTypes = {
  data: PropTypes.object.isRequired,
};

export default memo(AllocatedLinks);
