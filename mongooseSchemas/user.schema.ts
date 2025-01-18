import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Email {
  @Prop({ type: String, enum: ['primary', 'secondary'], required: true })
  emailType!: string;

  @Prop({ type: String, required: true })
  address!: string;

  @Prop({ type: Boolean, required: true, default: false })
  verified!: boolean;

  @Prop({ type: String })
  verificationToken?: string;

  @Prop({ type: Date })
  dateVerificationSent?: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateAdded!: Date;

  @Prop({ type: Date })
  dateVerified?: Date;
}

const EmailSchema = SchemaFactory.createForClass(Email);

@Schema()
export class Phone {
  @Prop({ type: String })
  number?: string;

  @Prop({ type: Boolean, default: false })
  verified?: boolean;

  @Prop({ type: String })
  verificationCode?: string;

  @Prop({ type: Date })
  dateVerificationSent?: Date;

  @Prop({ type: Date })
  dateAdded?: Date;

  @Prop({ type: Date })
  dateVerified?: Date;
}

const PhoneSchema = SchemaFactory.createForClass(Phone);

@Schema()
export class Token {
  @Prop({ type: String, required: true })
  token!: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateAdded!: Date;

  @Prop({ type: [String], required: true, default: [] })
  ips!: string[];

  @Prop({ type: [String], required: true, default: [] })
  userAgents!: string[];
}

const TokenSchema = SchemaFactory.createForClass(Token);

@Schema()
export class Request {
  @Prop({ type: String, required: true })
  endpoint!: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateRequested!: Date;
}

const RequestSchema = SchemaFactory.createForClass(Request);

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true, index: true, unique: true })
  brainetTag!: string;

  @Prop({ type: [EmailSchema], required: true })
  emails!: Email[];

  @Prop({ type: PhoneSchema, required: false })
  phone?: Phone;

  @Prop({ type: [TokenSchema], required: true, default: [] })
  tokens!: Token[];

  @Prop({ type: [RequestSchema], required: true, default: [] })
  requests!: Request[];

  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).aboutYou !== 'string';
    },
    default: '',
  })
  aboutYou!: string;

  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).displayname !== 'string';
    },
    default: '',
  })
  displayname!: string;

  @Prop({ type: String, required: true })
  passwordHash!: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop({
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    required: true,
  })
  visibility!: string;

  @Prop({ type: String, default: '' })
  pronouns!: string;

  @Prop({ type: String, default: '' })
  company!: string;

  @Prop({ type: String, default: '' })
  location!: string;

  @Prop({ type: Number, required: true, default: 0 })
  premiumTier!: number;

  @Prop({ type: Number, required: true, default: 600 })
  remainingCredits!: number;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateLastEdited!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateCreatedAt!: Date;

  @Prop({ type: [Types.ObjectId], default: [], ref: 'projects' })
  projectIds!: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: 'users' })
  followerIds!: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: 'users' })
  followingIds!: Types.ObjectId[];

  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).pfpPath !== 'string';
    },
    default: '',
  })
  pfpPath!: string;

  @Prop({
    type: [Types.ObjectId],
    required: true,
    default: [],
    ref: 'tutorials',
  })
  completedTutorials!: Types.ObjectId[];

  @Prop({ type: Number, required: true, default: 0 })
  experience!: number;

  @Prop({ type: Boolean, required: true, default: false })
  admin!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const UserModel = mongoose.model('users', UserSchema);
