import React, { createElement } from 'react';
import clsx from 'clsx';
import { CalculatedColumn } from './types';
import { HeaderRowProps } from './HeaderRow';
import SortableHeaderCell from './headerCells/SortableHeaderCell';
import ResizableHeaderCell from './headerCells/ResizableHeaderCell';
import { SortDirection } from './enums';

function getAriaSort(sortDirection?: SortDirection) {
  switch (sortDirection) {
    case 'ASC':
      return 'ascending';
    case 'DESC':
      return 'descending';
    default:
      return 'none';
  }
}

type SharedHeaderRowProps<R> = Pick<HeaderRowProps<R, never>,
| 'sortColumn'
| 'sortDirection'
| 'onSort'
| 'allRowsSelected'
>;

export interface HeaderCellProps<R> extends SharedHeaderRowProps<R> {
  column: CalculatedColumn<R>;
  lastFrozenColumnIndex: number;
  onResize: (column: CalculatedColumn<R>, width: number) => void;
  onAllRowsSelectionChange: (checked: boolean) => void;
}

export default function HeaderCell<R>({
  column,
  lastFrozenColumnIndex,
  onResize,
  allRowsSelected,
  onAllRowsSelectionChange,
  sortColumn,
  sortDirection,
  onSort
}: HeaderCellProps<R>) {
  function getCell() {
    if (!column.headerRenderer) return column.name;

    return createElement(column.headerRenderer, { column, allRowsSelected, onAllRowsSelectionChange });
  }

  let cell = getCell();

  if (column.sortable) {
    cell = (
      <SortableHeaderCell
        column={column}
        onSort={onSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      >
        {cell}
      </SortableHeaderCell>
    );
  }

  const className = clsx('rdg-cell', column.headerCellClass, {
    'rdg-cell-frozen': column.frozen,
    'rdg-cell-frozen-last': column.idx === lastFrozenColumnIndex
  });

  const style: React.CSSProperties = {
    width: column.width,
    left: column.left
  };

  cell = (
    <div
      role="columnheader"
      aria-colindex={column.idx + 1}
      aria-sort={sortColumn === column.key ? getAriaSort(sortDirection) : undefined}
      className={className}
      style={style}
    >
      {cell}
    </div>
  );

  if (column.resizable) {
    cell = (
      <ResizableHeaderCell
        column={column}
        onResize={onResize}
      >
        {cell as React.ReactElement<React.ComponentProps<'div'>>}
      </ResizableHeaderCell>
    );
  }
  
  return cell;
}
