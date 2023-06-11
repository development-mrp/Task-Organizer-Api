import { Server } from "./server";
import * as dotenv from "dotenv";
dotenv.config();

let server: Server;

try {
  server = new Server(process.env.ENV, process.env.PORT);
  server.start();
} catch (err) {
  process.exit(1);
}