import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class UnlockNode extends Document {
  @Prop({ type: String, required: true })
  type!: string;

  @Prop({ type: String })
  id: string = new Types.ObjectId().toString();

  @Prop({ type: [String], required: true, default: [] })
  data!: string[];
}

const UnlockNodeSchema = SchemaFactory.createForClass(UnlockNode);

@Schema()
class Step extends Document {
  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).text !== 'string';
    },
  })
  text!: string;

  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).narrator !== 'string';
    },
    default: '',
  })
  narrator!: string;

  @Prop({ type: [Object], required: true, default: [] })
  addNodes!: Record<string, any>[];

  @Prop({ type: [Object], required: true, default: [] })
  addEdges!: Record<string, any>[];

  @Prop({ type: [Object], required: true, default: [] })
  removeNodes!: Record<string, any>[];

  @Prop({ type: [Object], required: true, default: [] })
  removeEdges!: Record<string, any>[];

  @Prop({ type: [String], required: true, default: [] })
  highlightNodeTypes!: string[];

  @Prop({ type: [UnlockNodeSchema], required: true, default: [] })
  unlockNodes!: UnlockNode[];

  @Prop({ type: Boolean, required: true, default: false })
  trainingEnabled!: boolean;

  @Prop({ type: Types.ObjectId })
  trainedModel?: Types.ObjectId;
}

const StepSchema = SchemaFactory.createForClass(Step);

@Schema()
export class Tutorial extends Document {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).summary !== 'string';
    },
    default: '',
  })
  summary!: string;

  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).description !== 'string';
    },
    default: '',
  })
  description!: string;

  @Prop({ type: Types.ObjectId })
  ownerId!: Types.ObjectId;

  @Prop({ type: String, enum: ['public', 'private'], required: true })
  visibility!: string;

  @Prop({ type: Boolean, required: true, default: false })
  premiumRequired!: boolean;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateCreatedAt!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateLastEdited!: Date;

  @Prop({ type: [Types.ObjectId], required: true, default: [] })
  requiredTutorials!: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], required: true, default: [] })
  nextTutorials!: Types.ObjectId[];

  @Prop({ type: Number, required: true, default: 100 })
  experienceGain!: number;

  @Prop({ type: Types.ObjectId, required: true })
  startProject!: Types.ObjectId;

  @Prop({ type: [UnlockNodeSchema], required: true, default: [] })
  unlockNodes!: UnlockNode[];

  @Prop({ type: [StepSchema], required: true, default: [] })
  steps!: Step[];
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);

TutorialSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});
