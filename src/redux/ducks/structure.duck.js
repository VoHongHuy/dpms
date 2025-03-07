import { createAction, handleActions } from 'redux-actions';

/**
 * Setup state and prefix
 */
const initialStates = {
  fetching: false,
  success: false,
  error: null,
  data: [],
  total: 0,
  structureNodes: [],
  organizationUnit: {},
  shouldDistributeNodes: {},
  selectedNodes: [],
};
const PREFIX = 'STRUCTURE';

/**
 * Actions - using for calling, getting, setting from component
 */

export const setFetching = createAction(`${PREFIX}/FETCHING`);
export const requestFailed = createAction(`${PREFIX}/REQUEST_FAILED`);
export const requestSuccess = createAction(`${PREFIX}/REQUEST_SUCCESS`);
export const fetchMembers = createAction(`${PREFIX}/GET_MEMBERS`);
export const fetchStructureNodes = createAction(
  `${PREFIX}/GET_STRUCTURE_NODES`,
);
export const updateStructureNodeName = createAction(
  `${PREFIX}/UPDATE_STRUCTURE_NODE_NAME`,
);
export const updateStructureNodePosition = createAction(
  `${PREFIX}/UPDATE_STRUCTURE_NODE_POSITION`,
);
export const createStructureNode = createAction(
  `${PREFIX}/CREATE_STRUCTURE_NODE`,
);
export const updateStructureNodeLink = createAction(
  `${PREFIX}/UPDATE_STRUCTURE_NODE_LINK`,
);
export const unlinkNodes = createAction(
  `${PREFIX}/UNLINK_NODES`,
);
export const updateStructureNodes = createAction(
  `${PREFIX}/UPDATE_STRUCTURE_NODES`,
);
export const saveStructureNodes = createAction(
  `${PREFIX}/SAVE_STRUCTURE_NODES`,
);
export const deleteStructureNodes = createAction(
  `${PREFIX}/DELETE_STRUCTURE_NODES`,
);
export const selectStructureNode = createAction(
  `${PREFIX}/SELECT_STRUCTURE_NODES`,
);

export const getFetching = state => state.structure.fetching;
export const getSuccess = state => state.structure.success;
export const getError = state => state.structure.error;
export const getMembers = state => state.structure.data;
export const getTotalMembers = state => state.structure.total;
export const getStructureNodes = state => state.structure.structureNodes;
export const getStructureNodesBackup = state =>
  state.structure.backupStructureNodes;
export const getOrganizationUnit = state => state.structure.organizationUnit;
export const getSelectedNodes = state => state.structure.selectedNodes;

/**
 * Reducers - using for redux store
 */
export default handleActions(
  new Map([
    [
      setFetching,
      (state, { payload }) => ({
        ...state,
        fetching: true,
        success: false,
        error: null,
        ...payload,
      }),
    ],
    [
      requestFailed,
      (state, { payload = { error: {}, response: {} } }) => ({
        ...state,
        fetching: false,
        success: false,
        error: payload.error,
        ...payload.response,
      }),
    ],
    [
      requestSuccess,
      (state, { payload = { response: {} } }) => ({
        ...state,
        fetching: false,
        success: true,
        error: null,
        ...payload.response,
      }),
    ],
  ]),
  {
    ...initialStates,
  },
);
