import {Router} from "express"
import connection from "../database/db.js"
import { validateId, validateProduct } from "../middlewares/middlewares.js"
import { createProduct, removeProduct, getAllProducts, getProductById, modifyProduct } from "../controllers/product.controllers.js"

const router = Router()

router.get("/", getAllProducts)

router.get("/:id", validateId, getProductById)

router.post("/",validateProduct,createProduct)

router.delete("/:id",validateId,removeProduct)

router.put("/", modifyProduct)

export default router