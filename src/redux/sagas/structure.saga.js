import { takeLatest, all, put, call } from 'redux-saga/effects';
import {
  setFetching,
  requestSuccess,
  requestFailed as requestFailedAction,
  fetchMembers,
  fetchStructureNodes,
  updateStructureNodeName,
  updateStructureNodePosition,
  createStructureNode,
  updateStructureNodeLink,
  updateStructureNodes,
  saveStructureNodes,
  deleteStructureNodes,
  selectStructureNode,
  unlinkNodes,
} from '@/redux/ducks/structure.duck';
import { api } from '@/services';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';
import { odataFilter } from '@/utils';
import _ from 'lodash';

const requestFailed = args =>
  requestFailedAction({ ...args, scope: ERROR_CODE_SCOPES.MANAGEMENT });

function* onGetMembersFlow() {
  yield takeLatest(fetchMembers, function* onGetMembers({
    payload: { page, rowPerPage, filters, callback },
  }) {
    try {
      const filtersOdata = odataFilter.compile(filters, {
        electionUnit: odataFilter.types.equal,
      });
      const data = yield call(api.get, 'api/PublicMember', {
        ...filtersOdata,
        $orderby: 'name',
        $skip: (page - 1) * rowPerPage,
        $top: rowPerPage,
        $count: true,
      });
      yield put(
        requestSuccess({
          response: { data: data.value, total: data['@odata.count'] },
          dismiss: true,
        }),
      );
      yield callback && callback();
    } catch (error) {
      yield put(requestFailed({ error }));
      yield callback && callback();
    }
  });
}

function* onGetStructureNodesFlow() {
  yield takeLatest(fetchStructureNodes, function* onGetStructureNodes() {
    yield put(setFetching());
    try {
      const data = yield call(api.get, 'api/organizationstructure');

      yield put(
        requestSuccess({
          response: {
            structureNodes: data,
            backupStructureNodes: _.cloneDeep(data),
          },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

const findNodeById = (id, nodes) => {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];

    if (node.id === id) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      const result = findNodeById(id, node.children);
      if (result) return result;
    }
  }

  return null;
};

const findNodeArray = (id, nodes) => {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];

    if (node.id === id) {
      return [nodes, index];
    }

    if (node.children && node.children.length > 0) {
      const result = findNodeArray(id, node.children);
      if (result) return result;
    }
  }

  return null;
};

function* onSetStructureNodeName() {
  yield takeLatest(updateStructureNodeName, function* onSetNodeName({
    payload: { id, name, localData },
  }) {
    try {
      const node = findNodeById(id, localData);
      node.name = name;

      yield put(
        requestSuccess({
          response: { structureNodes: localData },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onUpdateStructureNodePositionFlow() {
  yield takeLatest(updateStructureNodePosition, function* onUpdateStructureNodePosition({
    payload: { id, position, localData },
  }) {
    try {
      const node = findNodeById(id, localData);

      node.positionX = position.x;
      node.positionY = position.y;

      yield put(
        requestSuccess({
          response: { structureNodes: localData },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onCreateStructureNode() {
  yield takeLatest(createStructureNode, function* onCreateNode({
    payload: { data, localData },
  }) {
    try {
      localData.push(data);

      yield put(
        requestSuccess({
          response: { structureNodes: [...localData] },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onUpdateStructureNodeLink() {
  yield takeLatest(updateStructureNodeLink, function* onUpdateNodeLink({
    payload: { parentId, childId, localData },
  }) {
    try {
      const parentNode = findNodeById(parentId, localData);
      const childNode = findNodeById(childId, localData);

      const [arr, idx] = findNodeArray(childId, localData);
      if (arr) {
        arr.splice(idx, 1); // Remove object from its parent array
      }

      parentNode.children = parentNode.children || [];
      parentNode.children.push(childNode);

      yield put(
        requestSuccess({
          response: { structureNodes: [...localData] },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onUnlinkNodes() {
  yield takeLatest(unlinkNodes, function* onUnlinkNodes({
    payload: { parentId, childId, localData },
  }) {
    try {
      const parentNode = findNodeById(parentId, localData);
      const childNode = findNodeById(childId, localData);

      // Remove child from parent
      const childNodeIndex = parentNode.children.map(x => x.id).indexOf(childNode.id);
      parentNode.children.splice(childNodeIndex, 1);

      // Add child back to diagram
      localData.push(childNode);

      yield put(
        requestSuccess({
          response: { structureNodes: [...localData] },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onUpdateStructureNodes() {
  yield takeLatest(updateStructureNodes, function* onUpdateNodes({
    payload: { nodes },
  }) {
    try {
      yield put(
        requestSuccess({
          response: { structureNodes: _.cloneDeep(nodes) },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function createPostData(nodes) {
  if (!nodes) {
    return [];
  }

  return nodes.map(node => ({
    id: node.id,
    name: node.name,
    memberId: node.memberId,
    children: createPostData(node.children),
    positionX: node.positionX,
    positionY: node.positionY,
  }));
}

function* onSaveStructureNodesFlow() {
  yield takeLatest(saveStructureNodes, function* onSaveNodes({
    payload: { nodes },
  }) {
    yield put(setFetching());
    try {
      // call api post
      const postData = createPostData(nodes);

      yield call(api.post, 'api/organizationstructure', { payload: postData });

      yield put(
        requestSuccess({
          response: {
            structureNodes: nodes,
            backupStructureNodes: _.cloneDeep(nodes),
          },
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onDeleteStructureNodesFlow() {
  yield takeLatest(deleteStructureNodes, function* onDeleteNodes({
    payload: { id, localNodes },
  }) {
    try {
      const nodeToDelete = findNodeById(id, localNodes);
      const nodeToDeleteChildren = nodeToDelete.children ? nodeToDelete.children.slice() : [];

      const [arr, idx] = findNodeArray(id, localNodes);
      if (arr) {
        arr.splice(idx, 1); // Remove object from its parent array
      }

      localNodes.push(...nodeToDeleteChildren);

      yield put(
        requestSuccess({
          response: { structureNodes: [...localNodes] },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onSelectStructureNodeFlow() {
  yield takeLatest(selectStructureNode, function* onSelectNode({
    payload: { id, isSelected, localSelectedNodes },
  }) {
    if (isSelected) {
      localSelectedNodes.push(id);
    } else {
      const idx = localSelectedNodes.findIndex(n => n === id);
      localSelectedNodes.splice(idx, 1);
    }

    yield put(
      requestSuccess({
        response: { selectedNodes: localSelectedNodes },
        dismiss: true,
      }),
    );
  });
}

export default function* structureSaga() {
  yield all([
    onGetMembersFlow(),
    onGetStructureNodesFlow(),
    onSetStructureNodeName(),
    onUpdateStructureNodePositionFlow(),
    onCreateStructureNode(),
    onUpdateStructureNodeLink(),
    onUnlinkNodes(),
    onUpdateStructureNodes(),
    onSaveStructureNodesFlow(),
    onDeleteStructureNodesFlow(),
    onSelectStructureNodeFlow(),
  ]);
}
