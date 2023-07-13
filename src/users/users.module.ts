import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserModel } from './users.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { JwtAuthGuard } from 'src/guards/authGuard';
import { Task } from 'src/task/task.model';

@Module({
  imports: [TypegooseModule.forFeature([UserModel, Task])],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard],
})
export class UsersModule {}
