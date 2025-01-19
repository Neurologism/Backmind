import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import mongoose from 'mongoose';

enum PremiumTier {
  Free = 0,
  Basic = 100,
  Premium = 200,
  Unlimited = 300,
}

@Schema()
class UnlockNode {
  @Prop({ required: true })
  type!: string;

  @Prop()
  id: string = new Types.ObjectId().toString();

  @Prop({ required: true, default: [] })
  data!: string[];
}

const UnlockNodeSchema = SchemaFactory.createForClass(UnlockNode);

@Schema()
class Step {
  @Prop({
    required: function () {
      return typeof (this as any).text !== 'string';
    },
  })
  text!: string;

  @Prop({
    required: function () {
      return typeof (this as any).narrator !== 'string';
    },
    default: '',
  })
  narrator!: string;

  @Prop({ required: true, default: [] })
  addNodes!: Record<string, any>[];

  @Prop({ required: true, default: [] })
  addEdges!: Record<string, any>[];

  @Prop({ required: true, default: [] })
  removeNodes!: Record<string, any>[];

  @Prop({ required: true, default: [] })
  removeEdges!: Record<string, any>[];

  @Prop({ required: true, default: [] })
  highlightNodeTypes!: string[];

  @Prop({ required: true, default: [] })
  unlockNodes!: UnlockNode[];

  @Prop({ required: true, default: false })
  trainingEnabled!: boolean;

  @Prop()
  trainedModel?: Types.ObjectId;
}

const StepSchema = SchemaFactory.createForClass(Step);

export type TutorialDocument = HydratedDocument<Tutorial>;

@Schema()
export class Tutorial {
  @Prop({ required: true, index: true, unique: true })
  name!: string;

  @Prop({
    required: function () {
      return typeof (this as any).summary !== 'string';
    },
    default: '',
  })
  summary!: string;

  @Prop({
    required: function () {
      return typeof (this as any).description !== 'string';
    },
    default: '',
  })
  description!: string;

  @Prop({ ref: 'users' })
  ownerId!: Types.ObjectId;

  @Prop({ enum: ['public', 'private'], required: true })
  visibility!: string;

  @Prop({
    enum: PremiumTier,
    required: true,
    default: PremiumTier.Free,
  })
  requiredPremiumTier!: number;

  @Prop({ required: true, default: () => new Date() })
  dateCreatedAt!: Date;

  @Prop({ required: true, default: () => new Date() })
  dateLastEdited!: Date;

  @Prop({
    required: true,
    default: [],
    ref: 'tutorials',
  })
  requiredTutorials!: Types.ObjectId[];

  @Prop({
    required: true,
    default: [],
    ref: 'tutorials',
  })
  nextTutorials!: Types.ObjectId[];

  @Prop({ required: true, default: 100 })
  experienceGain!: number;

  @Prop({ required: true, ref: 'projects' })
  startProject!: Types.ObjectId;

  @Prop({ required: true, default: [] })
  unlockNodes!: UnlockNode[];

  @Prop({ required: true, default: [] })
  steps!: Step[];
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);

TutorialSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const TutorialModel = mongoose.model('tutorials', TutorialSchema);
