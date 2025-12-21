'use client';

import { MobileCategoriesButton } from "@/components/order/MobileCategoriesButton";
import { MobileCategoriesDrawer } from "@/components/order/MobileCategoriesDrawer";
import OrderSideBar from "@/components/order/OrderSidebar";
import OrderSummary from "@/components/order/OrderSummary";
import { MobileOrderButton } from "@/components/ui/MobileOrderButton";
import ToastNotification from "@/components/ui/ToastNotification";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  return (
    <>
        <MobileCategoriesButton onClick={() => setCategoriesOpen(true)} />
        <div className="md:flex">
          <aside className="hidden md:block md:w-72 md:h-screen bg-white">
            <OrderSideBar/>
          </aside>
          <main className="md:flex-1 md:h-screen md:overflow-y-scroll p-5">
              {children}
          </main>
          <div className="hidden md:block">
            <OrderSummary />
          </div>
        </div>
        <MobileOrderButton/>

        <MobileCategoriesDrawer
          open={categoriesOpen}
          onClose={() => setCategoriesOpen(false)}
        />
        <ToastNotification/>
    </>
  );
}