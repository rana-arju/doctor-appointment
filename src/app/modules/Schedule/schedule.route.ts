import express from "express";
import { ScheduleController } from "./schedule.container";

const router = express.Router();

router.post("/", ScheduleController.inserIntoDB);

export const ScheduleRoutes = router;
