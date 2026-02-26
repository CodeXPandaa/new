import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { projectService } from '../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  // analytics data comes from projects themselves
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsRes = await projectService.getProjectsByTeacher();
      setProjects(projectsRes.data);
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

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // filtering
  const filteredProjects = projects.filter((p) => {
    let ok = true;
    if (selectedSemester) {
      ok = ok && String(p.semester) === String(selectedSemester);
    }
    if (searchTerm) {
      ok = ok && p.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return ok;
  });

  const studentSet = new Set();
  filteredProjects.forEach(p => p.students?.forEach(s => studentSet.add(s)));
  const studentCount = studentSet.size;

  const pendingProjects = filteredProjects.filter(p => p.status === 'pending');
  const approvedProjects = filteredProjects.filter(p => p.status === 'approved');
  const atRiskProjects = filteredProjects.filter(p => p.progress < 40);

  // semester distribution based on filter
  const semesterDistribution = [];
  for (let i = 1; i <= 8; i++) {
    semesterDistribution.push({ name: `Sem ${i}`, value: filteredProjects.filter(p => p.semester === i).length });
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* sidebar */}
      <aside className="w-64 bg-white shadow-md fixed inset-y-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600 mb-8">CodexHub</h2>
          <nav className="space-y-4">
            <button className="w-full text-left text-gray-700 hover:text-blue-600">Dashboard</button>
            <button className="w-full text-left text-gray-700 hover:text-blue-600">Projects</button>
            <button className="w-full text-left text-gray-700 hover:text-blue-600">Analytics</button>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col ml-64">
        {/* top navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-blue-600">CodexHub</span>
            <select
              value={selectedSemester}
              onChange={handleSemesterChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="">All Semesters</option>
              {[...Array(8)].map((_, i) => (
                <option key={i} value={i + 1}>Sem {i + 1}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded px-2 py-1 w-64"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-6 overflow-auto">
          {/* top stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Active Projects</h3>
              <p className="text-3xl font-bold text-blue-600">{approvedProjects.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Students</h3>
              <p className="text-3xl font-bold text-blue-600">{studentCount}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Approvals</h3>
              <p className="text-3xl font-bold text-blue-600">{pendingProjects.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">At‑Risk Projects</h3>
              <p className="text-3xl font-bold text-blue-600">{atRiskProjects.length}</p>
            </div>
          </div>

          {/* analytics section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Overall Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Approved', value: approvedProjects.length },
                      { name: 'Pending', value: pendingProjects.length },
                      { name: 'Completed', value: filteredProjects.filter(p => p.status === 'completed').length },
                    ]}
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

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Semester Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={semesterDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* bottom area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* recent proposals table */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Recent Project Proposals</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Title</th>
                    <th className="py-2">Students</th>
                    <th className="py-2">Semester</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProjects.map(p => (
                    <tr key={p._id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{p.title}</td>
                      <td className="py-2">{p.students?.length || 0}</td>
                      <td className="py-2">{p.semester}</td>
                      <td className="py-2 flex gap-2">
                        <button
                          onClick={() => handleApprove(p._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                        >Approve</button>
                        <button
                          onClick={() => handleReject(p._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        >Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* needs attention */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Needs Attention</h3>
              <div className="space-y-4">
                {atRiskProjects.map(p => (
                  <div key={p._id} className="">
                    <h4 className="font-semibold">{p.title}</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {atRiskProjects.length === 0 && <p className="text-gray-500">No flagged projects.</p>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
