import q from "q";
import HttpException from "../../Exceptions/http.exception";
import { IUser } from "../Users/interface";
import { ITask } from "./interface";
import TaskModel from "./model";


export default class TaskService {
  private static $_instance: TaskService = null;

  constructor() { }

  public static instance(): TaskService {
    if (TaskService.$_instance == null) {
      TaskService.$_instance = new TaskService();
    }

    return TaskService.$_instance;
  }
  /**
   * @Comment Function  to create task
   */
  public async createTask(requestData: any, createdBy: IUser): Promise<Error | any> {
    let defer: q.Deferred<Error | any> = q.defer<Error | any>();

    try {
      let task: ITask = await TaskModel.create({
        title: requestData.title,
        summary: requestData.summary,
        completed: false,
        createdBy: createdBy._id  
      });

      defer.resolve(task);
    } catch (err) {
      defer.reject(err);
    }
    return defer.promise;
  }

  /**
   * @Comment Function  to update task
   */
  public async updateTask(id: string, task: any, currentUser: IUser): Promise<Error | any> {
    let defer: q.Deferred<Error | any> = q.defer<Error | any > ();

    try { 
      let tasks: any = await TaskModel.updateOne({_id: id, createdBy: currentUser._id}, task);

      defer.resolve(tasks);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  /**
   * @Comment Function  to delete task
   */
  public async deleteTask(id: string, currentUser: any): Promise<Error | any> {
    let defer: q.Deferred<Error | any> = q.defer<Error | any > ();

    try {
      let res = await TaskModel.deleteOne({_id: id, createdBy: currentUser._id});  

      defer.resolve(res);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  /**
   * @Comment Function  to get task
   */
  public async getTask(id: string, currentUser: IUser): Promise<Error | any> {
    let defer: q.Deferred<Error | any> = q.defer<Error | any > ();

    try {
      let task: any = await TaskModel.findOne({_id: id, createdBy: currentUser._id});

      if (!task) {
        defer.reject(new HttpException(404, `Task not found`));

        return defer.promise;
      }

      defer.resolve(task);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  /**
   * @Comment Function  to get all tasks
   */
  public async getAllTasks(requestData: any, currentUser: IUser): Promise<Error | any> {
    let defer: q.Deferred<Error | any> = q.defer<Error | any > ();

    try {
      let page = 1;
      let pageSize = 10;
      let where: any = {};

      if (requestData.page) {
        page = requestData.page;
      }

      if (requestData.pageSize) {
        pageSize = requestData.pageSize;
      }

      if (requestData.where) {
        if (requestData.where.title && requestData.where.title.trim().length > 0) {
          where.title =  { $regex: requestData.where.title } ;
        }

        if (requestData.where.summary && requestData.where.summary.trim().length > 0) {
          where.summary =  { $regex: requestData.where.summary } ;
        }
      }

      where['createdBy'] = currentUser._id;
      
      let tasks: any = await TaskModel.find(where).skip((page-1)*pageSize).limit(pageSize);

      defer.resolve({
        data: tasks,
        page,
        pageSize,
      });
    } catch (err) {
      defer.reject(err);
    }
    return defer.promise;
  }
  
}