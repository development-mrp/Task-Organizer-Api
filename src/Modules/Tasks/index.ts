import { Request, Response, NextFunction, Router, response } from 'express';
import authorize from '../../Decorators/authorize.decorator';
import { IUser } from '../Users/interface';
import TaskService from './service';

export default class TasksController {

  public router: Router = Router({
    mergeParams: true
  })

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {

    /**
    * @swagger
    * /tasks/getAllTasks:
    *   post:
    *     tags: 
    *       - Tasks
    *     description: "API for getting tasks"
    *     summary: "Get tasks"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200: 
    *         description: "Query executed successfully"
    *       400: 
    *         description: "Bad API call received"
    *       401: 
    *         description: "Unauthorized request received"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     parameters:
    *       - in: "header"
    *         description: "JWT token of logger in user"
    *         name: "authorization"
    *         type: "string"
    *         required: "true" 
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             properties:
    *               page:
    *                 type: number
    *                 description: "The page number for pagination"
    *                 minimum: 1
    *               pageSize:
    *                 type: number
    *                 description: "The page size for pagination"
    *                 minimum: 10
    *               where:
    *                 type: "object"
    *                 required: false
    *                 schema:
    *                   title: 
    *                     required: false
    *                     type: "string"
    *                     example: "task title"
    *                     description: "title of the task"
    */
    this.router.post('/getAllTasks', this.getAllTasks);

    /**
    * @swagger
    * /tasks/{id}:
    *   get:
    *     tags: 
    *       - Tasks
    *     description: "API for getting task by id"
    *     summary: "Get task by id"
    *     consumes: 
    *       - application/json
    *     produces: 
    *       - application/json
    *     responses:
    *       200: 
    *         description: "Query executed successfully"
    *       400: 
    *         description: "Bad API call received"
    *       401: 
    *         description: "Unauthorized request received"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     parameters:
    *       - in: "header"
    *         description: "JWT token of logger in user"
    *         name: "authorization"
    *         type: "string"
    *         required: "true" 
    *       - in: "path"
    *         description: "Id of task to get"
    *         name: "id"
    *         type: "string"
    *         required: "true" 
    */
    this.router.get('/:id', this.getTask);

    /**
    * @swagger
    * /tasks:
    *   post:
    *     tags: 
    *       - Tasks
    *     description: "API for creating tasks"
    *     summary: "Add user task"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200: 
    *         description: "Query executed successfully"
    *       400: 
    *         description: "Bad API call received"
    *       401: 
    *         description: "Unauthorized request received"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     parameters:
    *       - in: "header"
    *         description: "JWT token of logger in user"
    *         name: "authorization"
    *         type: "string"
    *         required: true 
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             $ref: "#/definitions/CreateTaskSchema"
    */
    this.router.post('/', this.createTask);

    /**
    * @swagger
    * /tasks/{id}:
    *   put:
    *     tags: 
    *       - Tasks
    *     description: "API for updating task by id"
    *     summary: "Update user task"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200: 
    *         description: "Query executed successfully"
    *       400: 
    *         description: "Bad API call received"
    *       401: 
    *         description: "Unauthorized request received"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     parameters:
    *       - in: "header"
    *         description: "JWT token of logger in user"
    *         name: "authorization"
    *         type: "string"
    *         required: true 
    *       - in: "path"
    *         description: "Id of task to update"
    *         name: "id"
    *         type: "string"
    *         required: true 
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             properties:
    *               title: 
    *                 description: "Title of task"
    *                 type: "string"
    *                 example: "Title of task"
    *               summary: 
    *                 description: "summary of task"
    *                 type: "string"
    *                 example: "summary of task"
    *               completed: 
    *                 description: "Completed status of task"
    *                 type: "string"
    *                 example: true
    */
    this.router.put('/:id', this.updateTask);
    /**
    * @swagger
    * /tasks/{id}:
    *   delete:
    *     tags: 
    *       - Tasks
    *     description: "API for deleting task by id"
    *     summary: "Delete user task"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200: 
    *         description: "Query executed successfully"
    *       400: 
    *         description: "Bad API call received"
    *       401: 
    *         description: "Unauthorized request received"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     parameters:
    *       - in: "header"
    *         description: "JWT token of logger in user"
    *         name: "authorization"
    *         type: "string"
    *         required: true 
    *       - in: "path"
    *         description: "Id of task to delete"
    *         name: "id"
    *         type: "string"
    *         required: true 
    */
    this.router.delete('/:id', this.deleteTask);
  }
  
  @authorize()
  private async getAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUser: IUser =  req.currentUser;
      
      let taskSrvc: TaskService = TaskService.instance();

      let tasks = await taskSrvc.getAllTasks(req.body, currentUser);
      
      res.send(tasks);
    } catch (err) {
      next(err);
    }
  }
  
  @authorize()
  private async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUser: IUser =  req.currentUser;

      let taskSrvc: TaskService = TaskService.instance();

      let task = await taskSrvc.getTask(req.params.id, currentUser);
      
      res.send(task);

    } catch (err) {
      next(err);
    }
  }
  
  @authorize()
  private async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUser: IUser =  req.currentUser;
      
      let taskSrvc: TaskService = TaskService.instance();

      let task = await taskSrvc.createTask(req.body, currentUser);
      
      res.send(task);
    } catch (err) {
      next(err);
    }
  }
  
  @authorize()
  private async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUser: IUser =  req.currentUser;
      
      let taskSrvc: TaskService = TaskService.instance();

      let task = await taskSrvc.updateTask(req.params.id, req.body, currentUser);
      
      res.send(task);

    } catch (err) {
      next(err);
    }
  }
  
  @authorize()
  private async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUser: IUser =  req.currentUser;

      let taskSrvc: TaskService = TaskService.instance();

      let task = await taskSrvc.deleteTask(req.params.id, currentUser);
      
      res.send(task);
    } catch (err) {
      next(err);
    }
  }
}