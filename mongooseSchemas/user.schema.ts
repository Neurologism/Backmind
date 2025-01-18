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

  @Prop()
  dateVerificationSent?: Date;

  @Prop({ required: true, default: () => new Date() })
  dateAdded!: Date;

  @Prop()
  dateVerified?: Date;
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

  @Prop()
  dateVerificationSent?: Date;

  @Prop()
  dateAdded?: Date;

  @Prop()
  dateVerified?: Date;
}

const PhoneSchema = SchemaFactory.createForClass(Phone);

@Schema()
export class Token {
  @Prop({ required: true })
  token!: string;

  @Prop({ required: true, default: () => new Date() })
  dateAdded!: Date;

  @Prop({ required: true, default: [] })
  ips!: string[];

  @Prop({ required: true, default: [] })
  userAgents!: string[];
}

const TokenSchema = SchemaFactory.createForClass(Token);

@Schema()
export class Request {
  @Prop({ required: true })
  endpoint!: string;

  @Prop({ required: true, default: () => new Date() })
  dateRequested!: Date;
}

const RequestSchema = SchemaFactory.createForClass(Request);

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
  requests!: Request[];

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

  @Prop()
  dateOfBirth?: Date;

  @Prop({
    enum: ['public', 'private'],
    default: 'public',
    required: true,
  })
  visibility!: string;

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

  @Prop({ required: true, default: () => new Date() })
  dateLastEdited!: Date;

  @Prop({ required: true, default: () => new Date() })
  dateCreatedAt!: Date;

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
  this.dateLastEdited = new Date();
  next();
});

export const UserModel = mongoose.model('users', UserSchema);
