import React, { useState } from 'react';

const ProjectCard = ({ project, onViewDetails, onApprove, onReject, onDelete, isTeacher = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800 flex-1">{project.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-lg font-bold text-blue-600">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {project.semester && (
        <p className="text-xs text-gray-500 mb-4">Semester: {project.semester}</p>
      )}

      {isTeacher && project.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.(project._id);
            }}
            className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition"
          >
            Approve
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject?.(project._id);
            }}
            className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition"
          >
            Reject
          </button>
        </div>
      )}

      {!isTeacher && (
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails?.(project._id)}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm font-semibold"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this project?')) {
                onDelete?.(project._id);
              }
            }}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
