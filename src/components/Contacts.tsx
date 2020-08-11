import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Column, RowsUpdateEvent, CalculatedColumn } from './types';
import { UpdateActions } from './enums';
import { SelectColumn } from './Columns';
import DataGrid, { DataGridHandle } from './DataGrid';
import { ImageFormatter } from './formatters';
import { AutoSizer } from 'react-virtualized';
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

function isAtBottom(event: React.UIEvent<HTMLDivElement>): boolean {
  const target = event.target as HTMLDivElement;
  return target.clientHeight + target.scrollTop === target.scrollHeight;
}

function loadMoreRows(newRowsCount: number, length: number): Promise<Row[]> {
  return new Promise(resolve => {
    const newRows: Row[] = [];
    for (let i = 0; i < newRowsCount; i++) {
      newRows[i] = createFakeRowObjectData(i + length);
    }
    setTimeout(() => resolve(newRows), 1000);
  });
}

export default function Contacts() {
  const [rows, setRows] = useState<Row[]>(createRows(200));
  const [selectedRows, setSelectedRows] = useState(() => new Set<string>());
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef<DataGridHandle>(null);

  const columns = useMemo((): Column<Row>[] => [ 
    SelectColumn,
    // {
    //   key: 'id',
    //   name: 'ID',
    //   width: 50
    // },
    {
      key: 'avatar',
      name: 'Contact',
      width: 40,
      formatter: ({ row }) => <ImageFormatter value={row.avatar} />
    },
    {
      key: 'contact',
      name: '',
      width: 270
    },
    {
      key: 'totalValue',
      name: 'Total Value',
      width: 150
    },
    {
      key: 'location',
      name: 'Location',
      width: 350
    },
    {
      key: 'deals',
      name: 'Deals',
      width: 50
    },
    {
      key: 'tags',
      name: 'Tags',
    }
  ], []);

  const handleRowUpdate = useCallback(({ fromRow, toRow, updated, action }: RowsUpdateEvent<Partial<Row>>): void => {
    const newRows = [...rows];
    let start: number;
    let end: number;

    if (action === UpdateActions.COPY_PASTE) {
      start = toRow;
      end = toRow;
    } else {
      start = Math.min(fromRow, toRow);
      end = Math.max(fromRow, toRow);
    }

    for (let i = start; i <= end; i++) {
      newRows[i] = { ...newRows[i], ...updated };
    }

    setRows(newRows);
  }, [rows]);

  const handleRowClick = useCallback((rowIdx: number, row: Row, column: CalculatedColumn<Row>) => {
    if (column.key === 'title') {
      gridRef.current?.selectCell({ rowIdx, idx: column.idx }, true);
    }
  }, []);

  async function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (!isAtBottom(event)) return;

    setIsLoading(true);

    const newRows = await loadMoreRows(50, rows.length);

    setRows([...rows, ...newRows]);
    setIsLoading(false);
  }

  return (
    <>
      <AutoSizer>
        {({ height, width }) => (
          <>
            <DataGrid
              ref={gridRef}
              columns={columns}
              rows={rows}
              rowKey="id"
              onRowsUpdate={handleRowUpdate}
              onRowClick={handleRowClick}
              rowHeight={46}
              width={width}
              height={height - 40}
              selectedRows={selectedRows}
              onScroll={handleScroll}
              onSelectedRowsChange={setSelectedRows}
              rowClass={row => row.id.includes('7') ? 'highlight' : undefined}
              enableCellCopyPaste
              enableCellDragAndDrop
            />
            {isLoading && <div className="load-more-rows-tag">Loading more rows...</div>}
          </>
        )}
      </AutoSizer>
    </>
  );
}