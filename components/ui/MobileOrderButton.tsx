'use client';

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OrderSummary from "../order/OrderSummary";
import { useStore } from "@/src/store";

export function MobileOrderButton() {
  const [open, setOpen] = useState(false);
  const order = useStore((state) => state.order);
  
  const itemsCount = order.length;

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      {itemsCount > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed bottom-5 right-5 z-40
                     bg-black text-white px-5 py-3 rounded-full shadow-lg
                     flex items-center gap-2"
        >
          <span>Mi orden</span>

          {/* Badge */}
          <span className="bg-white text-black text-sm font-bold px-2 py-0.5 rounded-full">
            {itemsCount}
          </span>
        </button>
      )}

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* PANEL */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50
                         bg-white rounded-t-2xl
                         max-h-[85vh] overflow-y-auto p-5"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black">Mi orden</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-500"
                >
                  Cerrar
                </button>
              </div>

              <OrderSummary />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
