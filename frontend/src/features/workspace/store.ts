import { create } from "zustand";

interface SidebarState {
  expandedPageIds: Set<number>;
  toggleExpanded: (pageId: number) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  expandedPageIds: new Set(),
  toggleExpanded: (pageId) =>
    set((state) => {
      const next = new Set(state.expandedPageIds);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return { expandedPageIds: next };
    }),
}));
