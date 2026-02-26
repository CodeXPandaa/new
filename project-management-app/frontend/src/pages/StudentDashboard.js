import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { projectService, authService } from '../services/api';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamMembers: '',
    guide: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchTeachers();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await projectService.getProjectsByStudent();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data } = await authService.getTeachers();
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);
    try {
      const teamMembersArray = formData.teamMembers
        .split(',')
        .map(m => m.trim())
        .filter(m => m);
      const payload = {
        title: formData.title,
        description: formData.description,
        teamMembers: teamMembersArray,
      };
      if (formData.guide) payload.guide = formData.guide;

      const res = await projectService.requestProject(payload);
      if (res && (res.status === 201 || res.status === 200)) {
        setSuccessMessage('Your project is sent successfully');
        setShowRequestForm(false);
        setFormData({ title: '', description: '', teamMembers: '', guide: '' });
        fetchProjects();
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrorMessage('Failed to send project request');
      }
    } catch (error) {
      console.error('Error requesting project:', error);
      setErrorMessage(error.response?.data?.message || 'Error requesting project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      setSuccessMessage('Project deleted successfully');
      fetchProjects();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting project:', error);
      setErrorMessage(error.response?.data?.message || 'Error deleting project');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            {showRequestForm ? 'Cancel' : 'Request New Project'}
          </button>
        </div>

        {showRequestForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Request New Project</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Project Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Team Members (comma separated emails)"
                value={formData.teamMembers}
                onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.guide}
                onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project Guide (optional)</option>
                {teachers.map(t => (
                  <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={submitting}
                className={`w-full ${submitting ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded-lg transition`}
              >
                {submitting ? 'Sending…' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  project.status === 'approved' ? 'bg-green-100 text-green-800' :
                  project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
                <span className="text-sm text-gray-500">Progress: {project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/project/${project._id}`);
                  }}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm font-semibold"
                >
                  View Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      handleDeleteProject(project._id);
                    }
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects yet. Request your first project!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
