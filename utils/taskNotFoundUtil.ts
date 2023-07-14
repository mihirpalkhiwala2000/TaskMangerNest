import { errorMsgs } from '../constants';
import { Task } from 'src/task/task.model';

export const taskCheck = async (task: Task) => {
  if (!task) {
    throw new Error(errorMsgs.noTaskFound);
  }
  return task;
};
