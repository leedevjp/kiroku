import { create } from "zustand";

interface SidebarState {
  expandedPageIds: Set<number>;
  toggleExpanded: (pageId: number) => void;
  // Whether the sidebar drawer is open on mobile. Ignored on desktop, where
  // the sidebar is always visible.
  mobileOpen: boolean;
  toggleMobileOpen: () => void;
  closeMobile: () => void;
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
  mobileOpen: false,
  toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
  closeMobile: () => set({ mobileOpen: false }),
}));
