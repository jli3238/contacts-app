import React, { memo, useRef, forwardRef } from 'react';
import clsx from 'clsx';
import { CellRendererProps } from './types';
import { useCombinedRefs } from './hooks';

function Cell<R>({
  className,
  column,
  isRowSelected,
  row,
  rowIdx,
  eventBus,
  ...props
}: CellRendererProps<R>, ref: React.Ref<HTMLDivElement>) {
  const cellRef = useRef<HTMLDivElement>(null);

  const { cellClass } = column;
  className = clsx(
    'rdg-cell',
    typeof cellClass === 'function' ? cellClass(row) : cellClass,
    className
  );

  function onRowSelectionChange(checked: boolean, isShiftClick: boolean) {
    eventBus.dispatch('SELECT_ROW', { rowIdx, checked, isShiftClick });
  }

  function getCellContent() {
    return (
      <>
        <column.formatter
          column={column}
          rowIdx={rowIdx}
          row={row}
          isRowSelected={isRowSelected}
          onRowSelectionChange={onRowSelectionChange}
        />
      </>
    );
  }

  return (
    <div
      role="gridcell"
      aria-colindex={column.idx + 1} // aria-colindex is 1-based
      ref={useCombinedRefs(cellRef, ref)}
      className={className}
      style={{
        width: column.width,
        left: column.left
      }}
      {...props}
    >
      {getCellContent()}
    </div>
  );
}

export default memo(forwardRef(Cell)) as <R>(props: CellRendererProps<R>) => JSX.Element;
