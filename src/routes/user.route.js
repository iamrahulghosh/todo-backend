import { Router } from "express"
import {
    signup,
    signin,
    currentUser,
    logout,
    updateUserName,
    updateProfilePassword
} from "../controllers/user.controller.js"
import auth from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/signup").post(signup)
router.route("/signin").post(signin)
router.route("/current-user").get(auth, currentUser)
router.route("/logout").get(auth, logout)
router.route("/update/name").patch(auth, updateUserName)
router.route("/update/password").patch(auth, updateProfilePassword)

export default router