import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { JwtAuthGuard } from './guards/authGuard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TaskModule,
    TypegooseModule.forRoot(process.env.DB_URL),
    UsersModule,
  ],
})
export class AppModule {}
