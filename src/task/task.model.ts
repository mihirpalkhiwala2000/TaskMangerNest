import { modelOptions, prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@modelOptions({ schemaOptions: { timestamps: true, collection: 'Task' } })
export class Task {
  @prop()
  title: string;

  @prop({ required: true })
  description: string;

  @prop()
  status: TaskStatus;

  @prop()
  owner: string;
}
