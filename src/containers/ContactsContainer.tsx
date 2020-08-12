import React, { useEffect } from 'react';
import Contacts from '../components/Contacts'
import { useSelector, useDispatch } from 'react-redux';
import constants from '../redux/actionConstants';

const ContactsContainer = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch({type: constants.GET_CONTACTS});
  }, [dispatch]);
  const contactList = useSelector(state => state.contacts.contactList);

  return <Contacts contactsData={contactList}/>;
}

export default ContactsContainer;