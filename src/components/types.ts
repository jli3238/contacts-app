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
  width?: number | string;
  /** Minimum column width in px. */
  minWidth?: number;
  /** Maximum column width in px. */
  maxWidth?: number;
  cellClass?: string | ((row: TRow) => string);
  headerCellClass?: string;
  /** Formatter to be used to render the cell content */
  formatter?: React.ComponentType<FormatterProps<TRow>>;
  formatterOptions?: {
    focusable?: boolean;
  };
  /** Enables cell editing. If set and no editor property specified, then a textinput will be used as the cell editor */
  editable?: boolean | ((row: TRow) => boolean);
  /** Determines whether column is frozen or not */
  frozen?: boolean;
  /** Enable resizing of a column */
  resizable?: boolean;
   /** Enable sorting of a column */
   sortable?: boolean;
   /** Sets the column sort order to be descending instead of ascending the first time the column is sorted */
   sortDescendingFirst?: boolean;
   /** Editor to be rendered when cell of column is being edited. If set, then the column is automatically set to be editable */
   editor?: React.ComponentType<EditorProps<TRow[keyof TRow], TRow>>;
   /** Header renderer for each header cell */
   headerRenderer?: React.ComponentType<HeaderRendererProps<TRow>>;
   /** Component to be used to filter the data of the column */
   filterRenderer?: React.ComponentType<FilterRendererProps<TRow, any>>;
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
  isCellSelected: boolean;
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
  onCommit: (e: CommitEvent) => void;
  onCommitCancel: () => void;
}

interface SelectedCellPropsBase {
  idx: number;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

interface SelectedCellPropsEdit extends SelectedCellPropsBase {
  mode: 'EDIT';
  editorContainerProps: SharedEditorContainerProps;
}

interface SelectedCellPropsSelect extends SelectedCellPropsBase {
  mode: 'SELECT';
  dragHandleProps?: Pick<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown' | 'onDoubleClick'>;
}

export type SelectedCellProps = SelectedCellPropsEdit | SelectedCellPropsSelect;

export interface CellRendererProps<TRow> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  rowIdx: number;
  column: CalculatedColumn<TRow>;
  lastFrozenColumnIndex: number;
  row: TRow;
  isRowSelected: boolean;
  isCopied: boolean;
  isDraggedOver: boolean;
  eventBus: EventBus;
  selectedCellProps?: SelectedCellProps;
  onRowClick?: (rowIdx: number, row: TRow, column: CalculatedColumn<TRow>) => void;
}

export interface RowRendererProps<TRow> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  viewportColumns: readonly CalculatedColumn<TRow>[];
  row: TRow;
  cellRenderer?: React.ComponentType<CellRendererProps<TRow>>;
  copiedCellIdx?: number;
  draggedOverCellIdx?: number;
  rowIdx: number;
  isRowSelected: boolean;
  eventBus: EventBus;
  lastFrozenColumnIndex: number,
  selectedCellProps?: SelectedCellProps;
  top: number;
  onRowClick?: (rowIdx: number, row: TRow, column: CalculatedColumn<TRow>) => void;
  rowClass?: (row: TRow) => string | undefined;
  setDraggedOverRowIdx?: (overRowIdx: number) => void;
}

export interface FilterRendererProps<TRow, TFilterValue = unknown> {
  column: CalculatedColumn<TRow>;
  value: TFilterValue;
  onChange: (value: TFilterValue) => void;
}

export type Filters = Record<string, any>;

export interface CommitEvent<TUpdatedValue = never> {
  cellKey: string;
  rowIdx: number;
  updated: TUpdatedValue;
}

export interface RowsUpdateEvent<TUpdatedValue = never> {
  cellKey: string;
  fromRow: number;
  toRow: number;
  updated: TUpdatedValue;
  action: UpdateActions;
  fromCellKey?: string;
}

export interface CheckCellIsEditableEvent<TRow> extends Position {
  row: TRow;
  column: CalculatedColumn<TRow>;
}

export interface SelectRowEvent {
  rowIdx: number;
  checked: boolean;
  isShiftClick: boolean;
}