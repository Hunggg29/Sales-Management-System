import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: ReactNode;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  closeOnBackdropClick = true,
  showCloseButton = true 
}: ModalProps) => {
  const handleBackdropClick = () => {
    if (closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-full max-w-md bg-white rounded-xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className={`bg-red-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center ${showCloseButton ? 'justify-between' : 'justify-center'} sticky top-0 z-10`}>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {title}
              </h2>
              {showCloseButton && onClose && (
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                >
                  <MdClose className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
