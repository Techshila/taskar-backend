import {Router} from "express";
const router = Router();  
import {addTransaction} from "../Controllers/transaction.controller.js";  

router.post("/addTransaction",addTransaction);

// router.get("/getTransactions",getTransactions);

export default router;