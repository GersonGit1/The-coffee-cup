'use client';

import AdminSidebar from "@/components/admin/AdminSidebar";
import { MobileAdminMenu } from "@/components/admin/MobileAdminMenu";
import ToastNotification from "@/components/ui/ToastNotification";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER MOBILE */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl font-bold"
        >
          ☰
        </button>
        <span className="font-black">Admin</span>
      </div>

      <div className="md:flex">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block md:w-72 md:h-screen bg-white">
          <AdminSidebar />
        </aside>

        {/* MAIN */}
        <main className="md:flex-1 md:h-screen md:overflow-y-scroll bg-gray-100 p-5">
          {children}
        </main>
      </div>

      {/* MOBILE DRAWER */}
      <MobileAdminMenu open={open} onClose={() => setOpen(false)} />

      <ToastNotification />
    </>
  );
}
