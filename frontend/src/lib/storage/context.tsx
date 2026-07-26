"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Storage } from "./types";

interface StorageContextValue {
  storage: Storage;
  // Builds the route to a page in the current mode (e.g. /guest/3 vs
  // /workspace/1/3). Injected by the route layout so shared components
  // never know which mode they are running in.
  pageHref: (pageId: number) => string;
}

const StorageContext = createContext<StorageContextValue | null>(null);

interface StorageProviderProps extends StorageContextValue {
  children: ReactNode;
}

export function StorageProvider({ storage, pageHref, children }: StorageProviderProps) {
  const value = useMemo(() => ({ storage, pageHref }), [storage, pageHref]);
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
