import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, wprService } from '../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [wprs, setWprs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWPRForm, setShowWPRForm] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Initialize project setup', completed: true },
    { id: 2, text: 'Define project scope', completed: true },
    { id: 3, text: 'Research and planning', completed: false },
    { id: 4, text: 'Development phase', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [wprData, setWprData] = useState({
    weekNumber: '',
    progressDescription: '',
    file: null,
  });

  const milestones = [
    { name: 'Synopsis', completed: project?.progress >= 10 },
    { name: 'WPR', completed: project?.progress >= 30 },
    { name: 'Mid Review', completed: project?.progress >= 50 },
    { name: 'Final Report', completed: project?.progress >= 80 },
    { name: 'Viva', completed: project?.progress === 100 },
  ];

  const fetchProjectDetails = useCallback(async () => {
    try {
      const [projectRes, wprRes] = await Promise.all([
        projectService.getProjectDetails(id),
        wprService.getWPR(id),
      ]);
      setProject(projectRes.data);
      setWprs(wprRes.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const handleWPRSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('weekNumber', wprData.weekNumber);
      formData.append('progressDescription', wprData.progressDescription);
      if (wprData.file) {
        formData.append('file', wprData.file);
      }

      await wprService.submitWPR(id, formData);
      setWprData({ weekNumber: '', progressDescription: '', file: null });
      setShowWPRForm(false);
      fetchProjectDetails();
    } catch (error) {
      console.error('Error submitting WPR:', error);
    }
  };

  const handleOpenWPRForm = () => {
    setShowWPRForm(true);
    // autofocus the week number input once the form is visible
    setTimeout(() => {
      const el = document.getElementById('wpr-week-input');
      if (el) el.focus();
    }, 50);
    console.debug('Opening WPR form');
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md fixed inset-y-0">
          <div className="p-6">
            <h2 className="text-xl font-bold text-blue-600 mb-8">CodexHub</h2>
          </div>
        </aside>
        <div className="flex-1 flex flex-col ml-64">
          <header className="bg-white shadow p-4">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back
            </button>
          </header>
          <main className="p-6">
            <p className="text-center text-gray-500">Project not found.</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* sidebar */}
      <aside className="w-64 bg-white shadow-md fixed inset-y-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600 mb-8">CodexHub</h2>
          <nav className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Overview</h3>
              <ul className="space-y-2">
                <li><button className="w-full text-left text-gray-700 hover:text-blue-600">Dashboard</button></li>
                <li><button className="w-full text-left text-gray-700 hover:text-blue-600">My Projects</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Execution</h3>
              <ul className="space-y-2">
                <li><button className="w-full text-left text-gray-700 hover:text-blue-600">WPR</button></li>
                <li><button className="w-full text-left text-gray-700 hover:text-blue-600">Milestones</button></li>
                <li><button className="w-full text-left text-gray-700 hover:text-blue-600">Tasks</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><button className="w-full text-left text-gray-700 hover:text-blue-600">Guidelines</button></li>
                <li><button className="w-full text-left text-gray-700 hover:text-blue-600">Templates</button></li>
                <li><button className="w-full text-left text-gray-700 hover:text-blue-600">Support</button></li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col ml-64">
        {/* top navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-800">🔔 Notifications</button>
            <button className="text-gray-600 hover:text-gray-800">👤 Profile</button>
          </div>
        </header>

        <main className="p-6 overflow-auto flex-1">
          {/* top project card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'approved' ? 'bg-green-100 text-green-800' :
                  project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenWPRForm}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                + Submit New WPR
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
            <p className="text-gray-600 mb-6">{project.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Guide</p>
                <p className="font-semibold text-gray-800">{project.guide?.name || 'TBD'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Team Members</p>
                <p className="font-semibold text-gray-800">{project.students?.length || 1}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Domain</p>
                <p className="font-semibold text-gray-800">Tech</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Timeline</p>
                <p className="font-semibold text-gray-800">Semester {project.semester}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm font-semibold">Completion</span>
                <span className="text-blue-600 font-bold">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* milestone progress tracker */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold mb-6">Progress Tracker</h3>
            <div className="flex items-center justify-between">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 ${
                    milestone.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {milestone.completed ? '✓' : idx + 1}
                  </div>
                  <p className={`text-sm font-semibold text-center ${
                    milestone.completed ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {milestone.name}
                  </p>
                  {idx < milestones.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 -mt-8 ${
                      milestone.completed ? 'bg-blue-600' : 'bg-gray-200'
                    }`} style={{ width: '100%' }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* WPR form */}
          {showWPRForm && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Submit New WPR</h3>
              <form onSubmit={handleWPRSubmit} className="space-y-4">
                <input
                  type="number"
                  id="wpr-week-input"
                  placeholder="Week Number"
                  value={wprData.weekNumber}
                  onChange={(e) => setWprData({ ...wprData, weekNumber: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Progress Description"
                  value={wprData.progressDescription}
                  onChange={(e) => setWprData({ ...wprData, progressDescription: e.target.value })}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="file"
                  onChange={(e) => setWprData({ ...wprData, file: e.target.files[0] })}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    Submit WPR
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWPRForm(false)}
                    className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* bottom two-column section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* recent wprs */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Recent WPRs</h3>
              <div className="space-y-4">
                {wprs.length > 0 ? wprs.map((wpr, index) => (
                  <div key={wpr._id || index} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">Week {wpr.weekNumber}</h4>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                        Pending
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{wpr.progressDescription}</p>
                    {wpr.file && (
                      <a
                        href={wpr.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                      >
                        📄 Download
                      </a>
                    )}
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-8">No WPRs submitted yet.</p>
                )}
              </div>
            </div>

            {/* task breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Task Breakdown</h3>
              <div className="space-y-3 mb-4">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.text}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddTask}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;
