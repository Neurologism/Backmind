import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import mongoose from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Node {
  @Prop({ required: false, type: () => String })
  id!: string;

  @Prop({ required: false, type: () => String })
  type!: string;

  @Prop({ required: false, type: () => Boolean })
  initialized!: boolean;

  @Prop({
    type: raw({
      x: { type: Number },
      y: { type: Number },
    }),
    required: false,
  })
  position!: Record<string, number>;

  @Prop({ type: () => Object, required: false })
  data!: Record<string, any>;

  @Prop({ required: false, type: () => String })
  identifier!: string;

  @Prop({ required: false, type: () => String })
  group_identifier!: string;
}

@Schema()
export class Edge {
  @Prop({ required: true, type: () => String })
  id!: string;

  @Prop({ required: true, type: () => String })
  type!: string;

  @Prop({ required: true, type: () => String })
  source!: string;

  @Prop({ required: true, type: () => String })
  target!: string;

  @Prop({ required: true, type: () => String })
  sourceHandle!: string;

  @Prop({ required: true, type: () => String })
  targetHandle!: string;

  @Prop(raw({}))
  data!: Record<string, any>;

  @Prop({ required: true, type: () => String })
  label!: string;

  @Prop({ required: true, type: () => Boolean })
  animated!: boolean;

  @Prop({ required: true, type: () => Number })
  animationSpeed!: number;

  @Prop(
    raw({
      stroke: { type: String },
      strokeWidth: { type: Number },
    })
  )
  style!: Record<string, any>;

  @Prop({ required: true, type: () => Number })
  sourceX!: number;

  @Prop({ required: true, type: () => Number })
  sourceY!: number;

  @Prop({ required: true, type: () => Number })
  targetX!: number;

  @Prop({ required: true, type: () => Number })
  targetY!: number;
}

@Schema()
export class Components {
  @Prop({ required: false, default: [], type: () => [Node] })
  nodes!: Node[];

  @Prop({ required: false, default: [], type: () => [Edge] })
  edges!: Edge[];

  @Prop({ required: false, type: () => [Number] })
  position!: number[];

  @Prop({ required: false, type: () => Number })
  zoom!: number;

  @Prop({
    type: raw({
      x: { type: Number },
      y: { type: Number },
      zoom: { type: Number },
    }),
    required: false,
    default: { x: 0.1, y: 0.1, zoom: 1.0 },
  })
  viewport!: Record<string, any>;

  @Prop({ required: false, type: () => [Object] })
  perceptrons!: Array<Object>;

  @Prop({ required: false, type: () => [String] })
  inputNodes!: Array<string>;

  @Prop({ type: raw({}), required: false })
  inputNodeUserValues!: Record<string, number>;
}

@Schema()
export class Project {
  @Prop({ required: true, type: () => String })
  name!: string;

  @Prop({
    required: false,
    default: '',
    type: () => String,
  })
  description!: string;

  @Prop({ required: true, ref: 'users', type: () => Types.ObjectId })
  ownerId!: Types.ObjectId;

  @Prop({ enum: ['public', 'private'], required: true, type: () => String })
  visibility!: string;

  @Prop({ required: true, default: () => new Date(), type: () => Date })
  dateCreatedAt!: Date;

  @Prop({ required: true, default: () => new Date(), type: () => Date })
  dateLastEdited!: Date;

  @Prop({ required: true, default: {}, type: () => Components })
  components!: Components;

  @Prop({ required: true, default: 'classic', type: () => String })
  editorType!: string;

  @Prop({
    required: true,
    default: [],
    ref: 'tasks',
    type: () => [Types.ObjectId],
  })
  tasks!: Types.ObjectId[];

  @Prop({ required: true, default: false, type: () => Boolean })
  isTutorialProject!: boolean;

  @Prop({ ref: 'tutorials', type: () => Types.ObjectId })
  tutorialId?: Types.ObjectId;

  @Prop({ type: () => Number })
  tutorialStep?: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const ProjectModel = mongoose.model('projects', ProjectSchema);
