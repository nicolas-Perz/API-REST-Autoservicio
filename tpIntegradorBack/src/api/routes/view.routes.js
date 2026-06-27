import {Router} from "express"
import { join, __dirname } from "../utils/index.js"
import { createProuctView, deleteProductView, getProductView, indexView, updateProductView } from "../controllers/view.controllers.js"

const router = Router()

// vista principal dashboard
router.get("/index",indexView)

router.get("/consultar",getProductView)

router.get("/crear", createProuctView)

router.get("/modificar", updateProductView)

router.get("/eliminar", deleteProductView)

export default router