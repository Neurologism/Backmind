import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema()
class UnlockNode extends Document {
  // @ts-ignore
  @Prop({ type: String, required: true })
  type!: string;

  // @ts-ignore
  @Prop({ type: String })
  id: string = new Types.ObjectId().toString();

  // @ts-ignore
  @Prop({ type: [String], required: true, default: [] })
  data!: string[];
}

const UnlockNodeSchema = SchemaFactory.createForClass(UnlockNode);

@Schema()
class Step extends Document {
  // @ts-ignore
  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).text !== 'string';
    },
  })
  text!: string;

  // @ts-ignore
  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).narrator !== 'string';
    },
    default: '',
  })
  narrator!: string;

  // @ts-ignore
  @Prop({ type: [Object], required: true, default: [] })
  addNodes!: Record<string, any>[];

  // @ts-ignore
  @Prop({ type: [Object], required: true, default: [] })
  addEdges!: Record<string, any>[];

  // @ts-ignore
  @Prop({ type: [Object], required: true, default: [] })
  removeNodes!: Record<string, any>[];

  // @ts-ignore
  @Prop({ type: [Object], required: true, default: [] })
  removeEdges!: Record<string, any>[];

  // @ts-ignore
  @Prop({ type: [String], required: true, default: [] })
  highlightNodeTypes!: string[];

  // @ts-ignore
  @Prop({ type: [UnlockNodeSchema], required: true, default: [] })
  unlockNodes!: UnlockNode[];

  // @ts-ignore
  @Prop({ type: Boolean, required: true, default: false })
  trainingEnabled!: boolean;

  // @ts-ignore
  @Prop({ type: Types.ObjectId })
  trainedModel?: Types.ObjectId;
}

const StepSchema = SchemaFactory.createForClass(Step);

@Schema()
export class Tutorial extends Document {
  // @ts-ignore
  @Prop({ type: String, required: true })
  name!: string;

  // @ts-ignore
  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).summary !== 'string';
    },
    default: '',
  })
  summary!: string;

  // @ts-ignore
  @Prop({
    type: String,
    required: function () {
      return typeof (this as any).description !== 'string';
    },
    default: '',
  })
  description!: string;

  // @ts-ignore
  @Prop({ type: Types.ObjectId })
  ownerId!: Types.ObjectId;

  // @ts-ignore
  @Prop({ type: String, enum: ['public', 'private'], required: true })
  visibility!: string;

  // @ts-ignore
  @Prop({ type: Boolean, required: true, default: false })
  premiumRequired!: boolean;

  // @ts-ignore
  @Prop({ type: Date, required: true, default: () => new Date() })
  dateCreatedAt!: Date;

  // @ts-ignore
  @Prop({ type: Date, required: true, default: () => new Date() })
  dateLastEdited!: Date;

  // @ts-ignore
  @Prop({ type: [Types.ObjectId], required: true, default: [] })
  requiredTutorials!: Types.ObjectId[];

  // @ts-ignore
  @Prop({ type: [Types.ObjectId], required: true, default: [] })
  nextTutorials!: Types.ObjectId[];

  // @ts-ignore
  @Prop({ type: Number, required: true, default: 100 })
  experienceGain!: number;

  // @ts-ignore
  @Prop({ type: Types.ObjectId, required: true })
  startProject!: Types.ObjectId;

  // @ts-ignore
  @Prop({ type: [UnlockNodeSchema], required: true, default: [] })
  unlockNodes!: UnlockNode[];

  // @ts-ignore
  @Prop({ type: [StepSchema], required: true, default: [] })
  steps!: Step[];
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);

TutorialSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});
