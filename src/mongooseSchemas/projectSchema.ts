import mongoose from 'mongoose';

const mongooseProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  ownerId: mongoose.Types.ObjectId,
  contributors: [mongoose.Types.ObjectId],
  visibility: { type: String, enum: ['public', 'private'], required: true },
  dateCreatedOn: Date,
  dateLastEdited: Date,
  components: Object,
  models: [mongoose.Types.ObjectId],
});

mongooseProjectSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const ProjectModel = mongoose.model('projects', mongooseProjectSchema);
