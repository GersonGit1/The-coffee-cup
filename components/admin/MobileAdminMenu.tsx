'use client';

import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileAdminMenu({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* OVERLAY */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.aside
            className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-end p-4">
              <button onClick={onClose} className="text-sm text-gray-500">
                Cerrar
              </button>
            </div>

            <AdminSidebar />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
