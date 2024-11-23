import mongoose from 'mongoose';

const mongooseUserSchema = new mongoose.Schema({
  email: String,
  about_you: String,
  displayname: String,
  brainet_tag: String,
  password_hash: String,
  date_of_birth: Number,
  visibility: { type: String, enum: ['public', 'private'] },
  last_edited: Date,
  created_on: Date,
  project_ids: [mongoose.Types.ObjectId],
  follower_ids: [mongoose.Types.ObjectId],
  following_ids: [mongoose.Types.ObjectId],
});

mongooseUserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password_hash;
    return ret;
  },
});

mongooseUserSchema.pre('save', function (next) {
  this.last_edited = new Date();
  next();
});

export const UserModel = mongoose.model('users', mongooseUserSchema);
