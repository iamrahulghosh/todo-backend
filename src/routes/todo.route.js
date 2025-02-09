import { Router } from "express";
import { 
    createTodo,
    listAllTodo,
    deleteTodo,
    updateTodo,
    toggleStatus
} from "../controllers/todo.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create").post(auth, createTodo)
router.route("/list").get(auth, listAllTodo)
router.route("/delete").delete(auth, deleteTodo)
router.route("/update").patch(auth, updateTodo)
router.route("/toggle").patch(auth, toggleStatus)

export default router