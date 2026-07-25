"use client";

import clsx from "clsx";
import type { FocusEvent } from "react";

interface EditableTextProps {
  value: string;
  placeholder?: string;
  onCommit: (value: string) => void;
  className?: string;
}

export function EditableText({ value, placeholder, onCommit, className }: EditableTextProps) {
  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    const text = e.currentTarget.textContent ?? "";
    if (text !== value) onCommit(text);
  }

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={handleBlur}
      className={clsx("outline-none", className)}
    >
      {value}
    </div>
  );
}
