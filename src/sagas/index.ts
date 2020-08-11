import { put, takeLatest, all } from 'redux-saga/effects';

function* fetchContacts() {

  const json = yield fetch('https://sahmed93846.api-us1.com/api/3/contacts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0'
    }
  })
    .then(response => response.json());

  yield put({ type: "CONTACTS_RECEIVED", json: json.contacts || [{ error: json.message }] });
}

function* actionWatcher() {
  yield takeLatest('GET_CONTACTS', fetchContacts)
}

export default function* rootSaga() {
  yield all([
    actionWatcher(),
  ]);
}