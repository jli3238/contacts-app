import React, { useState, useMemo, useRef } from 'react';
import { Column } from './types';
import { SelectColumn } from './Columns';
import DataGrid, { DataGridHandle } from './DataGrid';
import { ImageFormatter } from './formatters';
import { AutoSizer } from 'react-virtualized';
import { Contact } from '../redux/types/Contact';
import faker from 'faker';

interface Row {
  id: string;
  avatar: string;
  contact: string;
  totalValue: string;
  location: string;
  deals: number;
  tags: string;
}

function createFakeRowObjectData(index: number): Row {
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

function createRows(numberOfRows: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = createFakeRowObjectData(i);
  }
  return rows;
}

interface ContactsProps {
  contactsData: Contact[];
}

export default function Contacts({ contactsData }: ContactsProps) {
  const [rows] = useState<Row[]>(createRows(52));
  const [selectedRows, setSelectedRows] = useState(() => new Set<string>());
  const gridRef = useRef<DataGridHandle>(null);

  const columns = useMemo((): Column<Row>[] => [ 
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

  return (
    <>
      <AutoSizer>
        {({ height, width }) => (
          <DataGrid
            ref={gridRef}
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
        )}
      </AutoSizer>
    </>
  );
}