import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/User/user.route";
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRoutes);




app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to the Express server!",
    developer: "Mohammad Rana Arju",
  });
});

export default app;
