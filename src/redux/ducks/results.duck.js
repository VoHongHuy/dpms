import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

const initialStates = {
  fetching: false,
  success: false,
  error: null,
  resultDetails: {
    parliamentary: {
      2020: {
        generalResult: {
          totalVoterCount: null,
          votersVotedCount: null,
          voterCountByBallots: null,
          validBallotsCount: null,
          invalidBallotsCount: null,
        },
        politicalPartyResult: null,
      },
      2016: {
        generalResult: {
          totalVoterCount: null,
          votersVotedCount: null,
          voterCountByBallots: null,
          validBallotsCount: null,
          invalidBallotsCount: null,
        },
        politicalPartyResult: null,
      },
    },
    presidential: {
      round1: {
        generalResult: {
          totalVoterCount: null,
          votersVotedCount: null,
          voterCountByBallots: null,
          validBallotsCount: null,
          invalidBallotsCount: null,
        },
        presidentialCandidateResult: [],
      },
      round2: {
        generalResult: {
          totalVoterCount: null,
          votersVotedCount: null,
          voterCountByBallots: null,
          validBallotsCount: null,
          invalidBallotsCount: null,
        },
        presidentialCandidateResult: [],
      },
    },
    euroParliamentary: {
      2019: {
        generalResult: {
          totalVoterCount: null,
          votersVotedCount: null,
          voterCountByBallots: null,
          validBallotsCount: null,
          invalidBallotsCount: null,
        },
        politicalPartyResult: null,
      },
    },
    localElection: {},
  },
  subUnits: {

  },
  notes: [],
  contactInfo: null,
};

/**
 * Setup state and prefix
 */
const PREFIX = 'RESULTS';

/**
 * Actions - using for calling, getting, setting from component
 */
export const setFetching = createAction(`${PREFIX}/FETCHING`);
export const requestFailed = createAction(`${PREFIX}/REQUEST_FAILED`);
export const requestSuccess = createAction(`${PREFIX}/REQUEST_SUCCESS`);
export const fetchParliamentaryResult = createAction(`${PREFIX}/GET_PARLIAMENTARY_RESULT`);
export const fetchPresidentialResult = createAction(`${PREFIX}/GET_PRESIDENTIAL_RESULT`);
export const fetchLocalElectionResult = createAction(`${PREFIX}/GET_LOCAL_ELECTION_RESULT`);
export const fetchLocalElectionCandidateResult
  = createAction(`${PREFIX}/GET_LOCAL_ELECTION_CANDIDATE_RESULT`);
export const setFetchingLocalElectionCandidateResult
  = createAction(`${PREFIX}/FETCHING_LOCAL_ELECTION_CANDIDATE_RESULT`);
export const fetchNoteResult = createAction(`${PREFIX}/GET_NOTE_RESULT`);
export const createNoteResult = createAction(`${PREFIX}/CREATE_NOTE_RESULT`);
export const updateNoteResult = createAction(`${PREFIX}/UPDATE_NOTE_RESULT`);
export const deleteNoteResult = createAction(`${PREFIX}/DELETE_NOTE_RESULT`);
export const fetchEuroParliamentaryResult = createAction(`${PREFIX}/GET_EURO_PARLIAMENTARY_RESULT`);
export const fetchContactInfo = createAction(`${PREFIX}/GET_CONTACT`);

/**
 * Selector
 */
export const getResults = state => state.results;
export const getFetching = createSelector(
  [getResults],
  results => results.fetching,
);
export const getSuccess = createSelector(
  [getResults],
  results => results.success,
);
export const getError = createSelector(
  [getResults],
  results => results.error,
);
export const getResultDetails = createSelector(
  [getResults],
  results => results.resultDetails,
);
export const getParliamentaryResult = createSelector(
  [getResultDetails],
  details => details.parliamentary,
);
export const getPresidentialResult = createSelector(
  [getResultDetails],
  details => details.presidential,
);
export const getEuroParliamentaryResult = createSelector(
  [getResultDetails],
  details => details.euroParliamentary,
);
export const getLocalElectionResult = createSelector(
  [getResultDetails],
  results => results.localElection,
);
export const getNoteResult = createSelector(
  [getResults],
  results => results.notes,
);
export const getContactInfo = createSelector(
  [getResults],
  results => results.contactInfo,
);

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
      setFetchingLocalElectionCandidateResult,
      (state, { payload = {} }) => {
        const electionYear = state.resultDetails.localElection[payload.year] || {};
        const electionRound = state.resultDetails.localElection[payload.year]
          ? state.resultDetails.localElection[payload.year][payload.round]
          : {};
        const electionType = state.resultDetails.localElection[payload.year]
          ? state.resultDetails.localElection[payload.year][payload.round][payload.type]
          : {};
        return ({
          ...state,
          fetching: false,
          success: true,
          error: null,
          resultDetails: {
            ...state.resultDetails,
            localElection: {
              ...state.resultDetails.localElection,
              [payload.year]: {
                ...electionYear,
                [payload.round]: {
                  ...electionRound,
                  [payload.type]: {
                    ...electionType,
                    fetchingCandidate: true,
                  },
                },
              },
            },
          },
        });
      },
    ],
  ]),
  {
    ...initialStates,
  },
);
