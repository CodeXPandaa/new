import Project from '../models/Project.js';
import User from '../models/User.js';
import WPR from '../models/WPR.js';

export const getTeacherAnalytics = async (req, res) => {
  try {
    const projects = await Project.find({ guide: req.user.id });

    const totalProjects = projects.length;
    const approvedProjects = projects.filter(p => p.status === 'approved').length;
    const pendingProjects = projects.filter(p => p.status === 'pending').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;

    // Project status data for pie chart
    const projectStatusData = [
      { name: 'Approved', value: approvedProjects },
      { name: 'Pending', value: pendingProjects },
      { name: 'Completed', value: completedProjects },
    ];

    // Projects per semester
    const semesterData = [];
    for (let i = 1; i <= 8; i++) {
      const count = projects.filter(p => p.semester === i).length;
      semesterData.push({ name: `Sem ${i}`, value: count });
    }

    // Low progress projects
    const lowProgressProjects = projects.filter(p => p.progress < 40);

    res.json({
      totalProjects,
      approvedProjects,
      pendingProjects,
      completedProjects,
      projectStatusData,
      semesterData,
      lowProgressProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;

    const projects = await Project.find({ students: studentId }).populate('guide');
    const wprs = await WPR.find({ submittedBy: studentId });

    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const approvedProjects = projects.filter(p => p.status === 'approved').length;

    const avgProgress = totalProjects > 0
      ? (projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects).toFixed(2)
      : 0;

    res.json({
      totalProjects,
      completedProjects,
      approvedProjects,
      avgProgress,
      wprSubmitted: wprs.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
