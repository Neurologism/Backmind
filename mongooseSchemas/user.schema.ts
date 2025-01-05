import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Email {
  // @ts-ignore
  @Prop({ type: String, enum: ['primary', 'secondary'], required: true })
  emailType!: string;

  // @ts-ignore
  @Prop({ type: String, required: true })
  address!: string;

  // @ts-ignore
  @Prop({ type: Boolean, required: true, default: false })
  verified!: boolean;

  // @ts-ignore
  @Prop({ type: String })
  verificationToken?: string;

  // @ts-ignore
  @Prop({ type: Date })
  dateVerificationSent?: Date;

  // @ts-ignore
  @Prop({ type: Date, required: true, default: () => new Date() })
  dateAdded!: Date;

  // @ts-ignore
  @Prop({ type: Date })
  dateVerified?: Date;
}

const EmailSchema = SchemaFactory.createForClass(Email);

@Schema()
export class Phone {
  // @ts-ignore
  @Prop({ type: String })
  number?: string;

  // @ts-ignore
  @Prop({ type: Boolean, default: false })
  verified?: boolean;

  // @ts-ignore
  @Prop({ type: String })
  verificationCode?: string;

  // @ts-ignore
  @Prop({ type: Date })
  dateVerificationSent?: Date;

  // @ts-ignore
  @Prop({ type: Date })
  dateAdded?: Date;

  // @ts-ignore
  @Prop({ type: Date })
  dateVerified?: Date;
}

const PhoneSchema = SchemaFactory.createForClass(Phone);

@Schema()
export class Token {
  // @ts-ignore
  @Prop({ type: String, required: true })
  token!: string;

  // @ts-ignore
  @Prop({ type: Date, required: true, default: () => new Date() })
  dateAdded!: Date;
}

const TokenSchema = SchemaFactory.createForClass(Token);

@Schema()
export class User extends Document {
  // @ts-ignore
  @Prop({ type: [EmailSchema], required: true })
  emails!: Email[];

  // @ts-ignore
  @Prop({ type: PhoneSchema, required: false })
  phone?: Phone;

  // @ts-ignore
  @Prop({ type: [TokenSchema], required: true, default: [] })
  tokens!: Token[];

  // @ts-ignore
  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).aboutYou !== 'string';
    },
    default: '',
  })
  aboutYou!: string;

  // @ts-ignore
  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).displayname !== 'string';
    },
    default: '',
  })
  displayname!: string;

  // @ts-ignore
  @Prop({ type: String, required: true })
  brainetTag!: string;

  // @ts-ignore
  @Prop({ type: String, required: true })
  passwordHash!: string;

  // @ts-ignore
  @Prop({ type: Date })
  dateOfBirth?: Date;

  // @ts-ignore
  @Prop({
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    required: true,
  })
  visibility!: string;

  // @ts-ignore
  @Prop({ type: String, default: '' })
  pronouns!: string;

  // @ts-ignore
  @Prop({ type: String, default: '' })
  company!: string;

  // @ts-ignore
  @Prop({ type: String, default: '' })
  location!: string;

  // @ts-ignore
  @Prop({ type: Boolean, required: true, default: false })
  premium!: boolean;

  // @ts-ignore
  @Prop({ type: Number, required: true, default: 600 })
  remainingCredits!: number;

  // @ts-ignore
  @Prop({ type: Date, required: true, default: () => new Date() })
  dateLastEdited!: Date;

  // @ts-ignore
  @Prop({ type: Date, required: true, default: () => new Date() })
  dateCreatedAt!: Date;

  // @ts-ignore
  @Prop({ type: [Types.ObjectId], default: [], ref: 'projects' })
  projectIds!: Types.ObjectId[];

  // @ts-ignore
  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: 'users' })
  followerIds!: Types.ObjectId[];

  // @ts-ignore
  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: 'users' })
  followingIds!: Types.ObjectId[];

  // @ts-ignore
  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).pfpPath !== 'string';
    },
    default: '',
  })
  pfpPath!: string;

  // @ts-ignore
  @Prop({
    type: [Types.ObjectId],
    required: true,
    default: [],
    ref: 'tutorials',
  })
  completedTutorials!: Types.ObjectId[];

  // @ts-ignore
  @Prop({ type: Number, required: true, default: 0 })
  experience!: number;

  // @ts-ignore
  @Prop({ type: Boolean, required: true, default: false })
  admin!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});
