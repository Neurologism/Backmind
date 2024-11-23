import mongoose from 'mongoose';

const mongooseProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  owner_id: mongoose.Types.ObjectId,
  contributors: [mongoose.Types.ObjectId],
  visibility: { type: String, enum: ['public', 'private'], required: true },
  created_on: Date,
  last_edited: Date,
  components: Object,
  models: [mongoose.Types.ObjectId],
});

mongooseProjectSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

mongooseProjectSchema.pre('save', function (next) {
  this.last_edited = new Date();
  next();
});

export const ProjectModel = mongoose.model('projects', mongooseProjectSchema);
