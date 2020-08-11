import { Column, CalculatedColumn, FormatterProps, Omit } from '../types';
import { getScrollbarSize } from './domUtils';

interface Metrics<R> {
  columns: readonly Column<R>[];
  columnWidths: ReadonlyMap<string, number>;
  minColumnWidth: number;
  viewportWidth: number;
  defaultFormatter: React.ComponentType<FormatterProps<R>>;
}

interface ColumnMetrics<TRow> {
  columns: readonly CalculatedColumn<TRow>[];
  lastFrozenColumnIndex: number;
  totalColumnWidth: number;
}

export function getColumnMetrics<R>(metrics: Metrics<R>): ColumnMetrics<R> {
  let left = 0;
  let totalWidth = 0;
  let allocatedWidths = 0;
  let unassignedColumnsCount = 0;
  let lastFrozenColumnIndex = -1;
  const columns: Array<Omit<Column<R>, 'width'> & { width: number | undefined }> = [];

  for (const metricsColumn of metrics.columns) {
    let width = getSpecifiedWidth(metricsColumn, metrics.columnWidths, metrics.viewportWidth );

    if (width === undefined) {
      unassignedColumnsCount++;
    } else {
      width = clampColumnWidth(width, metricsColumn, metrics.minColumnWidth);
      allocatedWidths += width;
    }

    const column = { ...metricsColumn, width };
    if (column.frozen) {
      lastFrozenColumnIndex++;
      columns.splice(lastFrozenColumnIndex, 0, column);
    } else {
      columns.push(column);
    }
  }

  const unallocatedWidth = metrics.viewportWidth - allocatedWidths - getScrollbarSize();
  const unallocatedColumnWidth = Math.max(
    Math.floor(unallocatedWidth / unassignedColumnsCount),
    metrics.minColumnWidth
  );

  const calculatedColumns: CalculatedColumn<R>[] = columns.map((column, idx) => {
    // Every column should have a valid width at this stage
    const width = column.width ?? clampColumnWidth(unallocatedColumnWidth, column, metrics.minColumnWidth);
    const newColumn = {
      ...column,
      idx,
      width,
      left,
      formatter: column.formatter ?? metrics.defaultFormatter
    };
    totalWidth += width;
    left += width;
    return newColumn;
  });

  return {
    columns: calculatedColumns,
    lastFrozenColumnIndex,
    totalColumnWidth: totalWidth
  };
}

function getSpecifiedWidth<R>(
  { key, width }: Column<R>,
  columnWidths: ReadonlyMap<string, number>,
  viewportWidth: number
): number | undefined {
  if (columnWidths.has(key)) {
    // Use the resized width if available
    return columnWidths.get(key);
  }
  if (typeof width === 'number') {
    return width;
  }
  if (typeof width === 'string' && /^\d+%$/.test(width)) {
    return Math.floor(viewportWidth * parseInt(width, 10) / 100);
  }
  return undefined;
}

function clampColumnWidth<R>(
  width: number,
  { minWidth, maxWidth }: Column<R>,
  minColumnWidth: number
): number {
  width = Math.max(width, minWidth ?? minColumnWidth);

  if (typeof maxWidth === 'number') {
    return Math.min(width, maxWidth);
  }

  return width;
}

// Logic extented to allow for functions to be passed down in column.editable
// this allows us to decide whether we can be editing from a cell level
export function canEdit<R>(column: CalculatedColumn<R>, row: R): boolean {
  if (typeof column.editable === 'function') {
    return column.editable(row);
  }
  return Boolean(column.editor || column.editable);
}

export function getColumnScrollPosition<R>(columns: readonly CalculatedColumn<R>[], idx: number, currentScrollLeft: number, currentClientWidth: number): number {
  let left = 0;
  let frozen = 0;

  for (let i = 0; i < idx; i++) {
    const column = columns[i];
    if (column) {
      if (column.width) {
        left += column.width;
      }
    }
  }

  const selectedColumn = columns[idx];
  if (selectedColumn) {
    const scrollLeft = left - frozen - currentScrollLeft;
    const scrollRight = left + selectedColumn.width - currentScrollLeft;

    if (scrollLeft < 0) {
      return scrollLeft;
    }
    if (scrollRight > currentClientWidth) {
      return scrollRight - currentClientWidth;
    }
  }

  return 0;
}
