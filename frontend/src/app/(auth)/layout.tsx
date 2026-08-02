import Link from "next/link";
import type { ReactNode } from "react";

// Shared centered layout for the auth screens (login / register):
// Kiroku logo on top, card content below.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-5 py-16">
      <Link href="/" className="mb-9 flex items-center gap-2">
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-md bg-indigo-600 text-[13px] font-bold text-white">
          K
        </div>
        <span className="text-[16px] font-bold text-zinc-900">Kiroku</span>
      </Link>
      {children}
    </div>
  );
}
