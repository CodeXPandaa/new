import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { projectService, analyticsService } from '../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, analyticsRes] = await Promise.all([
        projectService.getProjectsByTeacher(),
        analyticsService.getTeacherAnalytics(),
      ]);
      setProjects(projectsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (projectId) => {
    try {
      await projectService.approveProject(projectId);
      fetchData();
    } catch (error) {
      console.error('Error approving project:', error);
    }
  };

  const handleReject = async (projectId) => {
    try {
      await projectService.rejectProject(projectId);
      fetchData();
    } catch (error) {
      console.error('Error rejecting project:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const pendingProjects = projects.filter(p => p.status === 'pending');
  const approvedProjects = projects.filter(p => p.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Teacher Dashboard</h1>
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
        {/* Analytics Summary */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Projects</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.totalProjects}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Approved</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.approvedProjects}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Approval</h3>
              <p className="text-3xl font-bold text-yellow-600">{analytics.pendingProjects}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Completed</h3>
              <p className="text-3xl font-bold text-purple-600">{analytics.completedProjects}</p>
            </div>
          </div>
        )}

        {/* Charts */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Project Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Projects per Semester</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.semesterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Pending Approvals */}
        {pendingProjects.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Pending Approvals ({pendingProjects.length})</h3>
            <div className="space-y-4">
              {pendingProjects.map((project) => (
                <div key={project._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{project.title}</h4>
                    <p className="text-gray-600">{project.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Students: {project.students?.length || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(project._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(project._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Projects */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Active Projects ({approvedProjects.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedProjects.map((project) => (
              <div
                key={project._id}
                className="border border-gray-200 p-4 rounded-lg cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <h4 className="font-bold text-lg mb-2">{project.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-600">Progress</span>
                  <span className="text-lg font-bold text-blue-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
