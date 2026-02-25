import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-blue-600">
            PM
          </div>
          <h1 className="text-2xl font-bold text-white">Project Management</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="text-white">
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-blue-100 text-xs capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
