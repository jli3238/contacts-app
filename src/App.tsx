import React from 'react';
// import { useSelector } from 'react-redux';
// import { createSelector } from 'reselect';

const ContactsContainer = React.lazy(() => import('./containers/ContactsContainer'));

export default function App() {
  return <ContactsContainer />;
}
