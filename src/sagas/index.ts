import { put, takeLatest, all } from 'redux-saga/effects';
import constants from '../redux/actionConstants';
import { Contact } from '../redux/types/Contact';

const contentType = 'application/json';
const apiToken = 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0';
const contactsUrl = `https://sahmed93846.api-us1.com/api/3/contacts`;
const contactUrl = `https://sahmed93846.api-us1.com/api/3/contact/`;
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
  
  const contacts = json.contacts.map(async item => {
    const newContact: Contact = {
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      deals: [
      ],
      contactTags: [],
      geoAddresses: {
        city: '',
        state: '',
        country: ''
      }
    };
    // const contactRaw = await fetch(`${proxyurl}${contactUrl}${item.id}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': contentType,
    //     'Api-Token': apiToken
    //   }
    // }).then(response => response.json()).then(data => data ? data.contact : data);
    // newContact.geoAddresses.city = contactRaw.geoAddresses.city; 
    // newContact.geoAddresses.state = contactRaw.geoAddresses.state;
    // newContact.geoAddresses.country = contactRaw.geoAddresses.country;
    // const dealsRaw = await fetch(`${proxyurl}${contactUrl}${item.id}/deals`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': contentType,
    //     'Api-Token': apiToken
    //   }
    // }).then(response => response.json()).then(data => data ? data.deals :data);
    // newContact.deals = dealsRaw.map(item => (({ id, value, currency }) => ({ id, value, currency }))(item));
    // const contactTagsRaw = await fetch(`${proxyurl}${contactUrl}${item.id}/contactTags`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': contentType,
    //     'Api-Token': apiToken
    //   }
    // }).then(response => response.json()).then(data => data ? data.contactTags : data);    
    // const contactTagNumbers = contactTagsRaw.map(item => (({ tag }) => ({ tag }))(item));
    // newContact.contactTags = contactTagNumbers.map(async num => {
    //   return await fetch(`${proxyurl}${tagNameUrl}${num}/tag`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': contentType,
    //       'Api-Token': apiToken
    //     }
    //   }).then(response => response.json()).then(data => data ? data.tag : data);
    // });
    return newContact;
  });

  yield put({ type: constants.GET_CONTACTS_SUCCESS, json: contacts || [{ error: json.message }] });
};

function* actionWatcher() {
  yield takeLatest(constants.GET_CONTACTS, fetchContacts)
}

export default function* rootSaga() {
  yield all([
    actionWatcher(),
  ]);
}