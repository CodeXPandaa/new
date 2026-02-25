import mongoose from 'mongoose';

const wprSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  weekNumber: {
    type: Number,
    required: true,
  },
  progressDescription: {
    type: String,
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  file: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('WPR', wprSchema);
