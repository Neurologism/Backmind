import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Document,
  Types,
  Schema as MongooseSchema,
} from 'mongoose';
import mongoose from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({ type: String, required: true, index: true, unique: true })
  name!: string;

  @Prop({
    type: String,
    required: function (this: Document) {
      return typeof this.get('description') !== 'string';
    },
    default: '',
  })
  description!: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  ownerId!: Types.ObjectId;

  @Prop({ type: String, enum: ['public', 'private'], required: true })
  visibility!: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateCreatedAt!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  dateLastEdited!: Date;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true, default: {} })
  components!: Record<string, any>;

  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: 'tasks' })
  tasks!: Types.ObjectId[];

  @Prop({ type: Boolean, required: true, default: false })
  isTutorialProject!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'tutorials' })
  tutorialId?: Types.ObjectId;

  @Prop({ type: Number })
  tutorialStep?: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const ProjectModel = mongoose.model('projects', ProjectSchema);
