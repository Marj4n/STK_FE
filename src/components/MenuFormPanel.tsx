"use client";
import { useState, useEffect } from "react";
import useMenuStore from "@/stores/menuStore";
import type { Menu } from "@/types/menu";

type Props = {
  mode: "create" | "edit";
  menu: Menu | null;
  onClose: () => void;
};

export default function MenuFormPanel({ mode, menu, onClose }: Props) {
  const createMenu = useMenuStore((s) => s.createMenu);
  const updateMenu = useMenuStore((s) => s.updateMenu);

  const [name, setName] = useState(menu?.name ?? "");

  const isEdit = mode === "edit";

  useEffect(() => {
    const t = setTimeout(() => {
      setName(menu?.name ?? "");
    }, 0);
    return () => clearTimeout(t);
  }, [menu?.name]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700">Menu ID</p>
        <input
          readOnly
          className="w-full border px-3 py-2 rounded bg-gray-50 text-gray-500"
          value={isEdit ? menu?.id : "(auto)"}
        />
      </div>
      {isEdit && menu && (
        <div>
          <p className="text-sm font-medium text-gray-700">Parent</p>
          <input
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-50 text-gray-500"
            value={menu?.parentNames || "(root)"}
          />
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-700">Name</p>
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter menu name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button
        onClick={async () => {
          if (!name.trim()) return;
          if (isEdit && menu) {
            await updateMenu(menu.id, { name });
          } else {
            await createMenu({ name, parentId: menu?.parentId ?? null });
          }
          onClose();
        }}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}
