import {Router} from "express";
import { getNearestStore } from "../Controllers/store.controller.js";
const router = Router();

router.get("/getNearestStore",getNearestStore) ;





export default router;