import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import Navigation from '@/components/Navigation';
import { PATHS } from '../../constants';

const OrganizationNav = () => {
  const intl = useIntl();
  const links = useMemo(() => [
    {
      title: intl.formatMessage({ id: 'ORGANIZATION.NAVIGATION.PARLIAMENTARY_ELECTIONS' }),
      path: PATHS.PARLIAMENTARY_ELECTION,
    },
    {
      title: intl.formatMessage({ id: 'ORGANIZATION.NAVIGATION.TERRITORIAL_UNITS' }),
      path: PATHS.TERRITORIAL_ORGANIZATION,
    },
  ], []);

  return <Navigation links={links} />;
};

export default memo(OrganizationNav);
