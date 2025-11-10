"use client";
import React, { useEffect, useState } from "react";
import useMenuStore from "@/stores/menuStore";
import type { Menu } from "@/types/menu";
import { MenuTree } from "./MenuTree";
import { Folder, LayoutGrid, Plus, ChevronDown, ChevronUp } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import MenuFormPanel from "./MenuFormPanel";

export default function MenuPage() {
  const { menus, loadMenus, deleteMenu } = useMenuStore();
  const [query, setQuery] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({
    open: false,
  });

  const [showList, setShowList] = useState(true); // 👈 toggle untuk mobile

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-4 mb-6 mt-4 font-medium">
        <Folder size={28} className="text-[#D0D5DD]" />
        <span className="text-[#D0D5DD]">/</span>
        <span className="text-gray-700">Menus</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-[#0051AF] rounded-full flex items-center justify-center">
          <LayoutGrid size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menus</h1>
        </div>
      </div>

      {/* Mobile toggle icon */}
      <div className="md:hidden flex items-center justify-start px-2 mb-3">
        <button
          onClick={() => setShowList((v) => !v)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
        >
          <div className="p-3 rounded-full border bg-white shadow-sm active:scale-95">
            {showList ? (
              <ChevronUp size={28} className="text-gray-600" />
            ) : (
              <ChevronDown size={28} className="text-gray-600" />
            )}
          </div>
          <span className="font-medium text-sm">
            {showList ? "Hide Menu List" : "Show Menu List"}
          </span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row border rounded-xl overflow-hidden">
        {/* LEFT SIDE - Menu list */}
        <div
          className={`transition-all duration-300 ${
            showList ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
          } md:max-h-full w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r overflow-y-auto`}
        >
          {/* Search and create */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search menus..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              onClick={() => {
                setMode("create");
                setSelectedMenu({
                  id: "0",
                  name: "",
                  parentId: null,
                  order: null,
                });
              }}
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Menu</span>
            </button>
          </div>

          {/* Table / Tree */}
          <MenuTree
            menus={menus}
            search={query}
            onEdit={(m) => {
              setMode("edit");
              setSelectedMenu(m);
            }}
            onCreate={(parentId) => {
              setMode("create");
              setSelectedMenu({
                id: "0",
                name: "",
                parentId,
                order: null,
              });
            }}
            onDelete={(id) => setConfirm({ open: true, id })}
          />
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="w-full md:w-1/2 p-6 border-t md:border-t-0 bg-white overflow-y-auto">
          {mode ? (
            <MenuFormPanel
              mode={mode}
              menu={selectedMenu}
              onClose={() => {
                setMode(null);
                setSelectedMenu(null);
              }}
            />
          ) : (
            <div className="text-gray-400 flex items-center justify-center h-full text-center">
              Select or create a menu to edit.
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirm.open}
        title="Delete menu?"
        message="This will delete the menu and all its children. Continue?"
        onCancel={() => setConfirm({ open: false })}
        onConfirm={async () => {
          if (confirm.id) await deleteMenu(confirm.id);
          setConfirm({ open: false });
        }}
      />
    </div>
  );
}
