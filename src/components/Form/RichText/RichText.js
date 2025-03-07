import React, { memo } from 'react';
import { Editor, RichUtils } from 'draft-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FieldContainer from '../components/FieldContainer';
import FieldLabel from '../components/FieldLabel';
import FieldErrorMessage from '../components/FieldErrorMessage';
import 'draft-js/dist/Draft.css';
import styles from './richText.module.scss';

const RichText = ({ label, className, meta, input, ...rest }) => {
  const handleKeyCommand = command => {
    const { value, onChange } = input;
    const newState = RichUtils.handleKeyCommand(value, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <FieldContainer className={className}>
      <FieldLabel label={label} required={rest.required} />
      <div className={styles.container}>
        <div className={classNames(
          styles.input,
          meta && meta.touched && meta.error && styles.error,
        )}
        >
          <Editor
            {...rest}
            {...input}
            editorState={input.value}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      </div>
      <FieldErrorMessage message={meta && meta.touched && meta.error} />
    </FieldContainer>
  );
};

RichText.defaultProps = {
  className: '',
  label: '',
  required: false,
  meta: undefined,
  input: undefined,
};
RichText.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  // redux props
  meta: PropTypes.object,
  input: PropTypes.object,
};

export default memo(RichText);
