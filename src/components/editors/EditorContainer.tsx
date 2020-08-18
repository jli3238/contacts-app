import React, { KeyboardEvent, useRef, useState, useLayoutEffect, useCallback, useEffect } from 'react';
import clsx from 'clsx';

import { CalculatedColumn, Editor, Omit, SharedEditorContainerProps } from '../types';
import { useClickOutside } from '../hooks';
import { preventDefault } from '../utils';

export interface EditorContainerProps<R> extends Omit<SharedEditorContainerProps, 'editorPortalTarget'> {
  rowIdx: number;
  row: R;
  column: CalculatedColumn<R>;
  top: number;
  left: number;
}

export default function EditorContainer<R>({
  rowIdx,
  column,
  row,
  rowHeight,
  left,
  top,
  scrollLeft,
  scrollTop,
  firstEditorKeyPress: key
}: EditorContainerProps<R>) {
  const editorRef = useRef<Editor>(null);
  const [isValid, setValid] = useState(true);
  const isUnmounting = useRef(false);

  const getInputNode = useCallback(() => editorRef.current?.getInputNode(), []);

  useLayoutEffect(() => {
    const inputNode = getInputNode();

    if (inputNode instanceof HTMLElement) {
      inputNode.focus();
    }
    if (inputNode instanceof HTMLInputElement) {
      inputNode.select();
    }
  }, [getInputNode]);

  useEffect(() => () => {
    isUnmounting.current = true;
  }, []);

  function isCaretAtBeginningOfInput(): boolean {
    const inputNode = getInputNode();
    return inputNode instanceof HTMLInputElement
      && inputNode.selectionEnd === 0;
  }

  function isCaretAtEndOfInput(): boolean {
    const inputNode = getInputNode();
    return inputNode instanceof HTMLInputElement
      && inputNode.selectionStart === inputNode.value.length;
  }

  function editorHasResults(): boolean {
    return editorRef.current?.hasResults?.() ?? false;
  }

  function editorIsSelectOpen(): boolean {
    return editorRef.current?.isSelectOpen?.() ?? false;
  }

  function isNewValueValid(value: unknown): boolean {
    const isValid = editorRef.current?.validate?.(value);
    if (typeof isValid === 'boolean') {
      setValid(isValid);
      return isValid;
    }
    return true;
  }

  function preventDefaultNavigation(key: string): boolean {
    return (key === 'ArrowLeft' && !isCaretAtBeginningOfInput())
      || (key === 'ArrowRight' && !isCaretAtEndOfInput())
      || (key === 'Escape' && editorIsSelectOpen())
      || (['ArrowUp', 'ArrowDown'].includes(key) && editorHasResults());
  }

  const className = clsx('rdg-editor-container', {
    'rdg-editor-invalid': !isValid
  });

  return (
    <div
      className={className}
      style={{ height: rowHeight, width: column.width, left, top }}
    >
    </div>
  );
}
