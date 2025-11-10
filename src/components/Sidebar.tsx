"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, Folder, FileText, Users, Menu, X } from "lucide-react";
import clsx from "clsx";

const mainMenus = [
  { name: "Systems", icon: Folder },
  { name: "System Code", icon: LayoutGrid },
  { name: "Properties", icon: FileText },
  { name: "Menus", icon: LayoutGrid },
  { name: "API List", icon: LayoutGrid },
];

const bottomMenus = [
  { name: "Users & Group", icon: Users },
  { name: "Competition", icon: Folder },
];

export default function Sidebar() {
  const [active, setActive] = useState("Menus");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={clsx(
          "fixed md:static z-50 top-0 left-0 h-full md:h-auto w-[270px] flex flex-col items-center pt-8 md:my-5 md:ml-5 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="absolute inset-0 bg-[#0051AF] rounded-none md:rounded-3xl" />

        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Header */}
          <div className="flex items-center justify-between w-full md:px-10 px-5 mb-10">
            <Image
              src="/stk-logo.svg"
              alt="STK Logo"
              width={90}
              height={30}
              priority
            />
            <button
              className="text-white/90 md:hidden"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
            {/* hapus kalau mobile */}
            <Menu size={22} className="text-white/90 hidden md:block" />
            {/*  */}
          </div>
          {/* Inner Blue */}
          <div className="bg-[#045FC8] w-[220px] rounded-3xl py-3 flex flex-col gap-1 shadow-md">
            {mainMenus.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.name;
              return (
                <Link
                  key={item.name}
                  href="#"
                  onClick={() => {
                    setActive(item.name);
                    setOpen(false); // tutup saat klik di mobile
                  }}
                  className={clsx(
                    "font-bold flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                    isActive
                      ? "bg-white text-[#101828] shadow-sm"
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <Icon
                    size={20}
                    className={clsx(isActive ? "text-[#0051AF]" : "text-white")}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="w-[220px] mt-3 flex flex-col gap-1">
            {bottomMenus.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.name;
              return (
                <Link
                  key={item.name}
                  href="#"
                  onClick={() => {
                    setActive(item.name);
                    setOpen(false);
                  }}
                  className={clsx(
                    "font-bold flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                    isActive
                      ? "bg-white text-[#101828] shadow-sm"
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <Icon
                    size={20}
                    className={clsx(isActive ? "text-[#0051AF]" : "text-white")}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
