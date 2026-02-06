import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

enum PremiumTier {
  Free = 0,
  Basic = 100,
  Premium = 200,
  Unlimited = 300,
}

@Schema()
export class UnlockNode {
  @Prop({ required: true, type: () => String })
  type!: string;

  @Prop({
    required: true,
    type: () => String,
    default: () => new Types.ObjectId().toString(),
  })
  id!: string;

  @Prop({ required: true, type: () => [String], default: [] })
  data!: string[];
}

@Schema()
export class Step {
  @Prop({
    required: function () {
      return typeof (this as any).text !== 'string';
    },
    type: () => String,
  })
  text!: string;

  @Prop({
    required: function () {
      return typeof (this as any).narrator !== 'string';
    },
    default: '',
    type: () => String,
  })
  narrator!: string;

  @Prop({ required: true, default: [], type: () => [Object] })
  addNodes!: Record<string, any>[];

  @Prop({ required: true, default: [], type: () => [Object] })
  addEdges!: Record<string, any>[];

  @Prop({ required: true, default: [], type: () => [Object] })
  removeNodes!: Record<string, any>[];

  @Prop({ required: true, default: [], type: () => [Object] })
  removeEdges!: Record<string, any>[];

  @Prop({ required: true, default: [], type: () => [String] })
  highlightNodeTypes!: string[];

  @Prop({ required: true, default: [], type: () => [UnlockNode] })
  unlockNodes!: UnlockNode[];

  @Prop({ required: true, default: false, type: () => Boolean })
  trainingEnabled!: boolean;

  @Prop({ type: () => Types.ObjectId })
  trainedModel?: Types.ObjectId;
}

@Schema()
export class Tutorial {
  @Prop({ required: true, index: true, unique: true, type: () => String })
  name!: string;

  @Prop({
    required: function () {
      return typeof (this as any).summary !== 'string';
    },
    default: '',
    type: () => String,
  })
  summary!: string;

  @Prop({
    required: function () {
      return typeof (this as any).description !== 'string';
    },
    default: '',
    type: () => String,
  })
  description!: string;

  @Prop({ ref: 'users', type: () => Types.ObjectId })
  ownerId!: Types.ObjectId;

  @Prop({ enum: ['public', 'private'], required: true, type: () => String })
  visibility!: string;

  @Prop({
    enum: PremiumTier,
    required: true,
    default: PremiumTier.Free,
    type: () => Number,
  })
  requiredPremiumTier!: number;

  @Prop({ required: true, default: () => new Date(), type: () => Date })
  dateCreatedAt!: Date;

  @Prop({ required: true, default: () => new Date(), type: () => Date })
  dateLastEdited!: Date;

  @Prop({
    required: true,
    default: [],
    ref: 'tutorials',
    type: () => [Types.ObjectId],
  })
  requiredTutorials!: Types.ObjectId[];

  @Prop({
    required: true,
    default: [],
    ref: 'tutorials',
    type: () => [Types.ObjectId],
  })
  nextTutorials!: Types.ObjectId[];

  @Prop({ required: true, default: 100, type: () => Number })
  experienceGain!: number;

  @Prop({ required: true, ref: 'projects', type: () => Types.ObjectId })
  startProject!: Types.ObjectId;

  @Prop({ required: true, default: [], type: () => [UnlockNode] })
  unlockNodes!: UnlockNode[];

  @Prop({ required: true, default: [], type: () => [Step] })
  steps!: Step[];
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);

TutorialSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const TutorialModel = mongoose.model('tutorials', TutorialSchema);
