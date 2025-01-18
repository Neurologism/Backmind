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
  @Prop({ required: true, index: true, unique: true })
  name!: string;

  @Prop({
    required: function (this: Document) {
      return typeof this.get('description') !== 'string';
    },
    default: '',
  })
  description!: string;

  @Prop({ required: true, ref: 'users' })
  ownerId!: Types.ObjectId;

  @Prop({ enum: ['public', 'private'], required: true })
  visibility!: string;

  @Prop({ required: true, default: () => new Date() })
  dateCreatedAt!: Date;

  @Prop({ required: true, default: () => new Date() })
  dateLastEdited!: Date;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true, default: {} })
  components!: Record<string, any>;

  @Prop({ required: true, default: [], ref: 'tasks' })
  tasks!: Types.ObjectId[];

  @Prop({ required: true, default: false })
  isTutorialProject!: boolean;

  @Prop({ ref: 'tutorials' })
  tutorialId?: Types.ObjectId;

  @Prop()
  tutorialStep?: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const ProjectModel = mongoose.model('projects', ProjectSchema);
