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
  Res,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from 'src/guards/authGuard';
import { UserRequest } from 'src/users/users.controller';
import { errorMsgs, statusCodes } from '../../constants';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @Req() req: UserRequest,
    @Res() res,
  ) {
    try {
      const ownerId = req._id;
      if (Object.keys(filterDto).length) {
        const filteredTasks = await this.taskService.getTasksWithFilters(
          filterDto,
          ownerId,
        );
        res.status(statusCodes.success).send(filteredTasks);
      } else {
        const allTasks = await this.taskService.getAllTasks(ownerId);
        res.status(statusCodes.success).send(allTasks);
      }
    } catch {
      res.status(statusCodes.notFound).send(errorMsgs.emptyTaskArray);
    }
  }

  @Get('/:id')
  async getTaskByID(
    @Param('id') id: string,
    @Req() req: UserRequest,
    @Res() res,
  ) {
    try {
      const ownerId = req._id;
      res
        .status(statusCodes.success)
        .send(await this.taskService.getTaskByID(id, ownerId));
    } catch {
      res.status(statusCodes.notFound).send(errorMsgs.noTaskFound);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: UserRequest,
    @Res() res,
  ) {
    try {
      createTaskDto.owner = req._id;

      const createdTask = await this.taskService.createTask(createTaskDto);
      res.status(statusCodes.created).send(createdTask);
    } catch (e) {
      res.status(statusCodes.badRequest).send(e.message);
    }
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') taskId: string,
    @Req() req: UserRequest,
    @Res() res,
  ) {
    try {
      const ownerId = req._id;
      res
        .status(statusCodes.success)
        .send(await this.taskService.deleteTask(ownerId, taskId));
    } catch (e) {
      res.status(statusCodes.notFound).send(errorMsgs.noTaskFound);
    }
  }
  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Req() req: UserRequest,
    @Res() res,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    try {
      const ownerId = req._id;
      const { status } = updateTaskStatusDto;
      res
        .status(statusCodes.success)
        .send(await this.taskService.updateTaskStatus(id, status, ownerId));
    } catch (e) {
      res.status(statusCodes.notFound).send(errorMsgs.noTaskFound);
    }
  }
}
