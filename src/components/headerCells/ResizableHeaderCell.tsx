import React, { cloneElement } from 'react';
import { CalculatedColumn } from '../types';

export interface ResizableHeaderCellProps<R> {
  children: React.ReactElement<React.ComponentProps<'div'>>;
  column: CalculatedColumn<R>;
  onResize: (column: CalculatedColumn<R>, width: number) => void;
}

export default function ResizableHeaderCell<R>({
  children,
  column,
  onResize
}: ResizableHeaderCellProps<R>) {
  function onMouseDown(event: React.MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    const { currentTarget } = event;
    const { right } = currentTarget.getBoundingClientRect();
    const offset = right - event.clientX;

    if (offset > 11) { // +1px to account for the border size
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      handleResize(event.clientX + offset, currentTarget);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    event.preventDefault();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onTouchStart(event: React.TouchEvent) {
    const touch = event.changedTouches[0];
    const { identifier } = touch;
    const { currentTarget } = event;
    const { right } = currentTarget.getBoundingClientRect();
    const offset = right - touch.clientX;

    if (offset > 11) { // +1px to account for the border size
      return;
    }
  }

  function handleResize(x: number, target: Element) {
    const width = x - target.getBoundingClientRect().left;
    if (width > 0) {
      onResize(column, width);
    }
  }

  return cloneElement(children, {
    onMouseDown,
    onTouchStart,
    children: (
      <>
        {children.props.children}
        <div className="rdg-header-cell-resizer" />
      </>
    )
  });
}
