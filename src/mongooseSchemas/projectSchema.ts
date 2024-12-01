import mongoose from 'mongoose';

const mongooseProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true, default: '' },
  ownerId: { type: mongoose.Types.ObjectId, required: true },
  contributors: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  },
  visibility: { type: String, enum: ['public', 'private'], required: true },
  dateCreatedAt: { type: Date, required: true, default: () => new Date() },
  dateLastEdited: { type: Date, required: true, default: () => new Date() },
  components: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  },
  models: { type: [mongoose.Types.ObjectId], required: true, default: [] },
  isTutorialProject: { type: Boolean, required: true, default: false }, // mean that this tutorial is used to save the current state of a user following a tutorial; if true, should not be shown in the users project list
});

mongooseProjectSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const ProjectModel = mongoose.model('projects', mongooseProjectSchema);
