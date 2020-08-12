import constants from '../actionConstants';

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

const contactsReducer = (state = initialState, action) => {
  switch (action.type) {
    // request
    case constants.GET_CONTACTS:
    // case constants.GET_CONTACT:
    // case constants.GET_CONTACT_DEALS:
    // case constants.GET_CONTACT_TAGS:
    // case constants.GET_CONTACT_TAG_NAME:
      return { ...state, error: false, loading: true };
    // success
    case constants.GET_CONTACTS_SUCCESS:
      return { ...state, contactList: action.json, error: false, loading: false };
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

export default contactsReducer;