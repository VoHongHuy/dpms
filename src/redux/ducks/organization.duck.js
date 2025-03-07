import { createAction, handleActions } from 'redux-actions';

/**
 * Setup state and prefix
 */
const initialStates = {
  fetching: false,
  success: false,
  error: null,
  territorialAllocation: {
    members: {
      data: [],
      total: undefined,
    },
  },
  allocatedMembersForTerritorialMainUnit: {
    data: [],
    total: 0,
  },
  allocatedMembersForTerritorialSubUnit: {
    data: [],
    total: 0,
  },
  countAllocatedMembersForTerritorialUnit: {
    unit: 0,
    subunit: 0,
  },
  parliamentary: {
    pollingStations: {
      fetching: false,
      data: [],
    },
  },
  allocatedMembersForParliamentaryMainUnit: {
    data: [],
    total: 0,
  },
  allocatedMembersForParliamentarySubUnit: {
    data: [],
    total: 0,
  },
  parliamentaryAllocation: {
    members: {
      data: [],
      total: undefined,
    },
  },
  countAllocatedMembersForParliamentaryUnit: {
    unit: 0,
    subunit: 0,
  },
  isExporting: false,
};

const PREFIX = 'ORGANIZATION';

/**
 * Actions - using for calling, getting, setting from component
 */
export const setFetching = createAction(`${PREFIX}/FETCHING`);
export const requestFailed = createAction(`${PREFIX}/REQUEST_FAILED`);
export const requestSuccess = createAction(`${PREFIX}/REQUEST_SUCCESS`);
export const fetchMembersForTerritorialAllocations = createAction(
  `${PREFIX}/GET_MEMBERS_FOR_TERRITORIAL_ALLOCATIONS`,
);
export const allocateMembersToTerritorialUnit = createAction(
  `${PREFIX}/ALLOCATE_MEMBERS_TO_TERRITORIAL_UNIT`,
);
export const fetchAllocatedMembersForTerritorialMainUnit = createAction(
  `${PREFIX}/GET_ALLOCATED_MEMBERS_FOR_TERRITORIAL_MAIN_UNIT`,
);
export const fetchAllocatedMembersForTerritorialSubUnit = createAction(
  `${PREFIX}/GET_ALLOCATED_MEMBERS_FOR_TERRITORIAL_SUB_UNIT`,
);
export const updateMemberNoteForTerritorialUnit = createAction(
  `${PREFIX}/UPDATE_MEMBER_NOTE_FOR_TERRITORIAL_UNIT`,
);
export const deleteAllocatedMemberForTerritorialUnit = createAction(
  `${PREFIX}/DELETE_ALLOCATED_MEMBER_FOR_TERRITORIAL_UNIT`,
);
export const fetchCountAllocatedMembersForTerritorialUnit = createAction(
  `${PREFIX}/FETCH_COUNT_ALLOCATED_MEMBERS_FOR_TERRITORIAL_UNIT`,
);
export const fetchPollingStations = createAction(
  `${PREFIX}/FETCH_POLLING_STATIONS`,
);
export const fetchAllocatedMembersForParliamentaryMainUnit = createAction(
  `${PREFIX}/GET_ALLOCATED_MEMBERS_FOR_PARLIAMENTARY_MAIN_UNIT`,
);
export const fetchAllocatedMembersForParliamentarySubUnit = createAction(
  `${PREFIX}/GET_ALLOCATED_MEMBERS_FOR_PARLIAMENTARY_SUB_UNIT`,
);
export const updateMemberNoteForParliamentaryUnit = createAction(
  `${PREFIX}/UPDATE_MEMBER_NOTE_FOR_PARLIAMENTARY_UNIT`,
);
export const deleteAllocatedMemberForParliamentaryUnit = createAction(
  `${PREFIX}/DELETE_ALLOCATED_MEMBER_FOR_PARLIAMENTARY_UNIT`,
);
export const fetchMembersForParliamentaryAllocations = createAction(
  `${PREFIX}/GET_MEMBERS_FOR_PARLIAMENTARY_ALLOCATIONS`,
);
export const allocateMembersToParliamentaryUnit = createAction(
  `${PREFIX}/ALLOCATE_MEMBERS_TO_PARLIAMENTARY_UNIT`,
);
export const fetchCountAllocatedMembersForParliamentaryUnit = createAction(
  `${PREFIX}/FETCH_COUNT_ALLOCATED_MEMBERS_FOR_Parliamentary_UNIT`,
);
export const exportAllocatedMembers = createAction(
  `${PREFIX}/EXPORT_ALLOCATED_MEMBERS`,
);
export const setExporting = createAction(`${PREFIX}/SET_EXPORTING`);

/**
 * Selector
 */
export const getFetching = state => state.accounts.fetching;
export const getSuccess = state => state.accounts.success;
export const getError = state => state.accounts.error;
export const getMembersForTerritorialOrganizations =
  state => state.organization.territorialAllocation.members.data;
export const getCountMembersForTerritorialOrganizations =
  state => state.organization.territorialAllocation.members.total;
export const getAllocatedMembersForTerritorialMainUnit = state =>
  state.organization.allocatedMembersForTerritorialMainUnit;
export const getAllocatedMembersForTerritorialSubUnit = state =>
  state.organization.allocatedMembersForTerritorialSubUnit;
export const getCountAllocatedMembersForTerritorial = state =>
  state.organization.countAllocatedMembersForTerritorialUnit;
export const getPollingStations = state => state.organization.parliamentary.pollingStations;
export const getAllocatedMembersForParliamentaryMainUnit = state =>
  state.organization.allocatedMembersForParliamentaryMainUnit;
export const getAllocatedMembersForParliamentarySubUnit = state =>
  state.organization.allocatedMembersForParliamentarySubUnit;
export const getMembersForParliamentaryOrganizations =
  state => state.organization.parliamentaryAllocation.members.data;
export const getCountMembersForParliamentaryOrganizations =
  state => state.organization.parliamentaryAllocation.members.total;
export const getCountAllocatedMembersParliamentary = state =>
  state.organization.countAllocatedMembersForParliamentaryUnit;
export const getIsExporting = state => state.members.isExporting;

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
    [
      setExporting,
      (state, { payload: { isExporting } }) => ({
        ...state,
        isExporting,
      }),
    ],
  ]),
  {
    ...initialStates,
  },
);
