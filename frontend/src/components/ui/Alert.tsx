import type { ReactNode } from "react";

// Inline error banner used above forms (e.g. failed login).
export function ErrorAlert({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">
      {children}
    </div>
  );
}
