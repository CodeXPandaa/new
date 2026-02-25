import React from 'react';

const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const borderClasses = {
    blue: 'border-blue-200',
    green: 'border-green-200',
    yellow: 'border-yellow-200',
    red: 'border-red-200',
    purple: 'border-purple-200',
  };

  return (
    <div className={`${colorClasses[color]} border-l-4 ${borderClasses[color]} p-6 rounded-lg shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-4xl opacity-50">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
