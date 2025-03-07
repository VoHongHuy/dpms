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
  sortOrder: {
    column: undefined,
    sortDirection: undefined,
  },
  selectedMember: null,
  selectedMembers: [],
  filteredMembers: [],
  birthdayMembers: [],
  isExecuting: false,
  providers: [],
};
const PREFIX = 'MEMBERS';

/**
 * Actions - using for calling, getting, setting from component
 */
export const setFetching = createAction(`${PREFIX}/FETCHING`);
export const requestFailed = createAction(`${PREFIX}/REQUEST_FAILED`);
export const requestSuccess = createAction(`${PREFIX}/REQUEST_SUCCESS`);
export const fetchMembers = createAction(`${PREFIX}/GET_MEMBERS`);
export const fetchMember = createAction(`${PREFIX}/GET_MEMBER`);
export const addMember = createAction(`${PREFIX}/ADD_MEMBER`);
export const clearMemberSelected = createAction(
  `${PREFIX}/CLEAR_MEMBER_SELECTED`,
);
export const updateMember = createAction(`${PREFIX}/UPDATE_MEMBER`);
export const deleteMember = createAction(`${PREFIX}/DELETE_MEMBER`);
export const uploadDocuments = createAction(`${PREFIX}/UPLOAD_DOCUMENTS`);
export const deleteDocument = createAction(`${PREFIX}/DELETE_DOCUMENT`);
export const downloadDocument = createAction(`${PREFIX}/DOWNLOAD_DOCUMENT`);
export const getDocuments = createAction(`${PREFIX}/GET_DOCUMENT`);
export const exportMembers = createAction(`${PREFIX}/EXPORT_MEMBERS`);
export const setExecuting = createAction(`${PREFIX}/SET_EXPORTING`);
export const setSortOrder = createAction(`${PREFIX}/SET_SORT_ORDER`);
export const selectMembers = createAction(
  `${PREFIX}/SELECT_MEMBER_TO_EXPORT`,
);
export const deSelectMembers = createAction(
  `${PREFIX}/DESELECT_MEMBER_TO_EXPORT`,
);
export const fetchFilteredMembers = createAction(
  `${PREFIX}/GET_FILTERED_MEMBERS`,
);
export const fetchBirthdayMembers = createAction(
  `${PREFIX}/GET_BIRTHDAY_MEMBERS`,
);
export const fetchProviders = createAction(
  `${PREFIX}/GET_PROVIDERS`,
);
export const clearProviders = createAction(
  `${PREFIX}/CLEAR_PROVIDERS`,
);

export const getFetching = state => state.members.fetching;
export const getSuccess = state => state.members.success;
export const getError = state => state.members.error;
export const getMembers = state => state.members.data;
export const getTotalMembers = state => state.members.total;
export const getMemberSelected = state => state.members.selectedMember;
export const getSelectedMembers = state => state.members.selectedMembers;
export const getFilteredMembers = state => state.members.filteredMembers;
export const getBirthdayMembers = state => state.members.birthdayMembers;
export const getIsExecuting = state => state.members.isExecuting;
export const getSortOrder = state => state.members.sortOrder;
export const getProviders = state => state.members.providers;
export const getSelectedMemberCount = state => state.members.selectedMembers.length;

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
      clearMemberSelected,
      state => ({
        ...state,
        selectedMember: null,
      }),
    ],
    [
      selectMembers,
      (state, { payload }) => {
        const newMembers = payload.filter(
          i => !state.selectedMembers.includes(i),
        );
        const selectedMembers = [...state.selectedMembers, ...newMembers];
        return {
          ...state,
          selectedMembers,
        };
      },
    ],
    [
      deSelectMembers,
      (state, { payload }) => {
        const selectedMembers = state.selectedMembers.filter(
          i => !payload.includes(i),
        );
        return {
          ...state,
          selectedMembers,
        };
      },
    ],
    [
      setExecuting,
      (state, { payload: { isExecuting } }) => ({
        ...state,
        isExecuting,
      }),
    ],
    [
      setSortOrder,
      (state, { payload: { column, sortDirection } }) => ({
        ...state,
        sortOrder: {
          column,
          sortDirection,
        },
      }),
    ],
    [
      clearProviders,
      state => ({
        ...state,
        providers: [],
      }),
    ],
  ]),
  {
    ...initialStates,
  },
);
