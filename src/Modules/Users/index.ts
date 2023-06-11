import { Request, Response, NextFunction, Router, response } from 'express';
import UserService from './service';
import authorize from "../../Decorators/authorize.decorator";
import { IUser } from './interface';
import HttpException from '../../Exceptions/http.exception';

export default class UserController {

  public router: Router = Router({
    mergeParams: true
  })

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    /**
    * @swagger
    * /users/{id}:
    *   get:
    *     tags: 
    *       - Users
    *     description: "API for getting user by id"
    *     summary: "Get user by id"
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
    *     security: 
    *       - bearerToken: []
    *     parameters:
    *       - in: "path"
    *         description: "Id of user to get"
    *         name: "id"
    *         type: "string"
    *         required: true
    */
    this.router.get('/:id', this.getUserById);

    /**
    * @swagger
    * /users/signup:
    *   post:
    *     tags: 
    *       - Users
    *     description: "API for creating user"
    *     summary: "Add users"
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
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             $ref: "#/definitions/CreateUserSchema"
    */
    this.router.post('/signup', this.addUser);

    /**
    * @swagger
    * /users:
    *   post:
    *     tags: 
    *       - Users
    *     description: "API for getting users"
    *     summary: "Get users"
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
    *                   name: 
    *                     required: false
    *                     type: "string"
    *                     example: "mohit"
    *                   email:
    *                     required: false
    *                     type: "string"
    *                     example: "mohit"
    */
    this.router.post('/', this.getUsers);

    /**
    * @swagger
    * /users/authenticate:
    *   post:
    *     tags: 
    *       - Users
    *     description: "API for authenticating user"
    *     summary: "Authenticate user"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200: 
    *         description: "Logged in successfully"
    *       400: 
    *         description: "Bad API call received"
    *       401: 
    *         description: "Unauthorized request received"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             properties:
    *               email: 
    *                 type: string
    *                 required: true
    *               password: 
    *                 type: string
    *                 required: true
    */
    this.router.post('/authenticate', this.login);

    /**
    * @swagger
    * /users/add-admin-user:
    *   post:
    *     tags: 
    *       - Users
    *     description: "API for creating admin user"
    *     summary: "Add admin user (Access to admin)"
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
    *             $ref: "#/definitions/CreateUserSchema"
    */
    this.router.post('/add-admin-user', this.createAdminUser);

    /**
    * @swagger
    * /users/:
    *   put:
    *     tags:
    *       - Users
    *     description: "API for updating user (Access to admin)"
    *     summary: "Update users"
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
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             properties:
    *               userData: 
    *                 type: "object"
    *                 required: "true"
    *                 schema:
    *                   name: 
    *                     required: false
    *                     type: "string"
    *                     example: "mohit"
    *                   email:
    *                     required: false
    *                     type: "string"
    *                     example: "mohit"
    *               whereCondition:
    *                 type: "object"
    *                 required: "true"
    *                 schema:
    *                   email:
    *                     required: true
    *                     type: "string"
    *                     example: "mohit@gmail.com"   
    */
    this.router.put('/', this.updateUsers);

   /**
   * @swagger
   * /users/:
   *   delete:
   *     tags: 
   *       - Users
   *     description: "API for deleting users (Access to admin)"
   *     summary: "Delete users"
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
   *            schema:
   *              properties:
   *                name: 
   *                  required: false
   *                  type: "string"
   *                  example: "mohit"
   *                email:
   *                  required: false
   *                  type: "string"
   *                  example: "mohit"
   *                id:
   *                  required: false
   *                  type: "string" 
   */
    this.router.delete('/', this.removeUser);


    /**
    * @swagger
    * /users/{id}:
    *   delete:
    *     tags: 
    *       - Users
    *     description: "API for deleting user by id (Access to admin user only)"
    *     summary: "Delete user by id"
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
    *       - in: "path"
    *         description: "Id of user to delete"
    *         name: "id"
    *         type: "string"
    *         required: "true" 
    */
    this.router.delete('/:id', this.deleteById);
  }


  @authorize()
  private async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      let userSrvc: UserService = UserService.instance();


      let users: any = await userSrvc.getUsers(req.body);

      res.send(users);
    } catch (err) {
      next(err);
    }
  }

  @authorize()
  private async getUserById(req: Request, res: Response, next: NextFunction) {
    try { 
      let userSrvc: UserService = UserService.instance();
      let users: any = await userSrvc.getUserById(req.params.id);

      res.send(users);
    } catch (err) {
      next(err);
    }
  }

  private async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      let userSrvc: UserService = UserService.instance();

      let user: any = await userSrvc.addUser(req.body);

      res.send(user);
    } catch (err) {
      next(err);
    }
  }

  @authorize()
  private async updateUsers(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUser: IUser = req.currentUser;

      if (currentUser.role !== "admin") {
        next(new HttpException(401, `Unauthorized access.`));

        return;
      }

      let userSrvc: UserService = UserService.instance();
      console.log("userSrvc");

      let result: any = await userSrvc.updateUsers(req.body.userData, req.body.whereCondition);

      res.send(result);
    } catch (err) {
      next(err);
    }
  }

  @authorize()
  private async removeUser(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUser: IUser = req.currentUser;

      if (currentUser.role !== "admin") {
        next(new HttpException(401, `Unauthorized access.`));

        return;
      }

      let userSrvc: UserService = UserService.instance();

      let result: any = await userSrvc.removeUser(req.body.whereCondition);

      res.send(result);
    } catch (err) {
      next(err);
    }
  }

  @authorize()
  private async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUser: IUser = req.currentUser;

      if (currentUser.role !== "admin") {
        next(new HttpException(401, `Unauthorized access.`));

        return;
      }

      let userSrvc: UserService = UserService.instance();

      let result: any = await userSrvc.deleteUser(req.params.id);

      res.send(result);
    } catch (err) {
      next(err);
    }
  }

  private async createAdminUser(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUser: IUser = req.currentUser;

      if (currentUser.role !== "admin") {
        next(new HttpException(401, `Unauthorized access.`));

        return;
      }

      let userSrvc: UserService = UserService.instance();

      let result: any = await userSrvc.createAdminUser(req.body);

      res.send(result);
    } catch (err) {
      next(err);
    }
  }

  private async login(req: Request, res: Response, next: NextFunction) {
    try {
      let userSrvc: UserService = UserService.instance(); 

      let result: any = await userSrvc.login(req.body.email, req.body.password);

      res.send(result);
    } catch (err) {
      next(err);
    }
  }
}