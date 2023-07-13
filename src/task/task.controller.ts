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

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTasksWithFilters(filterDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskByID(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskByID(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: UserRequest,
  ): Promise<Task> {
    try {
      const { _id }: any = req.user;
      createTaskDto.owner = _id;

      const createdTask = this.taskService.createTask(createTaskDto);
      return createdTask;
    } catch (e) {
      console.log(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteTask(
    @Param('id') taskId: string,
    @Req() req: UserRequest,
  ): Promise<Task> {
    const { _id }: any = req.user;
    return this.taskService.deleteTask(_id, taskId);
  }
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status);
  }
}
