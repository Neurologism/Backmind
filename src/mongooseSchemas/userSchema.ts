import mongoose from 'mongoose';

export const mongooseUserSchema = new mongoose.Schema({
  emails: {
    type: [
      {
        type: {
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
  about_you: { type: String, default: '' },
  displayname: { type: String, default: '' },
  brainet_tag: { type: String },
  password_hash: { type: String, required: true },
  date_of_birth: { type: Date, default: new Date() },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    required: true,
  },
  last_edited: { type: Date, default: new Date() },
  created_on: { type: Date, default: new Date() },
  project_ids: { type: [mongoose.Types.ObjectId], default: [] },
  follower_ids: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  following_ids: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  pfp_path: { type: String, default: '' },
});

mongooseUserSchema.pre('save', function (next) {
  this.last_edited = new Date();
  next();
});

export const UserModel = mongoose.model('users', mongooseUserSchema);
