import React, { memo } from 'react';
import PropTypes from 'prop-types';

import logoImage from '@/assets/images/logo_original.png';

import styles from './layoutWithLogo.module.scss';

const LayoutWithLogo = ({ children }) => (
  <div className={styles.container}>
    <div className={styles.logoWrapper}>
      <img alt="DPMS" src={logoImage} className={styles.logo} />
    </div>

    <div className={styles.content}>{children}</div>
  </div>
);

LayoutWithLogo.propTypes = { children: PropTypes.node.isRequired };

export default memo(LayoutWithLogo);
