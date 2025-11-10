import { create } from "zustand";
import type { Menu } from "@/types/menu";
import * as api from "@/utils/api";

type State = {
  menus: Menu[];
  loading: boolean;
  error: string | null;
  openMap: Record<string, boolean>; // simpan open/close tiap node
  loadMenus: () => Promise<void>;
  createMenu: (data: {
    name: string;
    parentId?: string | null;
  }) => Promise<void>;
  updateMenu: (
    id: string,
    data: Partial<{ name: string; parentId: string | null }>
  ) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
  reorderMenu: (
    id: string,
    targetIndex: number,
    newParentId?: string | null
  ) => Promise<void>;
  findById: (id: string) => Menu | undefined;
  setOpen: (id: string, value: boolean) => void;
};

const flatten = (menus: Menu[]): Menu[] => {
  const out: Menu[] = [];
  const walk = (list: Menu[]) => {
    for (const m of list) {
      out.push(m);
      if (m.children && m.children.length) walk(m.children);
    }
  };
  walk(menus);
  return out;
};

const useMenuStore = create<State>((set, get) => ({
  menus: [],
  loading: false,
  error: null,
  openMap: {},
  setOpen: (id, value) =>
    set((state) => ({ openMap: { ...state.openMap, [id]: value } })),
  loadMenus: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.fetchMenus();
      set({ menus: data });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load menus";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  createMenu: async (data) => {
    set({ loading: true });
    try {
      await api.createMenu(data);
      await get().loadMenus();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create menu";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  updateMenu: async (id, data) => {
    set({ loading: true });
    try {
      await api.updateMenu(id, data);
      await get().loadMenus();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update menu";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  deleteMenu: async (id) => {
    set({ loading: true });
    try {
      await api.deleteMenu(id);
      await get().loadMenus();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete menu";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  reorderMenu: async (id, targetIndex, newParentId) => {
    set({ loading: true });
    try {
      await api.reorderMenu(id, targetIndex, newParentId);
      await get().loadMenus();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to reorder menu";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  findById: (id) => flatten(get().menus).find((m) => m.id === id),
}));

export default useMenuStore;
