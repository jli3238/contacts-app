import { useMemo } from 'react';
import { CalculatedColumn } from '../types';
import { getColumnMetrics, getHorizontalRangeToRender, getViewportColumns } from '../utils';
import { DataGridProps } from '../DataGrid';

type SharedDataGridProps<R, K extends keyof R> =
  Pick<DataGridProps<R, K>, 'columns'> &
  Required<Required<Pick<DataGridProps<R, K>, | 'minColumnWidth' | 'defaultFormatter' >>>;

interface ViewportColumnsArgs<R, K extends keyof R> extends SharedDataGridProps<R, K> {
  viewportWidth: number;
  scrollLeft: number;
  columnWidths: ReadonlyMap<string, number>;
}

export function useViewportColumns<R, K extends keyof R>({
  columns: rawColumns,
  minColumnWidth,
  columnWidths,
  viewportWidth,
  defaultFormatter,
  scrollLeft
}: ViewportColumnsArgs<R, K>) {
  const { columns, lastFrozenColumnIndex, totalColumnWidth } = useMemo(() => {
    return getColumnMetrics<R>({
      columns: rawColumns,
      minColumnWidth,
      viewportWidth,
      columnWidths,
      defaultFormatter
    });
  }, [columnWidths, rawColumns, defaultFormatter, minColumnWidth, viewportWidth]);
  
  const [colOverscanStartIdx, colOverscanEndIdx] = useMemo((): [number, number] => {
    return getHorizontalRangeToRender(
      columns,
      lastFrozenColumnIndex,
      viewportWidth,
      scrollLeft
    );
  }, [scrollLeft, columns, lastFrozenColumnIndex, viewportWidth]);

  const viewportColumns = useMemo((): readonly CalculatedColumn<R>[] => {
    return getViewportColumns(
      columns,
      colOverscanStartIdx,
      colOverscanEndIdx
    );
  }, [colOverscanEndIdx, colOverscanStartIdx, columns]);

  return { columns, viewportColumns, totalColumnWidth, lastFrozenColumnIndex };
}
