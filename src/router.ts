import { Application } from "express";
import UserController from "./Modules/Users";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from "../package.json";
import TasksController from "./Modules/Tasks";
export class Router {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public initializeRoutes = () => {
    this.app.get("/", (req, res) => {
      res.status(200).send({
        message: "Hello World!",
      });
    });

    this.app.use("/users", new UserController().router);
    this.app.use("/tasks", new TasksController().router);

    const options = {
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: 'To Do app',
          version,
          summary:"The Task Organizer API is a feature-rich task management application built using Node.js and MongoDB.",
          description: 'It provides an intuitive and efficient way to organize your tasks, set priorities, and keep track of your progress. This app is designed to streamline your workflow and enhance your productivity.',
          contact: {
            "name": "Mohit Raj Panday",
            // "email": "test@test.com"
          },
          servers: ["http://localhost:3000"]
        },
        tags: [{
          name: "Users",
          description: "Everything about users.",
          // externalDocs: {
          //   url: "http://swagger.io",
          //   description: "Find out more about Swagger",
          // }
        }, {
          name: "Tasks",
          description: "Everything about Tasks.",
          // externalDocs: {
          //   url: "http://swagger.io",
          //   description: "Find out more about Swagger",
          // }
        }],
        components: {
          securitySchemes: {
            bearerToken: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        },
      },
      apis: ['src/**/*.ts'],
    }

    const swaggerOptions = {
      // customCss: '.swagger-ui .auth-wrapper { display: none }',
      sorter: "alphabetical",
      swaggerOptions: {},
    };

    const swaggerDocs = swaggerJsdoc(options);

    this.app.use("/explorer", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions));
  };
}
