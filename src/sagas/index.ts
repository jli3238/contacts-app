import { put, takeLatest, all, fork } from 'redux-saga/effects';
import contactsConstants from '../redux/actionConstants/ContactsConstants';
import contactConstants from '../redux/actionConstants/ContactsConstants';
import contactDealsConstants from '../redux/actionConstants/ContactsConstants';
import contactTabNumbersConstants from '../redux/actionConstants/ContactsConstants';
import contactTagConstants from '../redux/actionConstants/ContactsConstants';


const contentType = 'application/json';
const apiToken = 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0';
const contactsUrl = `https://sahmed93846.api-us1.com/api/3/contacts`;
const tagNameUrl = `https://sahmed93846.api-us1.com/api/3/contactTags/`;
const proxyurl = "https://cors-anywhere.herokuapp.com/";

function* fetchContacts() {
  const json = yield fetch(proxyurl + contactsUrl, {
    method: 'GET',
    headers: {
      'Content-Type': contentType,
      'Api-Token': apiToken
    }
  }).then(response => response.json());

  yield put({ type: constants.GET_CONTACTS_SUCCESS, 
    json: json.contacts || [{ error: json.message }] });
};

function* fetchContact(id: number) {
  const json = yield fetch(`${proxyurl}${contactsUrl}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': contentType,
      'Api-Token': apiToken
    }
  }).then(response => response.json());

  yield put({ type: constants.GET_CONTACT_SUCCESS,
    json: json.contact || [{ error: json.message }] });
//   .then(data => data ? data.contact : data);
// newContact.geoAddresses.city = contactRaw.geoAddresses ? contactRaw.geoAddresses.city : ''; 
// newContact.geoAddresses.state = contactRaw.geoAddresses ? contactRaw.geoAddresses.state : '';
// newContact.geoAddresses.country = contactRaw.geoAddresses ? contactRaw.geoAddresses.country : '';
};

function* fetchDeals(id: number) {
  const json = yield fetch(`${proxyurl}${contactsUrl}/${id}/deals`, {
    method: 'GET',
    headers: {
      'Content-Type': contentType,
      'Api-Token': apiToken
    }
  }).then(response => response.json());
  
  yield put({ type: constants.GET_DEALS_SUCCESS,
    json: json.deals || [{ error: json.message }] });
// .then(data => data ? data.deals : data);
// newContact.deals = dealsRaw.map(item => (({ id, value, currency }) => ({ id, value, currency }))(item));
};

function* fetchContactTagNumbers(id: number) {
  const json = yield fetch(`${proxyurl}${contactsUrl}/${id}/contactTags`, {
    method: 'GET',
    headers: {
      'Content-Type': contentType,
      'Api-Token': apiToken
    }
  }).then(response => response.json());

  yield put({ type: constants.GET_CONTACTTAGNUMBERS_SUCCESS,
    json: json.contactTag || [{ error: json.message }] });
// .then(data => data ? data.contactTags : data);    
// const contactTagNumberObjs = contactTagsRaw.map(item => (({ tag }) => ({ tag }))(item));
};

function* fetchContactTag(tagId: number) {
  const json = yield fetch(`${proxyurl}${tagNameUrl}${tagId}/tag`, {
    method: 'GET',
    headers: {
      'Content-Type': contentType,
      'Api-Token': apiToken
    }
  }).then(response => response.json());

  yield put({ type: constants.GET_CONTACTTAG_SUCCESS,
    json: json.tag.tag || [{ error: json.message }] });
// .then(data => (data && data.tag) ? data.tag.tag : data);
// contactTagsNumbersRaw.push(contactTag);
}

// newContact.contactTags = contactTagsNumbersRaw;
// contacts.push(newContact);

function* actionWatcher() {
  yield fork(constants.GET_CONTACTS, fetchContacts)
}

export default function* rootSaga() {
  yield all([
    actionWatcher(),
  ]);
}