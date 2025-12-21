'use client';

import { AnimatePresence, motion } from "framer-motion";
import OrderSideBar from "./OrderSidebar";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileCategoriesDrawer({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <OrderSideBar />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
