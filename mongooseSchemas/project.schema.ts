import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Project extends Document {
  // @ts-ignore
  @Prop({ type: String, required: true })
  name!: string;

  // @ts-ignore
  @Prop({
    type: String,
    required: function (this: Document) {
      return typeof this.get('description') !== 'string';
    },
    default: '',
  })
  description!: string;

  // @ts-ignore
  @Prop({ type: Types.ObjectId, required: true })
  ownerId!: Types.ObjectId;

  // @ts-ignore
  @Prop({
    type: [Types.ObjectId],
    required: true,
    default: [],
    ref: 'users',
  })
  contributors!: Types.ObjectId[];

  // @ts-ignore
  @Prop({ type: String, enum: ['public', 'private'], required: true })
  visibility!: string;

  // @ts-ignore
  @Prop({ type: Date, required: true, default: () => new Date() })
  dateCreatedAt!: Date;

  // @ts-ignore
  @Prop({ type: Date, required: true, default: () => new Date() })
  dateLastEdited!: Date;

  // @ts-ignore
  @Prop({ type: MongooseSchema.Types.Mixed, required: true, default: {} })
  components!: Record<string, any>;

  // @ts-ignore
  @Prop({ type: [Types.ObjectId], required: true, default: [] })
  models!: Types.ObjectId[];

  // @ts-ignore
  @Prop({ type: Boolean, required: true, default: false })
  isTutorialProject!: boolean;

  // @ts-ignore
  @Prop({ type: Types.ObjectId })
  tutorialId?: Types.ObjectId;

  // @ts-ignore
  @Prop({ type: Number })
  tutorialStep?: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});
