import React, { createElement } from 'react';
import clsx from 'clsx';
import { CalculatedColumn } from './types';
import { HeaderRowProps } from './HeaderRow';

type SharedHeaderRowProps<R> = Pick<HeaderRowProps<R, never>,
| 'allRowsSelected'
>;

export interface HeaderCellProps<R> extends SharedHeaderRowProps<R> {
  column: CalculatedColumn<R>;
  onAllRowsSelectionChange: (checked: boolean) => void;
}

export default function HeaderCell<R>({
  column,
  allRowsSelected,
  onAllRowsSelectionChange,
}: HeaderCellProps<R>) {
  function getCell() {
    if (!column.headerRenderer) return column.name;

    return createElement(column.headerRenderer, { column, allRowsSelected, onAllRowsSelectionChange });
  }

  let cell = getCell();

  const className = clsx('rdg-cell', column.headerCellClass);

  const style: React.CSSProperties = {
    width: column.width,
    left: column.left
  };

  cell = (
    <div
      role="columnheader"
      aria-colindex={column.idx + 1}
      className={className}
      style={style}
    >
      {cell}
    </div>
  );
  
  return cell;
}
