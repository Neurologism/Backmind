import mongoose from 'mongoose';

export const mongooseUserSchema = new mongoose.Schema({
  emails: {
    type: [
      {
        emailType: {
          type: String,
          enum: ['primary', 'secondary'],
          required: true,
        },
        address: { type: String, required: true },
        verified: { type: Boolean, required: true, default: false },
        verificationToken: { type: String },
        dateVerificationSent: { type: Date },
        dateAdded: { type: Date, required: true, default: () => new Date() },
        dateVerified: { type: Date },
      },
    ],
    required: true,
  },
  phone: {
    type: {
      number: { type: String },
      verified: { type: Boolean, default: false },
      verificationCode: { type: String },
      dateVerificationSent: { type: Date },
      dateAdded: { type: Date },
      dateVerified: { type: Date },
    },
    required: false,
  },
  aboutYou: { type: String, required: true, default: '' },
  displayname: { type: String, required: true, default: '' },
  brainetTag: { type: String, required: true },
  passwordHash: { type: String, required: true },
  dateOfBirth: { type: Date },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    required: true,
  },
  dateLastEdited: { type: Date, required: true, default: () => new Date() },
  dateCreatedAt: { type: Date, required: true, default: () => new Date() },
  projectIds: { type: [mongoose.Types.ObjectId], default: [] },
  followerIds: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  },
  followingIds: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  },
  pfpPath: { type: String, required: true, default: '' },
  completedTutorials: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  },
  startedTutorials: {
    type: [
      {
        tutorialId: { type: mongoose.Types.ObjectId, required: true },
        step: { type: Number, required: true },
        projectId: { type: mongoose.Types.ObjectId, required: true },
      },
    ],
    required: true,
    default: [],
  },
  experience: { type: Number, required: true, default: 0 },
  admin: { type: Boolean, required: true, default: false },
});

mongooseUserSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const UserModel = mongoose.model('users', mongooseUserSchema);
