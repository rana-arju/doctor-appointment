import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

import router from "./app/router";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
const app: Application = express();
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to the Express server!",
    developer: "Mohammad Rana Arju",
  });
});
app.use(globalErrorHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    error: 
    {
      path:  req.originalUrl,
      message: "Your requested resource was not found on this server.",
      
    },
  });
  next();
});
export default app;
