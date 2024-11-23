import mongoose from 'mongoose';

const mongooseProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  owner_id: mongoose.Types.ObjectId,
  contributors: [mongoose.Types.ObjectId],
  visibility: { type: String, enum: ['public', 'private'], required: true },
  created_on: Number,
  last_edited: Number,
  components: Object,
  models: [mongoose.Types.ObjectId],
});

mongooseProjectSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const ProjectModel = mongoose.model('projects', mongooseProjectSchema);
