import {
  fork,
  put,
  call,
  takeEvery,
  delay,
} from 'redux-saga/effects';
import axios from 'axios';
import * as types from './actionTypes';

function postChoices(data) {
  const postData = {
    records: [
      {
        fields: {
          name: data.user,
          choices: data.chosenDesserts,
        },
      },
    ],
  };

  if (!Array.isArray(postData.records)) throw new Error('A records array is required.');
  postData.records.forEach(r => {
    if (!r.fields.name) throw new Error('A name is required.');
    if (!Array.isArray(r.fields.choices)) throw new Error('A choices array is required.');
    if (r.fields.choices.length < 3) throw new Error('Three choices are required.');
  });

  return axios({
    method: 'post',
    url: 'https://api.airtable.com/v0/appGSCyWcJcgauVi2/results',
    headers: {
      Authorization: 'Bearer keym1B881Ly2v7cNw',
    },
    data: postData,
  });
}

function getMenu() {
  return axios({
    method: 'get',
    url: 'https://api.airtable.com/v0/appGSCyWcJcgauVi2/desserts',
    headers: {
      Authorization: 'Bearer keym1B881Ly2v7cNw',
    },
  });
}

function* workGetAirTable() {
  try {
    const result = yield call(getMenu);

    const { data } = result;

    if (data.error) throw new Error(data.error);
    yield put({ type: types.AIRTABLE_GET_SUCCEEDED, data });
    yield delay(1500);
    yield put({ type: types.AIRTABLE_GET_DISMISSED });
  } catch (error) {
    yield put({ type: types.AIRTABLE_GET_FAILED, error });
  }
}

export function* watchGetAirTable() {
  yield takeEvery(types.AIRTABLE_GET_REQUESTED, workGetAirTable);
}

function* workPostAirTable(postData) {
  try {
    const result = yield call(postChoices, postData);

    const { data } = result;

    if (data.error) throw new Error(data.error);
    yield put({ type: types.AIRTABLE_POST_SUCCEEDED, data });
    yield delay(1500);
    yield put({ type: types.AIRTABLE_POST_DISMISSED });
  } catch (error) {
    yield put({ type: types.AIRTABLE_POST_FAILED, error });
  }
}

export function* watchPostAirTable() {
  yield takeEvery(types.AIRTABLE_POST_REQUESTED, workPostAirTable);
}

export default function* rootSaga() {
  yield fork(watchGetAirTable);
  yield fork(watchPostAirTable);
}
