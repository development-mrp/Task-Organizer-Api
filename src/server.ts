import bodyParser from "body-parser";
import express from "express";
import { Server as HServer } from "http";
import path from "path";
import { Router } from "./router";
import errorMiddleware from "./Middlewares/error.midleware";
import MongoClient from "./Modules/utils/DB";

export class Server {
  private env: string;
  private port: string;
  private app: express.Application;

  private server: HServer;
  private router: Router;

  constructor(env: string, port: string) {
    if (!env) {
      throw new Error("Environment is required.");
    }

    if (!port) {
      throw new Error("Port is required.");
    }

    this.env = env;
    this.port = port;

    this.bootstarp();
  }

  private bootstarp(): void {
    this.app = express();

    this.server = new HServer(this.app);

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, "../public")));

    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers", "*"
      );
      res.header("Access-Control-Allow-Methods", "*");
      next();
    });

    this.router = new Router(this.app);

    this.router.initializeRoutes();

    this.app.use(errorMiddleware);

    let client:MongoClient = MongoClient.instance();
    
    client.connectMongoose();
  }

  public start(): void {
    if (!this.server) {
      throw new Error("Express server is not initialized.");
    }

    this.server.listen(this.port, () => {
      console.log(`Express server listening on port ${this.port}.`);
    });
  }
}
