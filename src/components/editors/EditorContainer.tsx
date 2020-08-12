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
  onCommit,
  onCommitCancel,
  scrollLeft,
  scrollTop,
  firstEditorKeyPress: key
}: EditorContainerProps<R>) {
  const editorRef = useRef<Editor>(null);
  const changeCommitted = useRef(false);
  const changeCanceled = useRef(false);
  const [isValid, setValid] = useState(true);
  const prevScrollLeft = useRef(scrollLeft);
  const prevScrollTop = useRef(scrollTop);
  const isUnmounting = useRef(false);
  const onClickCapture = useClickOutside(commit);

  const getInputNode = useCallback(() => editorRef.current?.getInputNode(), []);

  const commitCancel = useCallback(() => {
    changeCanceled.current = true;
    onCommitCancel();
  }, [onCommitCancel]);

  useLayoutEffect(() => {
    const inputNode = getInputNode();

    if (inputNode instanceof HTMLElement) {
      inputNode.focus();
    }
    if (inputNode instanceof HTMLInputElement) {
      inputNode.select();
    }
  }, [getInputNode]);

  // close editor when scrolling
  useEffect(() => {
    if (scrollLeft !== prevScrollLeft.current || scrollTop !== prevScrollTop.current) {
      commitCancel();
    }
  }, [commitCancel, scrollLeft, scrollTop]);

  useEffect(() => () => {
    isUnmounting.current = true;
  }, []);

  // commit changes when editor is closed
  useEffect(() => () => {
    if (isUnmounting.current && !changeCommitted.current && !changeCanceled.current) {
      commit();
    }
  });

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

  function commit(): void {
    if (!editorRef.current) return;
    const updated = editorRef.current.getValue();
    if (isNewValueValid(updated)) {
      changeCommitted.current = true;
      const cellKey = column.key;
      onCommit({ cellKey, rowIdx, updated });
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (preventDefaultNavigation(e.key)) {
      e.stopPropagation();
    } else if (['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      commit();
    } else if (e.key === 'Escape') {
      commitCancel();
    }
  }

  const className = clsx('rdg-editor-container', {
    'rdg-editor-invalid': !isValid
  });

  return (
    <div
      className={className}
      style={{ height: rowHeight, width: column.width, left, top }}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
      onContextMenu={preventDefault}
    >
    </div>
  );
}
