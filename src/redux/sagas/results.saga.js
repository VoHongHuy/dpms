/* eslint-disable no-param-reassign */
import { all, put, call, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { api } from '@/services';
import { odataFilter } from '@/utils';
import { v1 } from 'uuid';
import {
  fetchParliamentaryResult,
  setFetching,
  requestSuccess,
  requestFailed,
  getParliamentaryResult,
  getResultDetails,
  fetchNoteResult,
  createNoteResult,
  updateNoteResult,
  deleteNoteResult,
  fetchPresidentialResult,
  getPresidentialResult,
  fetchEuroParliamentaryResult,
  fetchContactInfo,
  getEuroParliamentaryResult,
  fetchLocalElectionResult,
  getLocalElectionResult,
  fetchLocalElectionCandidateResult,
  setFetchingLocalElectionCandidateResult,
} from '../ducks/results.duck';

const generateFilterExpression = (
  electionYear,
  electionRound,
  electionType,
  electionUnitNumber,
  countyId,
  municipalityId,
  settlementId,
  countyFilterKey,
) => {
  let expression = electionYear ? `electionYear eq ${electionYear}` : '';
  if (electionType) {
    expression += `${expression && ' and '}electionType eq '${electionType}'`;
  }
  if (electionRound) {
    expression += `${expression && ' and '}electionRound eq ${electionRound}`;
  }
  if (electionUnitNumber && !countyId && !municipalityId && !settlementId) {
    expression += `${expression && ' and '}electionUnitNumber eq ${electionUnitNumber}`;
  } else {
    const query = [
      { key: countyFilterKey, value: countyId },
      { key: 'municipalityId', value: municipalityId },
      { key: 'settlementId', value: settlementId },
    ].filter(item => item.value).map(
      item => `${item.key} eq ${item.value}`,
    ).join(' and ');
    expression += query ? `${expression && ' and '}${query}` : '';
  }

  return expression ? `filter(${expression})` : '';
};

function* getParliamentaryGeneralResult(
  url,
  electionYear,
  electionUnitNumber,
  countyId,
  municipalityId,
  settlementId,
) {
  const aggregateExpression = 'aggregate({aggregateExpression})'.replace(
    '{aggregateExpression}',
    [
      'TotalVoterCount with sum as totalVoterCount',
      'VotersVotedCount with sum as votersVotedCount',
      'VoterCountByBallots with sum as voterCountByBallots',
      'ValidBallotsCount with sum as validBallotsCount',
      'InvalidBallotsCount with sum as invalidBallotsCount',
    ].join(','),
  );

  const groupByProperty = (settlementId && 'settlementId') ||
    (municipalityId && 'municipalityId') ||
    (countyId && 'Municipality/CountyId') ||
    (electionUnitNumber && 'electionUnitNumber') ||
    'electionYear';
  const groupExpression = `groupby((${groupByProperty}), ${aggregateExpression})`;
  const filterExpression = generateFilterExpression(
    electionYear,
    undefined,
    undefined,
    electionUnitNumber,
    countyId,
    municipalityId,
    settlementId,
    'Municipality/CountyId',
  );
  const query = `${filterExpression}/${groupExpression}`;
  const data = yield call(api.get, url, {
    $apply: query,
  });

  return data.value[0] ?? {
    totalVoterCount: 0,
    votersVotedCount: 0,
    voterCountByBallots: 0,
    validBallotsCount: 0,
    invalidBallotsCount: 0,
  };
}

function* getParliamentaryPoliticalResult(
  url,
  electionYear,
  electionUnitNumber,
  countyId,
  municipalityId,
  settlementId,
) {
  const aggregateExpression = 'aggregate(NumberOfVotes with sum as numberOfVotes)';
  const groupByProperty = 'politicalPartyId, politicalPartyName, memberName';
  const groupExpression = `groupby((${groupByProperty}), ${aggregateExpression})`;
  const filterExpression = generateFilterExpression(
    electionYear,
    undefined,
    undefined,
    electionUnitNumber,
    countyId,
    municipalityId,
    settlementId,
    'CountyId',
  );
  const query = `${filterExpression}/${groupExpression}`;
  const data = yield call(api.get, url, {
    $count: true,
    $apply: query,
    $orderby: 'politicalPartyName asc, memberName asc',
  });

  const result = data.value.reduce((r, e) => {
    r[e.politicalPartyId] = r[e.politicalPartyId] ?? { numberOfVotes: 0 };
    r[e.politicalPartyId].data = [...r[e.politicalPartyId].data || [], e];
    r[e.politicalPartyId].numberOfVotes += e.numberOfVotes;
    r[e.politicalPartyId].name = e.politicalPartyName;
    return r;
  }, {});

  return result;
}

function* getPresidentialGeneralResult(
  electionYear,
  electionRound,
  electionUnitNumber,
  countyId,
  municipalityId,
  settlementId,
) {
  const aggregateExpression = 'aggregate({aggregateExpression})'.replace(
    '{aggregateExpression}',
    [
      'TotalVoterCount with sum as totalVoterCount',
      'VotersVotedCount with sum as votersVotedCount',
      'VoterCountByBallots with sum as voterCountByBallots',
      'ValidBallotsCount with sum as validBallotsCount',
      'InvalidBallotsCount with sum as invalidBallotsCount',
    ].join(','),
  );

  const groupByProperty = (settlementId && 'settlementId') ||
    (municipalityId && 'municipalityId') ||
    (countyId && 'Municipality/CountyId') ||
    (electionUnitNumber && 'electionUnitNumber') ||
    'electionYear, electionRound';
  const groupExpression = `groupby((${groupByProperty}), ${aggregateExpression})`;
  const filterExpression = generateFilterExpression(
    electionYear,
    electionRound,
    undefined,
    electionUnitNumber,
    countyId,
    municipalityId,
    settlementId,
    'Municipality/CountyId',
  );
  const query = `${filterExpression}/${groupExpression}`;
  const data = yield call(api.get, 'api/PresidentialResult', {
    $apply: query,
  });

  return data.value[0] ?? {
    totalVoterCount: 0,
    votersVotedCount: 0,
    voterCountByBallots: 0,
    validBallotsCount: 0,
    invalidBallotsCount: 0,
  };
}

function* getPresidentialCandidateResult(
  electionYear,
  electionRound,
  electionUnitNumber,
  countyId,
  municipalityId,
  settlementId,
) {
  const aggregateExpression = 'aggregate(NumberOfVotes with sum as numberOfVotes)';
  const groupByProperty = 'candidateName';
  const groupExpression = `groupby((${groupByProperty}), ${aggregateExpression})`;
  const filterExpression = generateFilterExpression(
    electionYear,
    electionRound,
    undefined,
    electionUnitNumber,
    countyId,
    municipalityId,
    settlementId,
    'CountyId',
  );
  const query = `${filterExpression}/${groupExpression}`;
  const data = yield call(api.get, 'api/PresidentialCandidateResult', {
    $apply: query,
    $orderby: 'numberOfVotes desc',
  });

  const result = data.value;

  return result;
}

function* getLocalElectionGeneralResult(
  electionUnitNumber,
  countyId,
  municipalityId,
  settlementId,
) {
  const aggregateExpression = 'aggregate({aggregateExpression})'.replace(
    '{aggregateExpression}',
    [
      'TotalVoterCount with sum as totalVoterCount',
      'VotersVotedCount with sum as votersVotedCount',
      'VoterCountByBallots with sum as voterCountByBallots',
      'ValidBallotsCount with sum as validBallotsCount',
      'InvalidBallotsCount with sum as invalidBallotsCount',
    ].join(','),
  );

  const groupBy = (settlementId && 'settlementId') ||
    (municipalityId && 'municipalityId') ||
    (countyId && 'Municipality/CountyId') ||
    (electionUnitNumber && 'electionUnitNumber');
  const groupExpression
    = `groupby((${groupBy ? `${groupBy}, ` : ''}electionYear, electionRound, electionType), 
      ${aggregateExpression})`;
  const filterExpression = generateFilterExpression(
    undefined,
    undefined,
    undefined,
    electionUnitNumber,
    countyId,
    municipalityId,
    settlementId,
    'Municipality/CountyId',
  );
  const query = `${filterExpression ? (`${filterExpression}/`) : ''}${groupExpression}`;
  const data = yield call(api.get, 'api/LocalElectionResult', {
    $apply: query,
  });

  return data.value ?? [];
}

function* getLocalElectionCandidateResult(
  electionType,
  electionYear,
  electionRound,
  electionUnitNumber,
  countyId,
  municipalityId,
  settlementId,
) {
  const aggregateExpression
    = 'aggregate(NumberOfVotes with sum as numberOfVotes)';
  const groupByProperty = 'candidateName';
  const groupExpression
    = `groupby((${groupByProperty}), ${aggregateExpression})`;
  const filterExpression = generateFilterExpression(
    electionYear,
    electionRound,
    electionType,
    electionUnitNumber,
    countyId,
    municipalityId,
    settlementId,
    'CountyId',
  );
  const query = `${filterExpression}/${groupExpression}`;
  const data = yield call(api.get, 'api/LocalElectionCandidateResult', {
    $apply: query,
    $orderby: 'numberOfVotes desc',
  });

  const result = data.value;

  return result;
}

function* onGetParliamentaryResultFlow() {
  yield takeEvery(fetchParliamentaryResult,
    function* onGetParliamentaryResult({
      payload: { electionUnitNumber, countyId, municipalityId, settlementId, electionYear },
    }) {
      yield put(setFetching());
      try {
        const generalResult = yield getParliamentaryGeneralResult(
          'api/ParliamentaryResult',
          electionYear,
          electionUnitNumber,
          countyId,
          municipalityId,
          settlementId,
        );

        const politicalPartyResult = yield getParliamentaryPoliticalResult(
          'api/PoliticalPartyMemberResult',
          electionYear,
          electionUnitNumber,
          countyId,
          municipalityId,
          settlementId,
        );

        const details = yield select(getResultDetails);
        const parliamentaryResult = yield select(getParliamentaryResult);

        yield put(
          requestSuccess({
            response: {
              resultDetails: {
                ...details,
                parliamentary: {
                  ...parliamentaryResult,
                  [electionYear]: {
                    ...parliamentaryResult[electionYear],
                    generalResult,
                    politicalPartyResult,
                  },
                },
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetPresidentialResultFlow() {
  yield takeEvery(fetchPresidentialResult,
    function* onGetPresidentialResult({
      payload: {
        electionUnitNumber,
        countyId,
        municipalityId,
        settlementId,
        electionYear,
        electionRound,
      },
    }) {
      yield put(setFetching());
      try {
        const generalResult = yield getPresidentialGeneralResult(
          electionYear,
          electionRound,
          electionUnitNumber,
          countyId,
          municipalityId,
          settlementId,
        );

        const candidateResult = yield getPresidentialCandidateResult(
          electionYear,
          electionRound,
          electionUnitNumber,
          countyId,
          municipalityId,
          settlementId,
        );

        const details = yield select(getResultDetails);
        const presidentialResult = yield select(getPresidentialResult);
        const roundKey = `round${electionRound}`;

        yield put(
          requestSuccess({
            response: {
              resultDetails: {
                ...details,
                presidential: {
                  ...presidentialResult,
                  [roundKey]: {
                    ...presidentialResult[roundKey],
                    generalResult,
                    presidentialCandidateResult: candidateResult,
                  },
                },
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetEuroParliamentaryResultFlow() {
  yield takeEvery(fetchEuroParliamentaryResult,
    function* onGetEuroParliamentaryResult({
      payload: { electionUnitNumber, countyId, municipalityId, settlementId, electionYear },
    }) {
      yield put(setFetching());
      try {
        const generalResult = yield getParliamentaryGeneralResult(
          'api/EuroParliamentaryResult',
          electionYear,
          electionUnitNumber,
          countyId,
          municipalityId,
          settlementId,
        );

        const politicalPartyResult = yield getParliamentaryPoliticalResult(
          'api/EuroParliamentaryPoliticalPartyMemberResult',
          electionYear,
          electionUnitNumber,
          countyId,
          municipalityId,
          settlementId,
        );

        const details = yield select(getResultDetails);
        const euroParliamentary = yield select(getEuroParliamentaryResult);

        yield put(
          requestSuccess({
            response: {
              resultDetails: {
                ...details,
                euroParliamentary: {
                  ...euroParliamentary,
                  [electionYear]: {
                    ...euroParliamentary[electionYear],
                    generalResult,
                    politicalPartyResult,
                  },
                },
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetNoteResultFlow() {
  yield takeLatest(fetchNoteResult,
    function* onGetNoteResult({
      payload: { electionUnitNumber, countyId, municipalityId, settlementId },
    }) {
      yield put(setFetching());
      try {
        let filterExpression = '';
        if (electionUnitNumber && !countyId && !municipalityId && !settlementId) {
          filterExpression += `electionUnitNumber eq ${electionUnitNumber}`;
        } else {
          const query = [
            { key: 'countyId', value: countyId },
            { key: 'municipalityId', value: municipalityId },
            { key: 'settlementId', value: settlementId },
          ].filter(item => item.value).map(
            item => `${item.key} eq ${item.value}`,
          ).join(' and ');
          filterExpression += query;
        }
        const payload = {
          $orderby: 'updatedTime desc',
        };
        if (filterExpression) {
          payload.$filter = filterExpression;
        }

        const data = yield call(api.get, 'api/ElectionResultNote', payload);

        yield put(
          requestSuccess({
            response: {
              notes: data,
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onCreateNoteResultFlow() {
  yield takeLatest(createNoteResult, function* onCreateNoteResult({
    payload: { data, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield call(api.post, 'api/ElectionResultNote', data);
      yield call(callback);
      yield put(requestSuccess());
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onUpdateNoteResultFlow() {
  yield takeLatest(updateNoteResult, function* onUpdateNoteResult({
    payload: { data, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield call(api.post, `api/ElectionResultNote/${data.id}`, data);
      yield call(callback);
      yield put(requestSuccess());
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onDeleteNoteResultFlow() {
  yield takeLatest(deleteNoteResult,
    function* onDeleteNoteResult({
      payload: { data, callback },
    }) {
      yield put(setFetching());
      try {
        yield call(api.delete,
          `api/ElectionResultNote/${data.id}`,
          data);
        yield call(callback);
        yield put(requestSuccess());
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetContactInfoFlow() {
  yield takeLatest(fetchContactInfo,
    function* onGetContactInfo({
      payload: { filters },
    }) {
      yield put(setFetching());

      try {
        const filtersOdata = odataFilter.compile(filters, {
          countyId: odataFilter.types.equal,
          municipalityId: odataFilter.types.equal,
          settlementId: odataFilter.types.equal,
        });

        const data = yield call(api.get, 'api/RegionContactInfo', {
          ...filtersOdata,
        });

        yield put(
          requestSuccess({
            response: {
              contactInfo: data.value[0],
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetLocalElectionResultFlow() {
  yield takeEvery(fetchLocalElectionResult,
    function* onGetLocalElectionResult({
      payload: {
        electionUnitNumber,
        countyId,
        municipalityId,
        settlementId,
      },
    }) {
      yield put(setFetching());
      try {
        const localElectionResults = yield getLocalElectionGeneralResult(
          electionUnitNumber,
          countyId,
          municipalityId,
          settlementId,
        );

        const localElectionResultsGroup = localElectionResults.reduce((result, item) => {
          result[item.electionYear] = result[item.electionYear] || {};
          result[item.electionYear][item.electionRound]
            = result[item.electionYear][item.electionRound] || {};
          result[item.electionYear][item.electionRound][item.electionType]
            = result[item.electionYear][item.electionRound][item.electionType] || {};

          result[item.electionYear][item.electionRound][item.electionType] = {
            ...item,
            fetchingCandidate: false,
            candidateResults: [],
          };

          return result;
        }, {});

        const details = yield select(getResultDetails);
        const localElectionResult = yield select(getLocalElectionResult);

        yield put(
          requestSuccess({
            response: {
              resultDetails: {
                ...details,
                localElection: {
                  ...localElectionResult,
                  ...localElectionResultsGroup,
                },
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetLocalElectionCandidateResultFlow() {
  yield takeEvery(fetchLocalElectionCandidateResult,
    function* onGetLocalElectionCandidateResult({
      payload: {
        electionType,
        electionYear,
        electionRound,
        electionUnitNumber,
        countyId,
        municipalityId,
        settlementId,
      },
    }) {
      yield put(setFetchingLocalElectionCandidateResult({
        year: electionYear,
        round: electionRound,
        type: electionType,
      }));

      try {
        const candidateResult = yield getLocalElectionCandidateResult(
          electionType,
          electionYear,
          electionRound,
          electionUnitNumber,
          countyId,
          municipalityId,
          settlementId,
        );

        const details = yield select(getResultDetails);
        const localElectionResult = yield select(getLocalElectionResult);

        const calculatePercent = (value, comparedValue) =>
          ((value * 100) / (comparedValue)).toFixed(2);

        const chartData = candidateResult.map(item => ({
          key: v1(),
          text: item.candidateName,
          percent: calculatePercent(
            item.numberOfVotes,
            localElectionResult[electionYear][electionRound][electionType]
              .totalVoterCount,
          ),
        }));

        yield put(
          requestSuccess({
            response: {
              resultDetails: {
                ...details,
                localElection: {
                  ...localElectionResult,
                  [electionYear]: {
                    ...localElectionResult[electionYear],
                    [electionRound]: {
                      ...localElectionResult[electionYear][electionRound],
                      [electionType]: {
                        ...localElectionResult[electionYear][electionRound][electionType],
                        fetchingCandidate: false,
                        candidateResults: candidateResult,
                        chartData,
                      },
                    },
                  },
                },
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

export default function* resultsSaga() {
  yield all([
    onGetParliamentaryResultFlow(),
    onGetPresidentialResultFlow(),
    onGetLocalElectionResultFlow(),
    onGetLocalElectionCandidateResultFlow(),
    onGetEuroParliamentaryResultFlow(),
    onGetNoteResultFlow(),
    onCreateNoteResultFlow(),
    onUpdateNoteResultFlow(),
    onDeleteNoteResultFlow(),
    onGetContactInfoFlow(),
  ]);
}
