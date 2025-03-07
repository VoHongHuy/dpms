import {
  takeLatest,
  all,
  put,
  delay,
  call,
  throttle,
  select,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import {
  setFetching,
  requestSuccess,
  requestFailed as requestFailedAction,
  fetchMembers,
  fetchMember,
  addMember,
  updateMember,
  deleteMember,
  uploadDocuments,
  deleteDocument,
  downloadDocument,
  getDocuments,
  getMemberSelected,
  fetchFilteredMembers,
  exportMembers,
  setExecuting,
  fetchBirthdayMembers,
  getBirthdayMembers,
  fetchProviders,
  getFetching,
} from '@/redux/ducks/members.duck';
import { api } from '@/services';
import { PATHS } from '@/constants';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';
import { PATHS as DASHBOARD_PATHS } from '@/containers/Dashboard/constants';
import { odataFilter } from '@/utils';
import { PAYMENT_STATUSES } from '@/constants/member';

const requestFailed = args =>
  requestFailedAction({ ...args, scope: ERROR_CODE_SCOPES.MANAGEMENT });

const generateMemberFilters = (filters) => {
  const {
    PaymentTransactions: paymentFilters,
    ...memberFilters
  } = filters;
  const filtersOdata = odataFilter.compile(memberFilters || {}, {
    electionUnit: odataFilter.types.equal,
    invited: odataFilter.types.equal,
    countryId: odataFilter.types.equal,
    countyId: odataFilter.types.equal,
    municipalityId: odataFilter.types.equal,
    settlementId: odataFilter.types.equal,
    districtId: odataFilter.types.equal,
    joinedDateFrom: odataFilter.types.ge,
    joinedDateTo: odataFilter.types.le,
  }, {
    joinedDateFrom: 'createdTime',
    joinedDateTo: 'createdTime',
  });
  if (paymentFilters) {
    const currentYear = (new Date()).getFullYear();
    let paymentFiltersExpression = '';
    if (paymentFilters.status === PAYMENT_STATUSES.NOTPAID.alias) {
      paymentFiltersExpression = `PaymentTransactions/all(p:p/year ne ${currentYear})`;
    } else {
      const statusExpression = {
        [PAYMENT_STATUSES.PAID.alias]: `p/year eq ${currentYear}
          and p/incomingAmount ge p/membershipFee`,
        [PAYMENT_STATUSES.PARTIAL.alias]: `p/year eq ${currentYear}
          and p/incomingAmount gt 0 and p/incomingAmount lt p/membershipFee`,
      };
      const query = [
        paymentFilters.year && `p/year eq ${paymentFilters.year}`,
        paymentFilters.status && statusExpression[paymentFilters.status],
      ].filter(item => !!item).join(' and ');
      paymentFiltersExpression = query ? `PaymentTransactions/any(p:${query})` : '';
    }
    if (filtersOdata.$filter) {
      filtersOdata.$filter += ` and ${paymentFiltersExpression}`;
    } else {
      filtersOdata.$filter = paymentFiltersExpression;
    }
  }

  return filtersOdata;
};

function* onGetMembersFlow() {
  yield takeLatest(fetchMembers, function* onGetMembers({
    payload: { page, rowPerPage, filters = {}, sortOrder = {} } = {},
  }) {
    yield put(setFetching());
    try {
      const filtersOdata = generateMemberFilters(filters);
      const data = yield call(api.get, 'api/member', {
        ...filtersOdata,
        $orderby: sortOrder.column ? `${sortOrder.column} ${sortOrder.sortDirection}` : 'name',
        $skip: page && rowPerPage && (page - 1) * rowPerPage,
        $top: rowPerPage,
        $expand: `Documents($select=id,name),
          Allocations,OrganizationStructure,
          PaymentTransactions($count=true)`,
        $count: true,
      });
      yield put(
        requestSuccess({
          response: { data: data.value, total: data['@odata.count'] },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onGetFilteredMembersFlow() {
  yield takeLatest(fetchFilteredMembers, function* onGetFilteredMembers({
    payload: { filters },
  }) {
    const fetching = select(getFetching);
    try {
      const filtersOdata = generateMemberFilters(filters);
      const data = yield call(api.get, 'api/member', {
        ...filtersOdata,
        $select: 'id',
      });
      yield put(
        requestSuccess({
          response: { filteredMembers: data.value.map(m => m.id) },
          dismiss: true,
          fetching,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onGetBirthDayMembersFlow() {
  yield takeLatest(fetchBirthdayMembers, function* onGetBirthDayMembers() {
    yield put(setFetching());
    const members = yield select(getBirthdayMembers);
    if (members.length === 0) {
      try {
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1;
        const filters = {
          'day(dateOfBirth)': currentDay,
          'month(dateOfBirth)': currentMonth,
        };
        const filtersOdata = odataFilter.compile(filters, {
          'day(dateOfBirth)': odataFilter.types.equal,
          'month(dateOfBirth)': odataFilter.types.equal,
        });
        const data = yield call(api.get, 'api/member', {
          ...filtersOdata,
          $orderby: 'name',
        });
        yield put(
          requestSuccess({
            response: { birthdayMembers: data.value },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    }
  });
}

function* getMemberDocuments(memberId) {
  try {
    const documents = yield call(api.get, 'api/member', {
      $filter: `id eq '${memberId}'`,
      $select: 'Documents',
      $expand: 'Documents',
    });

    return documents;
  } catch (error) {
    yield put(requestFailed({ error, dismiss: true }));
    yield put(replace(PATHS.NOT_FOUND));
  }

  return undefined;
}

function* onGetMemberFlow() {
  yield takeLatest(fetchMember, function* onGetMember({
    payload: { id, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      const selectedMember = yield call(api.get, `api/memberDetails('${id}')`);
      const documents = yield getMemberDocuments(id);
      yield callback(true);
      yield put(
        requestSuccess({
          response: {
            selectedMember: {
              ...selectedMember,
              documents:
                (documents &&
                  documents.value[0] &&
                  documents.value[0].documents) ||
                [],
            },
          },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error, dismiss: true }));
      yield put(replace(PATHS.NOT_FOUND));
    }
  });
}

function* handleUploadDocuments(memberId, documents) {
  const formData = new FormData();
  documents.forEach((doc, index) => {
    formData.append(`file${index + 1}`, doc.file);
  });
  yield call(api.post, `api/member/${memberId}/document`, formData, {
    keepBody: true,
    headers: { Accept: 'application/json' },
  });
}

function* onAddNewMemberFlow() {
  yield takeLatest(addMember, function* onAddNewAccout({
    payload: { data, callback = () => {} },
  }) {
    yield put(setFetching());
    const { documents, ...restData } = data;
    let id = '';
    try {
      id = yield call(api.post, 'api/member', restData);
      if (documents && documents.length > 0) {
        yield handleUploadDocuments(id, documents);
      }
      yield callback(true);
      yield put(requestSuccess());
      yield delay(1000);
      yield put(replace(DASHBOARD_PATHS.MEMBERS));
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
      if (id) {
        yield delay(1000);
        yield put(replace(DASHBOARD_PATHS.MEMBERS_EDIT.replace(':id', id)));
      }
    }
  });
}

function* onUpdateMemberFlow() {
  yield takeLatest(updateMember, function* onUpdateMember({
    payload: { data, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      const { id, ...updatedData } = data;
      yield call(api.post, `api/member/${id}`, updatedData);
      yield callback(true);
      yield put(requestSuccess());
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onDeleteMemberFlow() {
  yield takeLatest(deleteMember, function* onDeleteMember({
    payload: { id, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield call(api.delete, `api/member/${id}`);
      yield callback(true);
      yield put(requestSuccess());
      yield delay(1000);
      yield put(replace(DASHBOARD_PATHS.MEMBERS));
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onUploadDocumentFlow() {
  yield takeLatest(uploadDocuments, function* onUploadDocument({
    payload: { memberId, documents, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield handleUploadDocuments(memberId, documents);
      yield callback(true);
      yield put(requestSuccess());
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onDeleteDocumentFlow() {
  yield throttle(2000, deleteDocument, function* onDeleteDocument({
    payload: { memberId, documentId, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield call(api.delete, `api/member/${memberId}/document/${documentId}`);
      yield callback(true);
      yield put(requestSuccess());
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onDownloadDocumentFlow() {
  yield throttle(2000, downloadDocument, function* onDownloadDocument({
    payload: { memberId, documentId, callback = () => {} },
  }) {
    try {
      const response = yield call(
        api.get,
        `api/member/${memberId}/document/${documentId}`,
      );
      if (response.redirected && response.url) {
        window.open(response.url);
      } else {
        throw new Error(JSON.stringify({ code: 10022 }));
      }
      yield callback(true);
      yield put(requestSuccess({ dismiss: true }));
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onGetMemberDocumentsFlow() {
  yield takeLatest(getDocuments, function* onGetMemberDocuments({
    payload: { memberId, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      const selectedMember = yield select(getMemberSelected);
      const documents = yield getMemberDocuments(memberId);
      yield callback(true);
      yield put(
        requestSuccess({
          response: {
            selectedMember: {
              ...selectedMember,
              documents:
                (documents &&
                  documents.value[0] &&
                  documents.value[0].documents) ||
                [],
            },
          },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onExportMemberListFlow() {
  yield takeLatest(exportMembers, function* onExportMembers({
    payload: { filters, fileName },
  }) {
    try {
      yield put(setExecuting({ isExecuting: true }));
      const response = yield call(api.post, 'api/member/export', {
        memberIds: filters.ids,
      });

      response.blob()
        .then(blob => {
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${fileName || 'Members'}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        });
    } catch (error) {
      yield put(requestFailed({ error }));
    } finally {
      yield put(setExecuting({ executing: false }));
    }
  });
}

function* onGetProvidersFlow() {
  yield takeLatest(fetchProviders, function* onGetProviders({
    payload: { name = '' } = {},
  }) {
    if (name) {
      yield put(setFetching());
      try {
        const filtersOdata = {
          $filter: `contains(name, '${name}') eq true or contains(surname, '${name}') eq true`,
        };
        const data = yield call(api.get, 'api/member', {
          ...filtersOdata,
          $select: 'id,name,surname',
        });
        yield put(
          requestSuccess({
            response: { providers: data.value },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    }
  });
}

export default function* membersSaga() {
  yield all([
    onGetMembersFlow(),
    onGetMemberFlow(),
    onAddNewMemberFlow(),
    onUpdateMemberFlow(),
    onDeleteMemberFlow(),
    onUploadDocumentFlow(),
    onDeleteDocumentFlow(),
    onDownloadDocumentFlow(),
    onGetMemberDocumentsFlow(),
    onGetFilteredMembersFlow(),
    onExportMemberListFlow(),
    onGetBirthDayMembersFlow(),
    onGetProvidersFlow(),
  ]);
}
