import React from 'react';
import { SelectCellFormatter } from './formatters';
import { Column } from './types';

// TODO: fix type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SelectColumn: Column<any> = {
  key: 'select-row',
  name: '',
  width: 35,
  headerRenderer(props) {
    return (
      <SelectCellFormatter
        aria-label="Select All"
        value={props.allRowsSelected}
        onChange={props.onAllRowsSelectionChange}
      />
    );
  },
  formatter(props) {
    return (
      <SelectCellFormatter
        aria-label="Select"
        tabIndex={-1}
        value={props.isRowSelected}
        onChange={props.onRowSelectionChange}
      />
    );
  }
};
