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
  aboutYou: {
    type: String,
    required: function () {
      return typeof (this as any).aboutYou !== 'string';
    },
    default: '',
  },
  displayname: {
    type: String,
    required: function () {
      return typeof (this as any).displayname !== 'string';
    },
    default: '',
  },
  brainetTag: { type: String, required: true },
  passwordHash: { type: String, required: true },
  dateOfBirth: { type: Date },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    required: true,
  },
  premium: { type: Boolean, required: true, default: false },
  dateLastEdited: { type: Date, required: true, default: () => new Date() },
  dateCreatedAt: { type: Date, required: true, default: () => new Date() },
  projectIds: { type: [mongoose.Types.ObjectId], default: [], ref: 'projects' }, // doesn't contain tutorial projects
  followerIds: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
    ref: 'users',
  },
  followingIds: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
    ref: 'users',
  },
  pfpPath: {
    type: String,
    required: function () {
      return typeof (this as any).pfpPath !== 'string';
    },
    default: '',
  },
  completedTutorials: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
    ref: 'tutorials',
  },
  experience: { type: Number, required: true, default: 0 },
  admin: { type: Boolean, required: true, default: false },
});

mongooseUserSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const UserModel = mongoose.model('users', mongooseUserSchema);
