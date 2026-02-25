import WPR from '../models/WPR.js';
import Project from '../models/Project.js';

export const submitWPR = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { weekNumber, progressDescription } = req.body;

    // Verify project exists and user is part of it
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.students.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to submit WPR for this project' });
    }

    const wpr = new WPR({
      project: projectId,
      weekNumber,
      progressDescription,
      submittedBy: req.user.id,
      file: req.file?.filename || null,
    });

    await wpr.save();
    await wpr.populate('submittedBy');

    // Auto-calculate progress: 10% per WPR (max 10 WPRs)
    const wprCount = await WPR.countDocuments({ project: projectId });
    const newProgress = Math.min(wprCount * 10, 100);
    await Project.findByIdAndUpdate(projectId, { progress: newProgress });

    res.status(201).json(wpr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWPR = async (req, res) => {
  try {
    const { projectId } = req.params;
    const wprs = await WPR.find({ project: projectId }).populate('submittedBy').sort({ weekNumber: 1 });

    res.json(wprs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWPRDetails = async (req, res) => {
  try {
    const { projectId, id } = req.params;
    const wpr = await WPR.findOne({ _id: id, project: projectId }).populate('submittedBy');

    if (!wpr) {
      return res.status(404).json({ message: 'WPR not found' });
    }

    res.json(wpr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
