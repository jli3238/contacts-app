import React, { memo } from 'react';
import clsx from 'clsx';
import Cell from './Cell';
import { RowRendererProps } from './types';

function Row<R>({
  cellRenderer: CellRenderer = Cell,
  className,
  eventBus,
  rowIdx,
  isRowSelected,
  row,
  displayColumns,
  rowClass,
  onMouseEnter,
  top,
  'aria-rowindex': ariaRowIndex,
  'aria-selected': ariaSelected,
  ...props
}: RowRendererProps<R>) {
  className = clsx(
    'rdg-row',
    `rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'}`,
    { 'rdg-row-selected': isRowSelected },
    rowClass?.(row),
    className
  );

  return (
    <div
      role="row"
      aria-rowindex={ariaRowIndex}
      aria-selected={ariaSelected}
      className={className}
      style={{ top }}
      {...props}
    >
      {displayColumns.map(column => (
        <CellRenderer
          key={column.key}
          rowIdx={rowIdx}
          column={column}
          row={row}
          isRowSelected={isRowSelected}
          eventBus={eventBus}
        />
      ))}
    </div>
  );
}

export default memo(Row) as <R>(props: RowRendererProps<R>) => JSX.Element;
