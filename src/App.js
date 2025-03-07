import React, { memo, useEffect, useMemo } from 'react';
import { Switch } from 'react-router';
import { useIntl } from 'react-intl';
import { userManager } from '@/providers/OidcProvider';

import { ROUTES } from './constants';
import { generateRoutes } from './utils';
import DateContext from './contexts';

const App = () => {
  const intl = useIntl();
  const clearStaleState = async () => {
    await userManager.clearStaleState();
  };

  useEffect(() => {
    clearStaleState();
  }, []);

  const months = useMemo(() => [
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.JANUARY' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.FEBRUARY' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.MARCH' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.APRIL' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.MAY' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.JUNE' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.JULY' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.AUGUST' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.SEPTEMBER' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.OCTOBER' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.NOVEMBER' }),
    intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH.DECEMBER' }),
  ], []);

  return (
    <DateContext.Provider value={{ months }}>
      <Switch>{generateRoutes(ROUTES)}</Switch>
    </DateContext.Provider>
  );
};

export default memo(App);
