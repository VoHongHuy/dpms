import React, { memo, useMemo } from 'react';
import { withRouter } from 'react-router';
import { useIntl } from 'react-intl';
import Switch from 'react-switch';
import PropTypes from 'prop-types';
import history from '@/history';
import { PATHS } from '../../constants';

import styles from './switcher.module.scss';

const Switcher = ({ match }) => {
  const { path } = match;
  const intl = useIntl();

  const checked = useMemo(() => path === PATHS.RESULT_ELECTIONS_ROUTE, []);

  const handleSwitchChange = (checked) => {
    if (checked) {
      history.push(PATHS.RESULT_ELECTIONS);
    } else {
      history.push(PATHS.RESULT_COUNTIES);
    }
  };

  return (
    <div className={styles.content}>
      <span>{intl.formatMessage({ id: 'RESULT.HEADER.COUNTIES' })}</span>
      <span className={styles.switch}>
        <Switch
          checked={checked}
          onChange={handleSwitchChange}
          onColor="#d8e3ec"
          offColor="#d8e3ec"
          onHandleColor="#005aab"
          offHandleColor="#005aab"
          handleDiameter={11}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={15}
          width={29}
          className={styles.switcher}
        />
      </span>
      <span>{intl.formatMessage({ id: 'RESULT.HEADER.ELECTION_UNITS' })}</span>
    </div>
  );
};

Switcher.propTypes = {
  match: PropTypes.object.isRequired,
};

export default memo(withRouter(Switcher));
