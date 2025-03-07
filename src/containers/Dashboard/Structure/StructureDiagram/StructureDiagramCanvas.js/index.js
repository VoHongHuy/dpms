import React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './StructureDiagramCanvas.module.scss';

// eslint-disable-next-line react/prefer-stateless-function
class StructureDiagramCanvas extends React.Component {
  render() {
    const { engine } = this.props;

    return <CanvasWidget className={styles.container} engine={engine} />;
  }
}

StructureDiagramCanvas.defaultProps = {};

StructureDiagramCanvas.propTypes = {
  engine: PropTypes.shape({
    repaintCanvas: PropTypes.func.isRequired,
  }).isRequired,
  model: PropTypes.shape({}).isRequired,
};

export default connect()(StructureDiagramCanvas);
