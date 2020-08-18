import React, { useState, useMemo, useRef, useEffect, ReactElement } from 'react';
import { Column } from './types';
import { SelectColumn } from './Columns';
import DataGrid, { DataGridHandle } from './DataGrid';
import { ImageFormatter } from './formatters';
import { AutoSizer } from 'react-virtualized';
import { Contact } from '../redux/types/Contact';
import { ContactIdNames } from '../redux/types/ContactIdNames';
import faker from 'faker';

// interface Row {
//   id: string;
//   avatar: string;
//   contact: string;
//   totalValue: string;
//   location: string;
//   deals: number;
//   tags: string;
// }

function createFakeRowObjectData(index) {
  return {
    id: `id_${index}`,
    avatar: faker.image.avatar(),
    contact: `${faker.name.firstName()} ${faker.name.lastName()}`,
    totalValue: (Math.floor(Math.random() * 100000)).toString(),
    location: faker.address.city() + ', ' + faker.address.state() + ', ' + faker.address.country(),
    deals: Math.floor(Math.random() * 10),
    tags: faker.lorem.words()
  };
}

function createRows(numberOfRows) {
  const rows = [];
  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = createFakeRowObjectData(i);
  }
  return rows;
}

// interface ContactsProps {
//   contactIdNamesList: ContactIdNames[];
//   apiToken: string;
//   proxyurl: string;
// }

export default function Contacts({ contactIdNamesList, apiToken, contactsUrl, proxyUrl }) {
  const [contactIdNamesListToShow, setContactIdNamesListToShow] = useState([]);
  const [rows, setRows] = useState(createRows(52));
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const numberOfRowsPerPage = 12;
  const [selectedRows, setSelectedRows] = useState(() => new Set());

  const tagNameUrl = `https://sahmed93846.api-us1.com/api/3/contactTags/`;

  const getContactsToShow = (page) => {
    setLoading(true);
    const idNamesListToShow = contactIdNamesList.slice(numberOfRowsPerPage * page, numberOfRowsPerPage * (page + 1));
    setContactIdNamesListToShow(idNamesListToShow);
    setLoading(false);
  }

  useEffect(() => {
    getContactsToShow(page);
  });

  const contactsToShow = contactIdNamesListToShow.map(async item => {
      const newContact = {
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
    const contactRaw = await fetch(`${proxyUrl}${contactsUrl}/${item.id}`, {
        method: 'GET',
        headers: {
          'Api-Token': apiToken
        }
      }).then(response => response.json()).then(data => data ? data.contact : data);
      newContact.geoAddresses.city = contactRaw.geoAddresses ? contactRaw.geoAddresses.city : ''; 
      newContact.geoAddresses.state = contactRaw.geoAddresses ? contactRaw.geoAddresses.state : '';
      newContact.geoAddresses.country = contactRaw.geoAddresses ? contactRaw.geoAddresses.country : '';
      const dealsRaw = await fetch(`${proxyUrl}${contactsUrl}/${item.id}/deals`, {
        method: 'GET',
        headers: {
          'Api-Token': apiToken
        }
      }).then(response => response.json()).then(data => data ? data.deals :data);
      newContact.deals = dealsRaw.map(item => (({ id, value, currency }) => ({ id, value, currency }))(item));
      const contactTagsRaw = await fetch(`${proxyUrl}${contactsUrl}/${item.id}/contactTags`, {
        method: 'GET',
        headers: {
          'Api-Token': apiToken
        }
      }).then(response => response.json()).then(data => data ? data.contactTags : data);    
      const contactTagNumbers = contactTagsRaw.map(item => (({ tag }) => ({ tag }))(item));
      newContact.contactTags = contactTagNumbers.map(async num => {
        return await fetch(`${proxyUrl}${tagNameUrl}${num}/tag`, {
          method: 'GET',
          headers: {
            'Api-Token': apiToken
          }
        }).then(response => response.json()).then(data => data ? data.tag : data);
      });
      return newContact;
  });

  console.log(contactsToShow);

  const handleScroll = () => {
    const top = scrollRef.current.scrollTop;
    const clientHeight = scrollRef.current.clientHeight;
    const height = scrollRef.current.scrollHeight;
    if(top + clientHeight >= height) {
      const lastContact = contactIdNamesListToShow[contactIdNamesListToShow.length - 1];
      const currentPage = lastContact.id;
      getContactsToShow(currentPage);
      setPage(currentPage);
    }
  }

  const columns = useMemo(() => [
    SelectColumn,
    {
      key: 'avatar',
      name: '',
      width: 40,
      formatter: ({ row }) => <ImageFormatter value={row.avatar} />
    },
    {
      key: 'contact',
      name: 'Contact',
      width: 250
    },
    {
      key: 'totalValue',
      name: 'Total Value',
      width: 100
    },
    {
      key: 'location',
      name: 'Location',
      width: 400
    },
    {
      key: 'deals',
      name: 'Deals',
      width: 100
    },
    {
      key: 'tags',
      name: 'Tags',
      width: 405
    }
  ], []);


  const loadingCSS = { height: "20px", margin: "5px" };
  // To change the loading icon behavior
  const loadingTextCSS = { display: loading ? "block" : "none" };

  return (
    <>
      <AutoSizer>
        {({ height, width }) => (
          <>
            <DataGrid
              ref={scrollRef}
              onScroll={handleScroll} 
              style={{overflowY:"auto", height: "472px"}}
              columns={columns}
              rows={rows}
              rowKey="id"
              rowHeight={46}
              width={width}
              height={height - 40}
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
              rowClass={row => row.id.includes('7') ? 'highlight' : undefined}
            />
            <div style={loadingCSS}>
              <span style={loadingTextCSS}>Loading...</span>
            </div>
          </>
        )}
      </AutoSizer>
    </>
  );
}