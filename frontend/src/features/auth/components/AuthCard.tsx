import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-[380px] rounded-xl border border-zinc-200 bg-white p-9 shadow-sm">
      {children}
    </div>
  );
}
