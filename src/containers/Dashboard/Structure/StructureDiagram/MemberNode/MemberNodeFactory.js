import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import React from 'react';
import MEMBER_NODE from '@/constants/diagramNodeTypes';
import MemberNode from '.';
import MemberNodeModel from './MemberNodeModel';

class MemberNodeFactory extends AbstractReactFactory {
  constructor() {
    super(MEMBER_NODE);
  }

  generateReactWidget(event) {
    return (
      <MemberNode
        engine={this.engine}
        node={event.model}
        data={event.model.data}
      />
    );
  }

  // eslint-disable-next-line class-methods-use-this
  generateModel() {
    return new MemberNodeModel();
  }
}

export default MemberNodeFactory;
