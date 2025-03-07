import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './navigation.module.scss';

const Navigation = ({ links }) => (
  <ul className={styles.navigation}>
    {links.map(link => (
      <li key={link.path}>
        <NavLink to={link.path} activeClassName={styles.selected}>
          {link.title}
        </NavLink>
      </li>
    ))}
  </ul>
);

Navigation.propTypes = {
  links: PropTypes.array.isRequired,
};

export default Navigation;
