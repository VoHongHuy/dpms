/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { v1 } from 'uuid';

import styles from './tooltipLink.module.scss';

const TooltipLink = ({
  children,
  tooltip,
  className,
  tooltipClassName,
  disable,
  onHover,
  href,
  ...rest
}) => {
  const id = useMemo(() => v1(), []);

  const handleMouseOver = () => {
    if (!disable && onHover) {
      onHover();
    }
  };

  const handleClick = event => event.preventDefault();

  return (
    <>
      <a
        href={href}
        data-tip
        data-for={id}
        onMouseOver={handleMouseOver}
        onClick={handleClick}
        className={classNames(
          styles.default,
          disable && styles.disableLink,
          className,
        )}
      >
        {children}
      </a>
      <ReactTooltip
        {...rest}
        id={id}
        disable={disable}
        className={classNames(
          styles.tooltip,
          tooltipClassName,
        )}
        delayHide={200}
        effect="solid"
      >
        {tooltip}
      </ReactTooltip>
    </>
  );
};

TooltipLink.defaultProps = {
  tooltip: undefined,
  className: '',
  disable: false,
  onHover: undefined,
  href: '',
  tooltipClassName: '',
};

TooltipLink.propTypes = {
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.node,
  className: PropTypes.string,
  disable: PropTypes.bool,
  onHover: PropTypes.func,
  href: PropTypes.string,
  tooltipClassName: PropTypes.string,
};

export default memo(TooltipLink);
