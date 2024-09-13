import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-navy-900 p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="text-right">
          <button onClick={onClose} className="text-gray-500 dark:text-white">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
