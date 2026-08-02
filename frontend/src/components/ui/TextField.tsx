"use client";

import clsx from "clsx";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  // Rendered on the right side of the label row (e.g. a "forgot password" link).
  labelAction?: ReactNode;
  error?: string;
}

export function TextField({ label, labelAction, error, className, id, ...props }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={inputId} className="text-[13px] font-medium text-zinc-700">
          {label}
        </label>
        {labelAction}
      </div>
      <input
        id={inputId}
        className={clsx(
          "w-full rounded-md border bg-white px-3 py-2 text-[14px] text-zinc-900 outline-none transition-shadow placeholder:text-zinc-400",
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100",
          className,
        )}
        {...props}
      />
      {error && <div className="mt-1.5 text-[12px] text-red-600">{error}</div>}
    </div>
  );
}
