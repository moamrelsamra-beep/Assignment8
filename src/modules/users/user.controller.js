import {Router} from "express"
import * as US from "./user.service.js"

const router = Router()

router.post("/signup", US.signup)
router.post("/login", US.login)
router.patch("/:id", US.updateUser)
router.delete("/:id", US.deleteUser)
router.get("/", US.getUserById)


export default router;
