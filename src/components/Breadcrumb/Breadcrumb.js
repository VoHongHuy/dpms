import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';
import styles from './breadcrumb.module.scss';

const Breadcrumb = ({ links }) => {
  const routeMatch = useRouteMatch();
  return (
    <ul className={styles.breadcrumb}>
      {links.map((link) => (
        <li key={link.path}>
          {routeMatch.url.toLowerCase() === link.path.toLowerCase() ?
            link.name : (
              <Link to={link.path}>
                {link.name}
              </Link>
            )}
        </li>
      ))}
    </ul>
  );
};

Breadcrumb.defaultProps = {
  links: [],
};

Breadcrumb.propTypes = {
  links: PropTypes.array,
};

export default memo(Breadcrumb);
