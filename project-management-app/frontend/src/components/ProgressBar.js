import React from 'react';

const ProgressBar = ({ progress, size = 'md' }) => {
  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const bgColor = progress >= 80 ? 'bg-green-600' : progress >= 50 ? 'bg-blue-600' : 'bg-yellow-600';

  return (
    <div className={`w-full bg-gray-200 rounded-full ${heightClass}`}>
      <div
        className={`${bgColor} ${heightClass} rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
