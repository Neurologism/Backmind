import mongoose from 'mongoose';

const mongooseUserSchema = new mongoose.Schema({
  email: String,
  about_you: String,
  displayname: String,
  brainet_tag: String,
  password_hash: String,
  date_of_birth: Number,
  visibility: { type: String, enum: ['public', 'private'] },
  created_on: Number,
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

export const UserModel = mongoose.model('users', mongooseUserSchema);
