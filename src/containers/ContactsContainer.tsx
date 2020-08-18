import React, { useEffect, useState, useRef } from 'react';
import Contacts from '../components/Contacts';
import { ContactIdNames } from '../redux/types/ContactIdNames';

const ContactsContainer = () => {
  const [contactIdNamesList, setContactIdNamesList] = useState<ContactIdNames[]>([
    { id: 1, firstName: "fname1", lastName: "lname1" },
    { id: 2, firstName: "fname2", lastName: "lname2" }
  ]);
  const [hasErrors, setErrors] = useState(false);

  const contentType = 'application/json';
  const apiToken = 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0';
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const contactsUrl = 'https://sahmed93846.api-us1.com/api/3/contacts';

  async function fetchContactsData() {
    const res = await fetch(proxyUrl + contactsUrl, {
      headers: {
        "Content-Type": contentType,
        "Api-Token": apiToken
      }
    });
    res
      .json()
      .then(response => setContactIdNamesList(response.contacts))
      .catch((error) => setErrors(error));
  }
  
  useEffect(() => {
    fetchContactsData();
  });

  console.log(contactIdNamesList);

  return <>
    <Contacts 
      contactIdNamesList={contactIdNamesList.map(item => (({ id, firstName, lastName }) => ({ id, firstName, lastName }))(item))}
      apiToken={apiToken}
      contactsUrl={contactsUrl}
      proxyUrl={proxyUrl}
    />
    {hasErrors && <div className='data-loading-error'>There is an error while loading data.</div>}
    </>
}

export default ContactsContainer;