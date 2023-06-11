export interface ITask {
  _id?: string;
  title: string;
  summary: string;
  createdBy: string;
  completed?: boolean;
  createdAt?: Date;
}
