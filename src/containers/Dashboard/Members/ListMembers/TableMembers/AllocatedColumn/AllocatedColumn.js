import React, { memo } from 'react';
import PropTypes from 'prop-types';
import AllocatedLinks from '../../../AllocatedLinks';

const AllocatedColumn = ({ data }) => <AllocatedLinks data={data} />;

AllocatedColumn.propTypes = {
  data: PropTypes.object.isRequired,
};

export default memo(AllocatedColumn);
