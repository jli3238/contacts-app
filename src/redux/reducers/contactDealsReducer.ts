import constants from '../actionConstants/ContactsConstants';
import { Contact } from '../types/Contact';

const initialState = {
  contactList: [
    {
    id: 1,
    firstName: '',
    lastName: '',
    },
    {
      id: 2,
      firstName: '',
      lastName: '',
    },
    {
      id: 3,
      firstName: '',
      lastName: '',
    }
  ],
  loading: true,
  error: false
};

const contactDealsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // request
    case constants.GET_DEALS:
    // case constants.GET_CONTACT:
    // case constants.GET_CONTACT_DEALS:
    // case constants.GET_CONTACT_TAGS:
    // case constants.GET_CONTACT_TAG_NAME:
      return { ...state, error: false, loading: true };
    // success
    case constants.GET_DEALS_SUCCESS:          
      const contactsData : Contact[] = action.json.map((item: any) => {
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
        return newContact;
      });
      return { ...state, contactList: contactsData, error: false, loading: false };
    // case constants.GET_CONTACT_SUCCESS:
    //   return { ...state, contacts: {}, error: false, loading: false };
    // case constants.GET_CONTACT_DEALS_SUCCESS:
    //   return { ...state, contacts: {}, error: false, loading: false };
    // case constants.GET_CONTACT_TAGS_SUCCESS:
    //   return { ...state, contacts: {}, error: false, loading: false };
    // case constants.GET_CONTACT_TAG_NAME_SUCCESS:
    //   return { ...state, contacts: {}, error: false, loading: false };
    default:
      return state;
  }
};

export default contactDealsReducer;