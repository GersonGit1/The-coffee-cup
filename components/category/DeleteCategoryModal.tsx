import { motion, AnimatePresence } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export function DeleteCategoryModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white p-6 rounded-xl w-80"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <p className="text-lg font-semibold">¿Eliminar categoría?</p>
            <p className="text-sm text-gray-600 mt-2">
              Esta acción no eliminará las órdenes anteriores, solo ocultará el la categoría y sus productos asociados.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}