import mongoose from 'mongoose';

const mongooseProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  owner_id: mongoose.Types.ObjectId,
  contributors: [mongoose.Types.ObjectId],
  visibility: { type: String, enum: ['public', 'private'], required: true },
  created_on: Number,
  last_edited: Number,
  camera_position: [Number],
  components: Object,
  models: [mongoose.Types.ObjectId],
});

export const ProjectModel = mongoose.model('Project', mongooseProjectSchema);
