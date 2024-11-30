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
        verified: { type: Boolean, default: false },
        verificationToken: { type: String },
        dateVerificationSent: { type: Date },
        dateAdded: { type: Date, default: new Date() },
        dateVerified: { type: Date, required: false },
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
  aboutYou: { type: String, default: '' },
  displayname: { type: String, default: '' },
  brainetTag: { type: String },
  passwordHash: { type: String, required: true },
  dateOfBirth: { type: Date },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    required: true,
  },
  dateLastEdited: { type: Date, default: new Date() },
  dateCreatedOn: { type: Date, default: new Date() },
  projectIds: { type: [mongoose.Types.ObjectId], default: [] },
  followerIds: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  followingIds: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  pfpPath: { type: String, default: '' },
});

mongooseUserSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const UserModel = mongoose.model('users', mongooseUserSchema);
