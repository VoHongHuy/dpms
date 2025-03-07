import React, { memo, forwardRef, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useEventListener } from '@/hooks';

import FieldContainer from '../components/FieldContainer';
import FieldLabel from '../components/FieldLabel';
import FieldErrorMessage from '../components/FieldErrorMessage';

import styles from './input.module.scss';

const Input = forwardRef(
  ({ label, className, onChange, onBlur, meta, input, readOnly, ...rest }, ref) => {
    const [hasValue, setValue] = useState(
      rest.value || rest.defaultValue || (input && input.value),
    );
    const inputRef = ref || useRef();

    useEffect(() => {
      setValue(rest.value || rest.defaultValue || (input && input.value));
    }, [rest.value, rest.defaultValue, input]);

    useEventListener('reset', () => {
      setValue('');
    });

    const handleChange = e => {
      if (onChange) {
        onChange(e);
      }
      if (input && input.onChange) {
        input.onChange(e);
      }
    };

    const handleBlur = e => {
      if (onBlur) {
        onBlur(e);
      }
      if (input && input.onBlur) {
        input.onBlur(e);
      }
    };

    // Issue clear input with javascript not trigger form change event
    // Solution https://github.com/facebook/react/issues/10135
    const setNativeValue = (element, value) => {
      const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
      const prototype = Object.getPrototypeOf(element);
      const prototypeValueSetter = Object.getOwnPropertyDescriptor(
        prototype,
        'value',
      ).set;

      if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
      } else {
        valueSetter.call(element, value);
      }
    };

    const handleClear = () => {
      setNativeValue(inputRef.current, '');
      let event;
      if (typeof (Event) === 'function') {
        event = new Event('input', { bubbles: true });
      } else {
        // fix Event constructor not working on IE
        event = document.createEvent('Event');
        event.initEvent('input', true, true);
      }
      inputRef.current.dispatchEvent(event);
      setValue('');
    };

    return (
      <FieldContainer className={className}>
        <FieldLabel label={label} required={rest.required} />
        <div className={styles.container}>
          <input
            {...rest}
            {...input}
            ref={inputRef}
            readOnly={readOnly}
            disabled={readOnly}
            onChange={handleChange}
            onBlur={handleBlur}
            className={classNames(
              styles.input,
              meta && meta.touched && meta.error && styles.error,
            )}
            value={rest.value || (input && input.value) || ''}
          />
          {!readOnly && hasValue ? (
            <i role="presentation" className="icon-esc" onClick={handleClear} />
          ) : null}
        </div>
        <FieldErrorMessage message={meta && meta.touched && meta.error} />
      </FieldContainer>
    );
  },
);

Input.defaultProps = {
  className: '',
  label: '',
  required: false,
  readOnly: false,
  value: undefined,
  defaultValue: undefined,
  onChange: undefined,
  onBlur: undefined,
  meta: undefined,
  input: undefined,
};
Input.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  readOnly: PropTypes.bool,
  // redux props
  meta: PropTypes.object,
  input: PropTypes.object,
};

export default memo(Input);
