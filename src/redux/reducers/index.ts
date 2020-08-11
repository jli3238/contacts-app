// import { Action } from 'redux';
import { Contact } from '../types/Contact';

const initialState: Contact[] = [];

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'GET_CONTACTS':
      return { ...state, loading: true };
    case 'CONTACTS_RECEIVED':
      return { ...state, contacts: action.json[0], loading: false }
    default:
      return state;
  }
};

export default reducer;