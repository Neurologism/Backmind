import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Document,
  Types,
  Schema as MongooseSchema,
} from 'mongoose';
import mongoose from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Node {
  @Prop({ required: false })
  id!: string;

  @Prop({ required: false })
  type!: string;

  @Prop({ required: false })
  initialized!: boolean;

  @Prop({
    type: raw({
      x: { type: Number },
      y: { type: Number },
    }),
    required: false,
  })
  position!: Record<string, Number>;

  @Prop({ type: Object, required: false })
  data!: Record<string, any>;

  @Prop({ required: false })
  identifier!: string;

  @Prop({ required: false })
  group_identifier!: string;
}

@Schema()
export class Edge {
  @Prop()
  id!: string;

  @Prop()
  type!: string;

  @Prop()
  source!: string;

  @Prop()
  target!: string;

  @Prop()
  sourceHandle!: string;

  @Prop()
  targetHandle!: string;

  @Prop(raw({}))
  data!: Record<string, any>;

  @Prop()
  label!: string;

  @Prop()
  animated!: boolean;

  @Prop()
  animationSpeed!: number;

  @Prop(
    raw({
      stroke: { type: String },
      strokeWidth: { type: Number },
    })
  )
  style!: Record<string, any>;

  @Prop()
  sourceX!: number;

  @Prop()
  sourceY!: number;

  @Prop()
  targetX!: number;

  @Prop()
  targetY!: number;
}

@Schema()
export class Components {
  @Prop({ required: false })
  nodes!: Node[];

  @Prop({ required: false })
  edges!: Edge[];

  @Prop({ required: false })
  position!: number[];

  @Prop({ type: Number, required: false })
  zoom!: number;

  @Prop({
    type: raw({
      x: { type: Number },
      y: { type: Number },
      zoom: { type: Number },
    }),
    required: false,
    // do not initialize x or y to 0 or the viewport will be completely freezed in frontend
    default: { x: 0.1, y: 0.1, zoom: 1.0 },
  })
  viewport!: Record<string, any>;
}

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

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateCreatedAt!: { $date: Date };

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: () => ({ $date: new Date() }),
    get: (val: { $date: Date }) => val.$date,
    set: (val: Date) => ({ $date: val }),
  })
  dateLastEdited!: { $date: Date };

  @Prop({ required: true, default: {} })
  components!: Components;

  @Prop({ required: true, default: 'classic' })
  editorType!: string;

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
  this.dateLastEdited = { $date: new Date() };
  next();
});

export const ProjectModel = mongoose.model('projects', ProjectSchema);
