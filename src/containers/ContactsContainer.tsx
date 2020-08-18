import React, { useEffect, useState } from 'react';
import Contacts from '../components/Contacts';
import { Contact } from '../redux/types/Contact';

const ContactsContainer = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, firstName: "fname1", lastName: "lname1" },
    { id: 2, firstName: "fname2", lastName: "lname2" }
  ]);
  const [hasErrors, setErrors] = useState(false);
  const contentType = 'application/json';
  const apiToken = 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0';
  const contactsUrl = 'https://sahmed93846.api-us1.com/api/3/contacts';
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';

  async function fetchContactsData() {
    // const res = await fetch(proxyurl + contactsUrl, {
    //   headers: {
    //     "Content-Type": contentType,
    //     "Api-Token": apiToken
    //   }
    // });
    // res
    //   .json()
    //   .then((response) => setContacts(response.contacts))
    //   .catch((error) => setErrors(error));
  }

  console.log(contacts);

  async function fetchContactData() {
    const res = await fetch(proxyurl + contactsUrl, {
      headers: {
        "Content-Type": contentType,
        "Api-Token": apiToken
      }
    });
    res
      .json()
      .then((response) => setContacts(response.contacts))
      .catch((error) => setErrors(error));
  }

  useEffect(() => {
    fetchContactsData();
  });

  useEffect(()=>{
  
  }, []);

  return <>
    <Contacts contactsData={contacts}/>
    {hasErrors && <div>There is error while loading data.</div>}
    </>
}

export default ContactsContainer;