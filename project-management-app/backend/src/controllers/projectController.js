import Project from '../models/Project.js';
import User from '../models/User.js';

export const requestProject = async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;
    const guideId = req.user.id;

    const project = new Project({
      title,
      description,
      guide: guideId,
      students: [req.user.id, ...teamMembers.filter(m => m !== req.user.id)],
      semester: req.user.semester,
      status: 'pending',
    });

    await project.save();
    await project.populate(['guide', 'students']);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectsByStudent = async (req, res) => {
  try {
    const projects = await Project.find({
      students: req.user.id,
    }).populate(['guide', 'students']);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectsByTeacher = async (req, res) => {
  try {
    const projects = await Project.find({
      guide: req.user.id,
    }).populate(['guide', 'students']);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(['guide', 'students']);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', startDate: new Date() },
      { new: true }
    ).populate(['guide', 'students']);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Add project to all students' projects array
    await User.updateMany(
      { _id: { $in: project.students } },
      { $addToSet: { projects: project._id } }
    );

    res.json({
      message: 'Project approved',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate(['guide', 'students']);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project rejected',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProjectProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { progress, updatedAt: new Date() },
      { new: true }
    ).populate(['guide', 'students']);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project progress updated',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
