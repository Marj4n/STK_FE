"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: number;
  name: string;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, name }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 border rounded bg-white shadow hover:bg-gray-50 cursor-grab flex items-center justify-between"
    >
      <span>{name}</span>
      <span className="text-gray-400 text-sm">⋮⋮</span>
    </li>
  );
};
