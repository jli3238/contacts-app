import React from 'react';
import { UpdateActions } from './enums';
import EventBus from './EventBus';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface Column<TRow> {
  /** Name of the column; displayed in header cell by default */
  name: string;
  /** Unique key to identify the column */
  key: string;
  /** Column width; if not specified, will be determined automatically based on grid width and specified widths of other columns */
  width?: number;
  cellClass?: string | ((row: TRow) => string);
  headerCellClass?: string;
  /** Formatter to be used to render the cell content */
  formatter?: React.ComponentType<FormatterProps<TRow>>;
  /** Editor to be rendered when cell of column is being edited. If set, then the column is automatically set to be editable */
  editor?: React.ComponentType<EditorProps<TRow[keyof TRow], TRow>>;
  /** Header renderer for each header cell */
  headerRenderer?: React.ComponentType<HeaderRendererProps<TRow>>;
}

export interface CalculatedColumn<TRow> extends Column<TRow> {
  idx: number;
  width: number;
  left: number;
  formatter: React.ComponentType<FormatterProps<TRow>>;
}

export interface Position {
  idx: number;
  rowIdx: number;
}

export interface Editor<TValue = never> {
  getInputNode: () => Element | Text | undefined | null;
  getValue: () => TValue;
  hasResults?: () => boolean;
  isSelectOpen?: () => boolean;
  validate?: (value: unknown) => boolean;
  readonly disableContainerStyles?: boolean;
}

export interface FormatterProps<TRow = any> {
  rowIdx: number;
  column: CalculatedColumn<TRow>;
  row: TRow;
  isRowSelected: boolean;
  onRowSelectionChange: (checked: boolean, isShiftClick: boolean) => void;
}

export interface EditorProps<TValue, TRow = any> {
  ref: React.Ref<Editor<{ [key: string]: TValue }>>;
  column: CalculatedColumn<TRow>;
  value: TValue;
  row: TRow;
  height: number;
  onCommit: () => void;
  onCommitCancel: () => void;
  onOverrideKeyDown: (e: KeyboardEvent) => void;
}

export interface HeaderRendererProps<TRow> {
  column: CalculatedColumn<TRow>;
  allRowsSelected: boolean;
  onAllRowsSelectionChange: (checked: boolean) => void;
}

export interface SharedEditorContainerProps {
  editorPortalTarget: Element;
  firstEditorKeyPress: string | null;
  scrollLeft: number;
  scrollTop: number;
  rowHeight: number;
}

export interface CellRendererProps<TRow> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  rowIdx: number;
  column: CalculatedColumn<TRow>;
  row: TRow;
  isRowSelected: boolean;
  eventBus: EventBus;
}

export interface RowRendererProps<TRow> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  displayColumns: readonly CalculatedColumn<TRow>[];
  row: TRow;
  cellRenderer?: React.ComponentType<CellRendererProps<TRow>>;
  rowIdx: number;
  isRowSelected: boolean;
  eventBus: EventBus;
  top: number;
  rowClass?: (row: TRow) => string | undefined;
}

export interface SelectRowEvent {
  rowIdx: number;
  checked: boolean;
  isShiftClick: boolean;
}