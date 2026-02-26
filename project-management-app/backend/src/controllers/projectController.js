import Project from '../models/Project.js';
import User from '../models/User.js';

export const requestProject = async (req, res) => {
  try {
    const { title, description, teamMembers = [], guide } = req.body;

    if (!guide) {
      return res.status(400).json({ message: 'Please select a project guide' });
    }

    // Resolve guide: accept either an ID or an email
    let guideUser = null;
    try {
      guideUser = await User.findById(guide);
    } catch (e) {
      // not a valid ObjectId, try as email
    }
    if (!guideUser) {
      guideUser = await User.findOne({ email: guide });
    }
    if (!guideUser || guideUser.role !== 'teacher') {
      return res.status(400).json({ message: 'Invalid guide selected' });
    }
    const guideId = guideUser._id;

    // Fetch requester to get semester
    const requester = await User.findById(req.user.id);
    if (!requester) {
      return res.status(404).json({ message: 'Requesting user not found' });
    }
    const semester = requester.semester || req.body.semester;
    if (!semester) {
      return res.status(400).json({ message: 'Semester is required for project request' });
    }

    // Resolve team members: accept array of user ids or emails; ensure students only
    const resolvedStudentIds = new Set();

    // always include requester
    resolvedStudentIds.add(req.user.id);

    for (const member of teamMembers) {
      if (!member) continue;
      let user = null;
      try {
        user = await User.findById(member);
      } catch (e) {
        // not an ObjectId, fall through
      }
      if (!user) {
        user = await User.findOne({ email: member });
      }
      if (user && user.role === 'student') {
        resolvedStudentIds.add(String(user._id));
      }
    }

    const students = Array.from(resolvedStudentIds);

    const project = new Project({
      title,
      description,
      guide: guideId,
      students,
      semester,
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

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is a student in the project
    if (!project.students.includes(req.user.id)) {
      return res.status(403).json({ message: 'You do not have permission to delete this project' });
    }

    // Remove project from all students' projects array
    await User.updateMany(
      { _id: { $in: project.students } },
      { $pull: { projects: project._id } }
    );

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
