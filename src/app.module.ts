import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TaskModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/taskmanagernest'),
  ],
})
export class AppModule {}
