import contactsReducer from './contactsReducer';
import {combineReducers} from 'redux';

//Combine all the sub reducers
const rootReducer = combineReducers({
    contacts: contactsReducer,
})

export default rootReducer;