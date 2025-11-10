"use client";
import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import MenuNode from "./MenuNode";
import useMenuStore from "@/stores/menuStore";
import type { Menu } from "@/types/menu";

type Props = {
  menus: Menu[];
  onEdit: (m: Menu) => void;
  onDelete: (id: string) => void;
  onCreate: (parentId: string | null) => void;
  search: string;
};

const flattenMenus = (menus: Menu[]): Menu[] => {
  const out: Menu[] = [];
  const walk = (list: Menu[], parentId: string | null = null) => {
    for (const m of list) {
      out.push({ ...m, parentId });
      if (m.children?.length) walk(m.children, m.id);
    }
  };
  walk(menus);
  return out;
};

export const MenuTree: React.FC<Props> = ({
  menus,
  onEdit,
  onDelete,
  onCreate,
  search,
}) => {
  const { reorderMenu, loadMenus } = useMenuStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    setIsUpdating(true);

    try {
      const state = useMenuStore.getState();
      const flatMenus = flattenMenus(state.menus);

      const dragged = flatMenus.find((m) => m.id === active.id);
      const target = flatMenus.find((m) => m.id === over.id);
      if (!dragged || !target) return;

      const newParentId = target.parentId ?? null;

      const siblings = flatMenus
        .filter((m) => m.parentId === newParentId && m.id !== dragged.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      let targetIndex = siblings.findIndex((m) => m.id === target.id);
      if (targetIndex === -1) targetIndex = siblings.length;

      // panggil store untuk reorder
      await reorderMenu(dragged.id, targetIndex, newParentId);

      // reload menu
      await loadMenus();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4">
      {isUpdating && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-md shadow">
          <svg
            className="animate-spin h-4 w-4 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 010 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Updating...</span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={menus.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {menus
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((menu) => (
                <MenuNode
                  key={menu.id}
                  node={menu}
                  level={0}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCreate={onCreate}
                  search={search}
                  isUpdating={isUpdating}
                />
              ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
