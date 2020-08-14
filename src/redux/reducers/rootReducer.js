import contactsReducer from './contactsReducer';
import contactReducer from './contactReducer';
import contactDealsReducer from './contactDealsReducer';
import contactTagNumbersReducer from './contactTagNumbersReducer';
import contactTagReducer from './contactTagReducer';

import {combineReducers} from 'redux';

//Combine all the sub reducers
const rootReducer = combineReducers({
    contacts: contactsReducer,
    contact: contactReducer,
    contactDeals: contactDealsReducer,
    contactTagNumbers: contactTagNumbersReducer,
    contactTag: contactTagReducer,

})

export default rootReducer;