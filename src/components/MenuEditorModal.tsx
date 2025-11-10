"use client";
import { useState } from "react";
import type { Menu } from "@/types/menu";
import useMenuStore from "@/stores/menuStore";

type Props = {
  open: boolean;
  initial?: Menu | { id: "0"; name: string; parentId?: string | null };
  onClose: () => void;
};

export default function MenuEditorModal({ open, initial, onClose }: Props) {
  const create = useMenuStore((s) => s.createMenu);
  const update = useMenuStore((s) => s.updateMenu);
  const menus = useMenuStore((s) => s.menus);

  const [name, setName] = useState(() => initial?.name ?? "");

  if (!open) return null;

  const isEdit = Boolean(initial && "id" in initial && initial.id !== "0");

  const getAutoOrder = () => {
    if (isEdit && initial && "order" in initial && initial.order !== null) {
      return initial.order;
    }

    // untuk create
    if (!initial || !initial.parentId) {
      const roots = menus.filter((m) => m.parentId === null);
      return roots.length + 1;
    }
    const siblings = menus.filter((m) => m.parentId === initial.parentId);
    return siblings.length + 1;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded p-4 w-full max-w-md">
        <h3 className="text-lg font-semibold">
          {isEdit ? "Edit Menu" : "Create Menu"}
        </h3>
        <div className="mt-3 space-y-2">
          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <div className="text-sm text-gray-400">
            Order will be set automatically: {getAutoOrder()}
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2">
            Cancel
          </button>
          <button
            onClick={async () => {
              const payload = {
                name,
                parentId: initial?.parentId ?? null,
                order: getAutoOrder(),
              };

              if (isEdit && initial && "id" in initial) {
                await update(initial.id, payload);
              } else {
                await create(payload);
              }
              onClose();
            }}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            {isEdit ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
