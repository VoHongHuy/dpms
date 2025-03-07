import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import MEMBER_NODE from '@/constants/diagramNodeTypes';

class MemberNodeModel extends DefaultNodeModel {
  data = {};

  constructor(id, position = null) {
    super({ type: MEMBER_NODE, id, position });
  }

  setData = data => {
    this.data = data;
  };
}

export default MemberNodeModel;
