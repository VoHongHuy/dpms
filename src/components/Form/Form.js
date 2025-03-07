import React, { memo, forwardRef } from 'react';

const Form = forwardRef((props, ref) => <form ref={ref} {...props} />);

export default memo(Form);
