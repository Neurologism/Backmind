import mongoose from 'mongoose';

const unlockNodeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  id: { type: String, required: true },
  data: { type: [String], required: true, default: [] },
});

const stepSchema = new mongoose.Schema({
  text: {
    type: String,
    required: function () {
      return typeof (this as any).pfpPath === 'string';
    },
  },
  narrator: {
    type: String,
    required: function () {
      return typeof (this as any).pfpPath === 'string';
    },
    default: '',
  },
  addNodes: { type: [Object], required: true, default: [] },
  addEdges: { type: [Object], required: true, default: [] },
  removeNodes: { type: [Object], required: true, default: [] },
  removeEdges: { type: [Object], required: true, default: [] },
  highlightNodeTypes: { type: [String], required: true, default: [] },
  unlockNodes: { type: [unlockNodeSchema], required: true, default: [] },
  trainingEnabled: { type: Boolean, required: true, default: false },
  trainedModel: { type: mongoose.Types.ObjectId, required: false },
});

const mongooseTutorialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  summary: {
    type: String,
    required: function () {
      return typeof (this as any).pfpPath === 'string';
    },
    default: '',
  },
  description: {
    type: String,
    required: function () {
      return typeof (this as any).pfpPath === 'string';
    },
    default: '',
  },
  ownerId: mongoose.Types.ObjectId,
  visibility: { type: String, enum: ['public', 'private'], required: true },
  premiumRequired: { type: Boolean, required: true, default: false },
  dateCreatedAt: { type: Date, required: true, default: () => new Date() },
  dateLastEdited: { type: Date, required: true, default: () => new Date() },
  requiredTutorials: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  },
  nextTutorials: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  },
  experienceGain: { type: Number, required: true, default: 100 },
  startProject: { type: mongoose.Types.ObjectId, required: true },
  unlockNodes: { type: [unlockNodeSchema], required: true, default: [] },
  steps: {
    type: [stepSchema],
    required: true,
    default: [],
  },
});

mongooseTutorialSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const TutorialModel = mongoose.model(
  'tutorials',
  mongooseTutorialSchema
);
