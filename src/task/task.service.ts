import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    public taskModel: Model<Task>,
  ) {}

  async getAllTasks(ownerId: string): Promise<Task[]> {
    const tasks = await this.taskModel.find({ owner: ownerId });
    if (!tasks.length) {
      throw new Error();
    }
    return tasks;
  }

  async getTasksWithFilters(
    filterDto: GetTasksFilterDto,
    ownerId: string,
  ): Promise<Task[] | null> {
    const { status, search } = filterDto;

    let tasks = await this.getAllTasks(ownerId);
    if (!tasks.length) {
      throw new Error();
    }

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
  async getTaskByID(id: string, ownerId: string): Promise<Task | Error> {
    const task = await this.taskModel.findOne({ _id: id, owner: ownerId });
    if (!task) {
      throw new Error();
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<any> {
    const { title, description, owner } = createTaskDto;
    const task: any = {
      title,
      description,
      status: TaskStatus.OPEN,
      owner,
    };

    const newTask = await this.taskModel.create(task);

    return newTask;
  }

  async deleteTask(_id: string, taskId: string): Promise<Task | Error> {
    const deletedTask = await this.taskModel.findOneAndDelete({
      _id: taskId,
      owner: _id,
    });
    if (!deletedTask) {
      throw new Error();
    }
    return deletedTask;
  }

  async updateTaskStatus(id: string, status: TaskStatus, ownerId: string) {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: id, owner: ownerId },
      { status },
      {
        new: true,
      },
    );
    if (!task) {
      throw new Error();
    }
    return task;
  }
}
