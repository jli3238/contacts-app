import React from 'react';
import { FormatterProps } from '../types';

export function ValueFormatter<R>(props: FormatterProps<R>) {
  return <>{props.row[props.column.key as keyof R]}</>;
}
