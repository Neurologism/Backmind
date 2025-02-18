import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Email {
  @Prop({ enum: ['primary', 'secondary'], required: true })
  emailType!: string;

  @Prop({ required: true })
  address!: string;

  @Prop({ required: true, default: false })
  verified!: boolean;

  @Prop()
  verificationToken?: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateVerificationSent?: { $date: Date };

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateAdded!: { $date: Date };

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateVerified?: { $date: Date };
}

const EmailSchema = SchemaFactory.createForClass(Email);

@Schema()
export class Phone {
  @Prop()
  number?: string;

  @Prop({ default: false })
  verified?: boolean;

  @Prop()
  verificationCode?: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateVerificationSent?: { $date: Date };

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateAdded?: { $date: Date };

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateVerified?: { $date: Date };
}

const PhoneSchema = SchemaFactory.createForClass(Phone);

@Schema()
export class Token {
  @Prop({ required: true })
  token!: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateAdded!: { $date: Date };

  @Prop({ required: true, default: [] })
  ips!: string[];

  @Prop({ required: true, default: [] })
  userAgents!: string[];
}

const TokenSchema = SchemaFactory.createForClass(Token);

@Schema()
export class UserRequest {
  @Prop({ required: true })
  endpoint!: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateRequested!: { $date: Date };
}

const RequestSchema = SchemaFactory.createForClass(UserRequest);

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, index: true, unique: true })
  brainetTag!: string;

  @Prop({ required: true })
  emails!: Email[];

  @Prop({ required: false })
  phone?: Phone;

  @Prop({ required: true, default: [] })
  tokens!: Token[];

  @Prop({ required: true, default: [] })
  requests!: UserRequest[];

  @Prop({
    required: function () {
      return typeof (this as any).aboutYou !== 'string';
    },
    default: '',
  })
  aboutYou!: string;

  @Prop({
    required: function () {
      return typeof (this as any).displayname !== 'string';
    },
    default: '',
  })
  displayname!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateOfBirth?: { $date: Date };

  @Prop({ default: '' })
  pronouns!: string;

  @Prop({ default: '' })
  company!: string;

  @Prop({ default: '' })
  location!: string;

  @Prop({ required: true, default: 0 })
  premiumTier!: number;

  @Prop({ required: true, default: 600 })
  remainingCredits!: number;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateLastEdited!: { $date: Date };

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateCreatedAt!: { $date: Date };

  @Prop({ default: [], ref: 'projects' })
  projectIds!: Types.ObjectId[];

  @Prop({ required: true, default: [], ref: 'users' })
  followerIds!: Types.ObjectId[];

  @Prop({ required: true, default: [], ref: 'users' })
  followingIds!: Types.ObjectId[];

  @Prop({
    required: function () {
      return typeof (this as any).pfpPath !== 'string';
    },
    default: '',
  })
  pfpPath!: string;

  @Prop({
    required: true,
    default: [],
    ref: 'tutorials',
  })
  completedTutorials!: Types.ObjectId[];

  @Prop({ required: true, default: 0 })
  experience!: number;

  @Prop({ required: true, default: false })
  admin!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.dateLastEdited = { $date: new Date() };
  next();
});

export const UserModel = mongoose.model('users', UserSchema);
