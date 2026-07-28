"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Storage } from "./types";

interface StorageContextValue {
  storage: Storage;
  // Builds the route to a page in the current mode (e.g. /guest/3 vs
  // /workspace/1/3). Injected by the route layout so shared components
  // never know which mode they are running in.
  pageHref: (pageId: number) => string;
  // Route to fall back to when no specific page is selected (e.g. /guest vs
  // /workspace/1). Injected by the route layout for the same reason.
  homeHref: string;
}

const StorageContext = createContext<StorageContextValue | null>(null);

interface StorageProviderProps extends StorageContextValue {
  children: ReactNode;
}

export function StorageProvider({ storage, pageHref, homeHref, children }: StorageProviderProps) {
  const value = useMemo(() => ({ storage, pageHref, homeHref }), [storage, pageHref, homeHref]);
  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

function useStorageContext(): StorageContextValue {
  const context = useContext(StorageContext);
  if (!context) throw new Error("useStorage must be used within a StorageProvider.");
  return context;
}

export function useStorage(): Storage {
  return useStorageContext().storage;
}

export function usePageHref(): (pageId: number) => string {
  return useStorageContext().pageHref;
}

export function useHomeHref(): string {
  return useStorageContext().homeHref;
}
