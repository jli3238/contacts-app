import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useMemo
} from 'react';
import clsx from 'clsx';
import EventBus from './EventBus';
import HeaderRow from './HeaderRow';
import Row from './Row';
import { ValueFormatter } from './formatters';
import {
  assertIsValidKey,
} from './utils';
import {
  CalculatedColumn,
  Column,
  FormatterProps,
  Position,
  RowRendererProps,
  SelectRowEvent,
} from './types';

export interface DataGridHandle {
  scrollToColumn: (colIdx: number) => void;
  scrollToRow: (rowIdx: number) => void;
  selectCell: (position: Position, openEditor?: boolean) => void;
}

type SharedDivProps = Pick<React.HTMLAttributes<HTMLDivElement>,
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
>;

export interface DataGridProps<R, K extends keyof R> extends SharedDivProps {
  /**
   * Grid and data Props
   */
  /** An array of objects representing each column on the grid */
  columns: readonly Column<R>[];
  /** A function called for each rendered row that should return a plain key/value pair object */
  rows: readonly R[];
  /** The primary key property of each row */
  rowKey?: K;
  /**
   * Dimensions props
   */
  /** The width of the grid in pixels */
  width?: number;
  /** The height of the grid in pixels */
  height?: number;
  /** The height of each row in pixels */
  rowHeight?: number;
  /** The height of the header row in pixels */
  headerRowHeight?: number;
  /**
   * Feature props
   */
  /** Set of selected row keys */
  selectedRows?: ReadonlySet<R[K]>;
  /** Function called whenever row selection is changed */
  onSelectedRowsChange?: (selectedRows: Set<R[K]>) => void;
  /**
   * Custom renderers
   */
  defaultFormatter?: React.ComponentType<FormatterProps<R>>;
  rowRenderer?: React.ComponentType<RowRendererProps<R>>;
  /**
   * Miscellaneous
   */
  rowClass?: (row: R) => string | undefined;
}
/**
 * Main API Component to render a data grid of rows and columns
 *
 * @example
 *
 * <DataGrid columns={columns} rows={rows} />
*/
function DataGrid<R, K extends keyof R>({
    // Grid and data Props
    columns: rawColumns,
    rows,
    rowKey,
    // Dimensions props
    width,
    height = 350,
    rowHeight = 46,
    headerRowHeight = 28,
    // Feature props
    selectedRows,
    onSelectedRowsChange,
    // Custom renderers
    defaultFormatter = ValueFormatter,
    rowRenderer: RowRenderer = Row,
    // Miscellaneous
    rowClass,
    // ARIA
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy
}: DataGridProps<R, K>, ref: React.Ref<DataGridHandle>) {
  /**
   * states
   */
  const [eventBus] = useState(() => new EventBus());

  /**
   * refs
   */
  const focusSinkRef = useRef<HTMLDivElement>(null);
  const lastSelectedRowIdx = useRef(-1);

  /**
   * computed values
   */
  const isSelectable = selectedRows !== undefined && onSelectedRowsChange !== undefined;

  const newColumnWidths = new Map();
  rawColumns.forEach(col => {
    newColumnWidths.set(col.key, col.width)
  });
  const columnWidths: ReadonlyMap<string, number> = newColumnWidths;
  const displayWidth = width! - 2; // 2 for border width
  const { columns, displayColumns, totalColumnWidth } = useDisplayColumns({
    columns: rawColumns,
    columnWidths,
    defaultFormatter,
    displayWidth    
  });

  const totalHeaderHeight = headerRowHeight;

  /**
   * effects
   */

  useEffect(() => {
    if (!onSelectedRowsChange) return;

    const handleRowSelectionChange = ({ rowIdx, checked, isShiftClick }: SelectRowEvent) => {
      assertIsValidKey(rowKey);
      const newSelectedRows = new Set(selectedRows);
      const rowId = rows[rowIdx][rowKey];

      if (checked) {
        newSelectedRows.add(rowId);
        const previousRowIdx = lastSelectedRowIdx.current;
        lastSelectedRowIdx.current = rowIdx;
        if (isShiftClick && previousRowIdx !== -1 && previousRowIdx !== rowIdx) {
          const step = Math.sign(rowIdx - previousRowIdx);
          for (let i = previousRowIdx + step; i !== rowIdx; i += step) {
            newSelectedRows.add(rows[i][rowKey]);
          }
        }
      } else {
        newSelectedRows.delete(rowId);
        lastSelectedRowIdx.current = -1;
      }

      onSelectedRowsChange(newSelectedRows);
    };

    return eventBus.subscribe('SELECT_ROW', handleRowSelectionChange);
  }, [eventBus, onSelectedRowsChange, rows, rowKey, selectedRows]);

  /**
   * utils
   */
  type SharedDataGridProps<R, K extends keyof R> =
  Pick<DataGridProps<R, K>, 'columns'> &
  Required<Required<Pick<DataGridProps<R, K>, | 'defaultFormatter'>>>;
  
  interface DisplayColumnsArgs<R, K extends keyof R> extends SharedDataGridProps<R, K> {
    displayWidth: number;
    columnWidths: ReadonlyMap<string, number>
  }

  interface Metrics<R> {
    columns: readonly Column<R>[];
    displayWidth: number;
    columnWidths: ReadonlyMap<string, number>;
    defaultFormatter: React.ComponentType<FormatterProps<R>>;
  }

  interface ColumnMetrics<TRow> {
    columns: readonly CalculatedColumn<TRow>[];
    totalColumnWidth: number;
  }

function getColumnMetrics<R>(metrics: Metrics<R>): ColumnMetrics<R> {
  let left = 0;
  let totalWidth = 0;
  const columns: Array<Omit<Column<R>, 'width'> & { width: number | undefined }> = [];
  
  for (const metricsColumn of metrics.columns) {
    let width = metricsColumn.width;
    const column = { ...metricsColumn, width };
    columns.push(column);
  }
  
  const calculatedColumns: CalculatedColumn<R>[] = columns.map((column, idx) => {
    // Every column should have a valid width as this stage
    const width = column.width ?? 0;
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
    totalColumnWidth: totalWidth
  };
}

  function useDisplayColumns<R, K extends keyof R>({
    columns: rawColumns,
    columnWidths,
    displayWidth,
    defaultFormatter
  }: DisplayColumnsArgs<R, K>) { 
    const { columns, totalColumnWidth } = useMemo(() => {
    return getColumnMetrics<R>({
      columns: rawColumns,
      displayWidth,
      columnWidths,
      defaultFormatter
    })
  }, [rawColumns, displayWidth, columnWidths, defaultFormatter]);

    const displayColumns = useMemo((): readonly CalculatedColumn<R>[] => {
      return getDisplayColumns(columns);
    }, [columns]);
    return { columns, displayColumns, totalColumnWidth };
  }

  function getDisplayColumns<R>(columns: readonly CalculatedColumn<R>[]) {
    const displayColumns: CalculatedColumn<R>[] = [];
    for (let colIdx = 0; colIdx < columns.length; colIdx++){
      const column = columns[colIdx];
      displayColumns.push(column);
    }
    return displayColumns;
  }

  function getDisplayRows() {
    const rowElements = [];
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const row = rows[rowIdx];
      let key: string | number = rowIdx;
      let isRowSelected = false;
      if (rowKey !== undefined) {
        const rowId = row[rowKey];
        isRowSelected = selectedRows?.has(rowId) ?? false;
        if (typeof rowId === 'string' || typeof rowId === 'number') {
          key = rowId;
        }
      }
      rowElements.push(
        <RowRenderer
          aria-rowindex={rowIdx + 2}
          aria-selected={isSelectable ? isRowSelected : undefined}
          key={key}
          rowIdx={rowIdx}
          row={row}
          displayColumns={displayColumns}
          eventBus={eventBus}
          isRowSelected={isRowSelected}
          rowClass={rowClass}
          top={rowIdx * rowHeight + totalHeaderHeight}
        />
      );
    }

    return rowElements;
  }

  return (
    <div
      role="grid"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-multiselectable={isSelectable ? true : undefined}
      aria-colcount={columns.length}
      aria-rowcount={rows.length}
      className={clsx('rdg')}
      style={{
        width,
        height,
        '--header-row-height': `${headerRowHeight}px`,
        '--row-width': `${totalColumnWidth}px`,
        '--row-height': `${rowHeight}px`
      } as React.CSSProperties}
    >
      <HeaderRow<R, K>
        rowKey={rowKey}
        rows={rows}
        columns={displayColumns}
        allRowsSelected={selectedRows?.size === rows.length}
        onSelectedRowsChange={onSelectedRowsChange}
      />
      <div
        ref={focusSinkRef}
        tabIndex={0}
        className="rdg-focus-sink"
      />
      <div style={{ height: rows.length * rowHeight }} />
      {getDisplayRows()}
    </div>
  )
}

export default forwardRef(
  DataGrid as React.RefForwardingComponent<DataGridHandle>
) as <R, K extends keyof R>(props: DataGridProps<R, K> & { ref?: React.Ref<DataGridHandle> }) => JSX.Element;
