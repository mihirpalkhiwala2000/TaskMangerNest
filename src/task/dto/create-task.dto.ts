import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  owner: string;
}
