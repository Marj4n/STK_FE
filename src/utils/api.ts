import axios, { AxiosError } from "axios";
import type { Menu } from "@/types/menu";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

/**
 * Helper function untuk handle error API secara konsisten.
 * Gunakan `unknown` agar type-safe tanpa any.
 */
function handleApiError(error: unknown, action: string): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err.response?.data?.message || err.message || "Unknown server error.";
    throw new Error(`${action} failed: ${message}`);
  }

  if (error instanceof Error) {
    throw new Error(`${action} failed: ${error.message}`);
  }

  throw new Error(`${action} failed: Unknown error`);
}

export const fetchMenus = async (): Promise<Menu[]> => {
  try {
    const r = await api.get<Menu[]>("/api/menus");
    return r.data;
  } catch (error: unknown) {
    handleApiError(error, "Fetching menus");
  }
};

export const fetchMenu = async (id: string): Promise<Menu> => {
  try {
    const r = await api.get<Menu>(`/api/menus/${id}`);
    return r.data;
  } catch (error: unknown) {
    handleApiError(error, "Fetching menu");
  }
};

export const createMenu = async (payload: {
  name: string;
  parentId?: string | null;
  order?: number | null;
}): Promise<Menu> => {
  try {
    const r = await api.post<Menu>("/api/menus", payload);
    return r.data;
  } catch (error: unknown) {
    handleApiError(error, "Creating menu");
  }
};

export const updateMenu = async (
  id: string,
  payload: Partial<{
    name: string;
    parentId: string | null;
    order: number | null;
  }>
): Promise<Menu> => {
  try {
    const r = await api.put<Menu>(`/api/menus/${id}`, payload);
    return r.data;
  } catch (error: unknown) {
    handleApiError(error, "Updating menu");
  }
};

export const deleteMenu = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/menus/${id}`);
  } catch (error: unknown) {
    handleApiError(error, "Deleting menu");
  }
};

export const moveMenu = async (
  id: string,
  parentId: string | null
): Promise<Menu> => {
  try {
    const r = await api.patch<Menu>(`/api/menus/${id}/move`, { parentId });
    return r.data;
  } catch (error: unknown) {
    handleApiError(error, "Moving menu");
  }
};

export const reorderMenu = async (
  id: string,
  targetIndex: number,
  newParentId?: string | null
): Promise<Menu[]> => {
  try {
    const r = await api.patch<Menu[]>(`/api/menus/${id}/reorder`, {
      targetIndex,
      newParentId: newParentId ?? null,
    });
    return r.data;
  } catch (error: unknown) {
    handleApiError(error, "Reordering menu");
  }
};
