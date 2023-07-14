import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from 'src/guards/authGuard';
import { UserRequest } from 'src/users/users.controller';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @Req() req: UserRequest,
  ): Promise<Task[]> {
    const ownerId = req._id;
    if (Object.keys(filterDto).length) {
      return this.taskService.getTasksWithFilters(filterDto, ownerId);
    } else {
      return this.taskService.getAllTasks(ownerId);
    }
  }

  @Get('/:id')
  getTaskByID(@Param('id') id: string, @Req() req: UserRequest): Promise<Task> {
    const ownerId = req._id;
    return this.taskService.getTaskByID(id, ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: UserRequest,
  ): Promise<Task> {
    try {
      createTaskDto.owner = req._id;

      const createdTask = this.taskService.createTask(createTaskDto);
      return createdTask;
    } catch (e) {
      console.log(e);
    }
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') taskId: string,
    @Req() req: UserRequest,
  ): Promise<Task> {
    const ownerId = req._id;
    return this.taskService.deleteTask(ownerId, taskId);
  }
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Req() req: UserRequest,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const ownerId = req._id;
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status, ownerId);
  }
}
