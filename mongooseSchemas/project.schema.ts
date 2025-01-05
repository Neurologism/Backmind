import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Project extends Document {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({
    type: String,
    required: function (this: Document) {
      return typeof this.get('description') !== 'string';
    },
    default: '',
  })
  description!: string;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId!: Types.ObjectId;

  @Prop({
    type: [Types.ObjectId],
    required: true,
    default: [],
    ref: 'users',
  })
  contributors!: Types.ObjectId[];

  @Prop({ type: String, enum: ['public', 'private'], required: true })
  visibility!: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateCreatedAt!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateLastEdited!: Date;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true, default: {} })
  components!: Record<string, any>;

  @Prop({ type: [Types.ObjectId], required: true, default: [] })
  models!: Types.ObjectId[];

  @Prop({ type: Boolean, required: true, default: false })
  isTutorialProject!: boolean;

  @Prop({ type: Types.ObjectId })
  tutorialId?: Types.ObjectId;

  @Prop({ type: Number })
  tutorialStep?: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});
