"use client";

import clsx from "clsx";
import { useEffect, useRef, type FocusEvent, type KeyboardEvent } from "react";

interface EditableTextProps {
  value: string;
  placeholder?: string;
  onCommit: (value: string) => void;
  // When provided, Enter commits the text and calls this instead of inserting a line break.
  onEnter?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function EditableText({ value, placeholder, onCommit, onEnter, autoFocus, className }: EditableTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
    // Only focus on mount, when this is a genuinely new block - never re-focus on rerenders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    const text = e.currentTarget.textContent ?? "";
    if (text !== value) onCommit(text);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!onEnter || e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    const text = e.currentTarget.textContent ?? "";
    if (text !== value) onCommit(text);
    onEnter();
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={clsx("outline-none", className)}
    >
      {value}
    </div>
  );
}
