import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Task } from './task.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { JwtAuthGuard } from 'src/guards/authGuard';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { UsersController } from 'src/users/users.controller';
import { UserModel } from 'src/users/users.model';

@Module({
  imports: [TypegooseModule.forFeature([Task, UserModel])],
  controllers: [TaskController],
  providers: [TaskService, JwtAuthGuard, UsersService],
})
export class TaskModule {}
