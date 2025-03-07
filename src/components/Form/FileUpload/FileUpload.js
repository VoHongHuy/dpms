import React, { forwardRef, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@/components/Button';

import styles from './fileUpload.module.scss';

const FileUpload = forwardRef(
  ({ className, onUpload, children, ...rest }, ref) => {
    const fileInput = ref || useRef();

    const handleFileUpload = e => {
      const { files } = e.target;
      if (files && files.length) {
        if (onUpload) {
          onUpload(files);
        }
      }
    };

    const onButtonClick = () => {
      fileInput.current.click();
    };

    return (
      <>
        <input
          {...rest}
          style={{ display: 'none' }}
          ref={fileInput}
          onChange={handleFileUpload}
          type="file"
        />
        <Button
          onClick={onButtonClick}
          className={classNames(styles.button, className)}
        >
          {children}
        </Button>
      </>
    );
  },
);

FileUpload.defaultProps = {
  className: '',
  onUpload: undefined,
};

FileUpload.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onUpload: PropTypes.func,
};

export default memo(FileUpload);
