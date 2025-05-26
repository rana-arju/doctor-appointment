import express, { Request, Response } from 'express';
import { adminController } from './user.controller';

const router = express.Router();
router.post("/", adminController.createAdmin)

export  const userRoutes = router