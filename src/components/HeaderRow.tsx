import React, { useCallback, memo } from 'react';
import HeaderCell from './HeaderCell';
import { CalculatedColumn } from './types';
import { assertIsValidKey } from './utils';
import { DataGridProps } from './DataGrid';

type SharedDataGridProps<R, K extends keyof R> = Pick<DataGridProps<R, K>,
  | 'rows'
  | 'onSelectedRowsChange'
  | 'rowKey'
>;

export interface HeaderRowProps<R, K extends keyof R> extends SharedDataGridProps<R, K> {
  allRowsSelected: boolean;
  columns: readonly CalculatedColumn<R>[];
}

function HeaderRow<R, K extends keyof R>({
  columns,
  rows,
  rowKey,
  onSelectedRowsChange,
  allRowsSelected,
}: HeaderRowProps<R, K>) {
  const handleAllRowsSelectionChange = useCallback((checked: boolean) => {
    if (!onSelectedRowsChange) return;
    assertIsValidKey(rowKey);
    const newSelectedRows = new Set<R[K]>();
    if (checked) {
      for (const row of rows) {
        newSelectedRows.add(row[rowKey]);
      }
    }
    onSelectedRowsChange(newSelectedRows);
  }, [onSelectedRowsChange, rows, rowKey]);

  return (
    <div
      role="row"
      aria-rowindex={1} // aria-rowindex is 1 based
      className="rdg-header-row"
    >
      {columns.map(column => {
        return (
          <HeaderCell<R>
            key={column.key}
            column={column}
            allRowsSelected={allRowsSelected}
            onAllRowsSelectionChange={handleAllRowsSelectionChange}
          />
        );
      })}
    </div>
  );
}

export default memo(HeaderRow) as <R, K extends keyof R>(props: HeaderRowProps<R, K>) => JSX.Element;
