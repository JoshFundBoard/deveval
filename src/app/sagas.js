import {
  fork, put, call, takeEvery,
} from 'redux-saga/effects';
import axios from 'axios';
import * as types from './actionTypes';

function postChoices(info) {
  const { choices, name } = info;
  const data = {
    records: [
      {
        fields: {
          name,
          choices,
        },
      },
    ],
  };

  if (!Array.isArray(data.records)) throw new Error('A records array is required.');
  data.records.forEach(r => {
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
    data,
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
  } catch (error) {
    yield put({ type: types.AIRTABLE_GET_FAILED, error });
  }
}

function* workPostAirTable(action) {
  try {
    const result = yield call(() => postChoices(action.payload));
    const { data } = result;
    if (data.error) throw new Error(data.error);
    const { name, choices } = data.records[0].fields;
    const message = `Hi ${name}, ${choices.join(', ')} are great choices!`;
    yield put({ type: types.AIRTABLE_POST_SUCCEEDED, message });
  } catch (error) {
    yield put({ type: types.AIRTABLE_POST_FAILED, error });
  }
}

export function* watchGetAirTable() {
  yield takeEvery(types.AIRTABLE_GET_REQUESTED, workGetAirTable);
}

export function* watchPostAirTable() {
  yield takeEvery(types.AIRTABLE_POST_REQUESTED, workPostAirTable);
}

export default function* rootSaga() {
  yield fork(watchGetAirTable);
  yield fork(watchPostAirTable);
}
