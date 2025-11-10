"use client";
import { useMemo } from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import useMenuStore from "@/stores/menuStore";
import type { Menu } from "@/types/menu";

type Props = {
  node: Menu;
  level: number;
  onEdit: (m: Menu) => void;
  onDelete: (id: string) => void;
  onCreate: (parentId: string | null) => void;
  search: string;
  isUpdating: boolean;
};

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function MenuNode({
  node,
  level,
  onEdit,
  onDelete,
  onCreate,
  search,
  isUpdating,
}: Props) {
  const open = useMenuStore((s) => s.openMap[node.id] ?? false);
  const setOpen = useMenuStore((s) => s.setOpen);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDisabled = isDragging || isUpdating;

  const sortedChildren = useMemo(() => {
    return (node.children ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [node.children]);

  return (
    <div className={`relative`}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`group flex items-start gap-2 py-1 relative`}
      >
        {level > 0 && (
          <>
            <div
              className="absolute left-[10px] top-0 bottom-0 w-px bg-gray-400"
              style={{ height: "100%" }}
            />
            <div className="absolute left-[10px] top-[18px] w-4 h-px bg-gray-400" />
          </>
        )}

        <div
          className="flex items-center gap-1 ml-[26px] cursor-pointer"
          onClick={() => sortedChildren.length > 0 && setOpen(node.id, !open)}
        >
          {sortedChildren.length > 0 ? (
            open ? (
              <ChevronDown size={16} className="text-gray-500" />
            ) : (
              <ChevronRight size={16} className="text-gray-500" />
            )
          ) : (
            <span className="inline-block w-[16px]" />
          )}
          <div
            className={`select-none font-medium text-gray-800 hover:text-blue-600`}
            onClick={(e) => {
              e.stopPropagation();
              !isDisabled && onEdit(node);
            }}
          >
            {highlight(node.name, search)}
            <div className="text-xs text-gray-400">ID: {node.id}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity pr-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreate(node.id);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
          <span
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </span>
        </div>
      </div>

      {open && sortedChildren.length > 0 && (
        <div className="ml-8 mt-1 space-y-1 relative before:absolute before:left-[10px] before:top-0 before:bottom-0 before:w-px before:bg-gray-400">
          <SortableContext
            key={node.id + "-" + sortedChildren.map((c) => c.id).join("-")}
            items={sortedChildren.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedChildren.map((c) => (
              <MenuNode
                key={c.id}
                node={c}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onCreate={onCreate}
                search={search}
                isUpdating={isUpdating}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}
