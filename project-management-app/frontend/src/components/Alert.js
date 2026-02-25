import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const bgColor = {
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800',
  }[type];

  return (
    <div className={`border-l-4 ${bgColor} p-4 mb-4 rounded relative`}>
      <div className="flex justify-between items-center">
        <p className="font-semibold">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 font-bold"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
