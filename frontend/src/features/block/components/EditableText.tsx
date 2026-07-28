"use client";

import clsx from "clsx";
import { forwardRef, useEffect, useRef, type FocusEvent, type KeyboardEvent } from "react";

interface EditableTextProps {
  value: string;
  placeholder?: string;
  onCommit: (value: string) => void;
  // When provided, Enter commits the text and calls this instead of inserting a line break.
  onEnter?: () => void;
  // When provided, Backspace on an already-empty block calls this instead of doing nothing.
  onDeleteEmpty?: () => void;
  autoFocus?: boolean;
  className?: string;
}

// Moves focus and the caret to the end of an EditableText's content. Used to
// land the cursor in a sensible place after the block it was in disappears
// (e.g. deleted via backspace).
export function focusEditableAtEnd(el: HTMLDivElement | null): void {
  if (!el) return;
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export const EditableText = forwardRef<HTMLDivElement, EditableTextProps>(function EditableText(
  { value, placeholder, onCommit, onEnter, onDeleteEmpty, autoFocus, className },
  forwardedRef,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
    // Only focus on mount, when this is a genuinely new block - never re-focus on rerenders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setRefs(node: HTMLDivElement | null) {
    ref.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    const text = e.currentTarget.textContent ?? "";
    if (text !== value) onCommit(text);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (onDeleteEmpty && e.key === "Backspace" && e.currentTarget.textContent === "") {
      e.preventDefault();
      onDeleteEmpty();
      return;
    }
    if (!onEnter || e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    const text = e.currentTarget.textContent ?? "";
    if (text !== value) onCommit(text);
    onEnter();
  }

  return (
    <div
      ref={setRefs}
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
});
