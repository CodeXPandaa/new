import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, wprService } from '../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [wprs, setWprs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWPRForm, setShowWPRForm] = useState(false);
  const [wprData, setWprData] = useState({
    weekNumber: '',
    progressDescription: '',
    file: null,
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
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
  };

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back
        </button>
        <p className="text-center text-gray-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800 font-semibold"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Project Header */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-6">{project.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className={`font-bold text-lg ${
                project.status === 'approved' ? 'text-green-600' :
                project.status === 'pending' ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {project.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Progress</p>
              <p className="font-bold text-lg text-blue-600">{project.progress}%</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Semester</p>
              <p className="font-bold text-lg">{project.semester}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Team Members</p>
              <p className="font-bold text-lg">{project.students?.length || 1}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-2">Overall Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* WPR Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Weekly Progress Reports</h2>
            <button
              onClick={() => setShowWPRForm(!showWPRForm)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              {showWPRForm ? 'Cancel' : 'Submit WPR'}
            </button>
          </div>

          {showWPRForm && (
            <form onSubmit={handleWPRSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
              <input
                type="number"
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
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Submit WPR
              </button>
            </form>
          )}

          <div className="space-y-4">
            {wprs.map((wpr, index) => (
              <div key={wpr._id || index} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">Week {wpr.weekNumber}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(wpr.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{wpr.progressDescription}</p>
                {wpr.file && (
                  <a
                    href={wpr.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    📄 Download File
                  </a>
                )}
              </div>
            ))}
          </div>

          {wprs.length === 0 && !showWPRForm && (
            <p className="text-center text-gray-500 py-8">No weekly progress reports submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
