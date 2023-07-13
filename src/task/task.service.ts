import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { errorMsgs } from '../../constants';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    public taskModel: Model<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskModel.find();

    return tasks;
  }

  async getTasksWithFilters(
    filterDto: GetTasksFilterDto,
  ): Promise<Task[] | null> {
    const { status, search } = filterDto;

    let tasks = await this.getAllTasks();
    console.log('🚀 ~ file: task.service.ts:32 ~ TaskService ~ tasks:', tasks);

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.toLowerCase().includes(search) ||
          task.description.includes(search)
        ) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }
  async getTaskByID(id: string): Promise<Task> {
    const found = await this.taskModel.findById(id);

    if (!found) {
      throw new NotFoundException(errorMsgs.noTaskFound);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<any> {
    const { title, description } = createTaskDto;
    const task: any = {
      title,
      description,
      status: TaskStatus.OPEN,
    };

    const newTask = await this.taskModel.create(task);

    return newTask;
  }

  async deleteTask(id: string): Promise<Task> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      throw new NotFoundException(errorMsgs.noTaskFound);
    }
    return deletedTask;
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.taskModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      },
    );
    return task;
  }
}
